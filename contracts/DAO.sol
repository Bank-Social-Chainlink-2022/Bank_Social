// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./IMemberCard.sol";
import "./IDAOVault.sol";

error Election__NoCandidates();
error Payment__Failure();

contract DAO is  KeeperCompatibleInterface  {
    using Counters for Counters.Counter;

    IDAOVault daoVault;

    IMemberCard memberCardInterface;
    address memberCardAddr;

    bool public payoutInProgress = false;
    uint256 public weeklyTimeSchedule = 120; //payouts counter tracker

    enum ProposelPeriod {
        OPEN,
        CLOSED
    }

    ProposelPeriod public s_proposelPeriod = ProposelPeriod.OPEN;

    uint [] public s_proposals;
    address public owner;

    uint256 public intervalWeek = 60; //1 minute
    uint256 public lastTimeStamp;

    struct Proposal {
        uint id;
        uint tokenId;
        address proposer;
        address receiver;
        uint amount;
        bool tokenSwap;
        string description;
        uint yesVotes;
        uint noVotes;
        bool isPassed;
    }
    mapping (uint => Proposal) public proposals;
    mapping(uint => mapping(address => bool)) public voterHistory;

    uint public totalVotesThreshold;
    uint public voterThreshold = 1;
    uint public proposalThreshold;

    uint public totalProposals;
    uint public proposalsPassed;

    //DAO EVENTS 
    event ProposalCreated(address indexed _proposer, address _receiver, uint _id, uint256 _amount, string _ipfsHash, bool _tokenSwap, uint _tokenId);
    event ProposalElected(bool _passed, address indexed _proposer, address indexed _receiver, uint _id, uint _tokenId);
    event VoteCast(address indexed _from, uint256 _votesUp, uint256 _votesDown, bool _yes, uint _proposalid, uint _tokenId);
    event TokenWeight(
        uint256 indexed _TOKENID, 
        address indexed contractAddress, 
        uint256 _WEIGHT
    );
 
    constructor(
        address _daoVault,
        address _memberCardInterface
    ){

        daoVault = IDAOVault(_daoVault);
        memberCardInterface = IMemberCard(_memberCardInterface);
        memberCardAddr = _memberCardInterface;
    }

    function propose (bool _tokenSwap, string memory _ipfsHash, address _receiver, uint256 _tokenId) public {
        require(s_proposelPeriod == ProposelPeriod.OPEN, "Proposel Period is not open");
        
        address tokenOwner = IERC721(memberCardAddr).ownerOf(_tokenId);
        require(IERC721(memberCardAddr).balanceOf(msg.sender) >= 1, "Use doesn't have enough NFTs to create proposal"); 
        require(tokenOwner == msg.sender);


        Proposal memory _proposal;

        _proposal.id = totalProposals;
        _proposal.tokenId = _tokenId;
        _proposal.proposer = msg.sender;
        _proposal.receiver = _receiver;
        _proposal.amount = 10;
        _proposal.tokenSwap = _tokenSwap;
        _proposal.description = _ipfsHash;

        proposals[_proposal.id] = _proposal;
        totalProposals +=1;

        s_proposals.push(totalProposals);

        emit ProposalCreated(msg.sender, _receiver, _proposal.amount , _proposal.id, _ipfsHash, _tokenSwap, _tokenId);
 
    }

    function getHighestVote() internal returns (uint256) {
 
            uint256 winningID;
            uint256 getLog = 0;
 
            for (uint i = 0; i < s_proposals.length; i++) {
                uint largestValue = getLog;
                if(proposals[i].yesVotes >= largestValue){
                    getLog = proposals[i].yesVotes;
                    winningID = proposals[i].id;  
                }
                else if (proposals[i].yesVotes < largestValue){
 
                        largestValue = getLog;
                }  
            }
            proposals[winningID].isPassed = true;

            emit ProposalElected(proposals[winningID].isPassed, proposals[winningID].proposer, proposals[winningID].receiver, proposals[winningID].id, proposals[winningID].tokenId);

            return winningID;  
    }
 
    function getLosers(uint256 _winningProposal) internal {

          for (uint i = 0; i <= s_proposals.length; i++) {
                if(proposals[i].yesVotes <= proposals[_winningProposal].yesVotes){
                    proposals[i].isPassed = false;
                    emit ProposalElected(proposals[i].isPassed, proposals[i].proposer, proposals[i].receiver, proposals[i].id, proposals[i].tokenId);
                    delete proposals[i];
                }
            }
    }
 
    function calculateWinner() internal returns (address, address, bool, uint256, uint256) {
        require((block.timestamp - lastTimeStamp) > intervalWeek);

        uint256 winningProposal = getHighestVote();
 
        address winnerAddress = proposals[winningProposal].receiver;

        address proposer = proposals[winningProposal].proposer;
 
        uint256 awardAmount = proposals[winningProposal].amount;

        uint256 tokenId = proposals[winningProposal].tokenId;

        bool tokenSwap = proposals[winningProposal].tokenSwap;

        getLosers(winningProposal);
 
        delete proposals[winningProposal];
        s_proposals = new uint[](0);
        delete totalProposals;
        lastTimeStamp = 0;

        s_proposelPeriod = ProposelPeriod.CLOSED; //while calculating it is closed

        return (winnerAddress, proposer, tokenSwap, awardAmount, tokenId);

    }

    function vote(bool _yes, uint _proposalId, uint256 _tokenId) public {
        require(s_proposelPeriod == ProposelPeriod.OPEN, "Proposel Period is not open");
        //require(voterHistory[_proposalId][msg.sender] == false, "User already voted");
        //How do we get people to vote once 

        address tokenOwner = IERC721(memberCardAddr).ownerOf(_tokenId);
        require(IERC721(memberCardAddr).balanceOf(msg.sender) >= 1, "Use doesn't have enough NFTs to create proposal"); 
        require(tokenOwner == msg.sender);

        uint256 _weightedVote = memberCardInterface.calculateWeight(_tokenId);

        if (_yes) {
            proposals[_proposalId].yesVotes += (1 + _weightedVote);
        //we are not using no votes only yesVotes
        } else {
            proposals[_proposalId].noVotes += (1 + _weightedVote);
        }
        //voterHistory[_proposalId][msg.sender] == true;
        emit TokenWeight(
            _tokenId, 
            address(this), 
            _weightedVote
        );
    }

    function manualPerformUpkeep() public {
        (address _winnerAddress, address _proposer, bool _tokenSwap, uint256 _amount, uint _tokenId) = calculateWinner();
        daoVault.setBenificiary(_winnerAddress, _proposer, _amount, _tokenSwap, _tokenId);
        //passTime();
    }

    //this should be internal but for testing lets keep
    function passTime() public {
        weeklyTimeSchedule = weeklyTimeSchedule - 20;
        payout();
    }

    function reset() internal {
        weeklyTimeSchedule = weeklyTimeSchedule + 40;
        payoutInProgress = false;
        uint256 _tokenId = daoVault.getBenificiaryId();
        memberCardInterface.resetNonTransferableToken(_tokenId);
        daoVault.deleteBenificiary();
    }

    function sendFundsToUser() internal {
        daoVault.autoPayout();
    }

    //We Will Try This Weekly Payout Thing Later For Noiw Lets Just Do Single Payouts
    //We are going to pay them in 4 over 10 - 15 min - we might make this plus 1 just to show what is happening
    //function payout() internal {   
            //sendFundsToUser();
        //if (weeklyTimeSchedule == 100) {
            //sendFundsToUser();
        //} else if (weeklyTimeSchedule  == 80) {
            //sendFundsToUser();
        //} else if (weeklyTimeSchedule  == 60) { 
            //sendFundsToUser(); 
        //} else if (weeklyTimeSchedule == 40) { 
            //reset();
        //} 
    //}

    function payout() internal {  
        if(weeklyTimeSchedule >= 100) {
            sendFundsToUser();
        }
        else if (weeklyTimeSchedule == 80) {
            reset();
        } 
    } 

    function checkUpkeep(
        bytes calldata /* checkData */
    )
        public
        view
        returns (
            bool upkeepNeeded,
            bytes memory /* performData */
        )
    {
 
        //bool isOpen = ProposelPeriod.OPEN == s_proposelPeriod;
        bool timePassed = ((block.timestamp - lastTimeStamp) > intervalWeek);
        //bool hasCandidates = s_proposals.length > 0;
        upkeepNeeded = (timePassed); //asCandidates
        return (upkeepNeeded, "0x0");
       
    }
 
    function performUpkeep(
        bytes calldata /* performData */
    ) external {
 
            if((block.timestamp - lastTimeStamp) > intervalWeek){

                if(!payoutInProgress && s_proposals.length > 0){

                    (address _winnerAddress, address _proposer, bool _tokenSwap, uint256 _amount, uint _tokenId) = calculateWinner();
                    daoVault.setBenificiary(_winnerAddress, _proposer, _amount, _tokenSwap, _tokenId);
                    passTime();
                    s_proposelPeriod = ProposelPeriod.OPEN;
                    payoutInProgress = true;
 
                //Hold Funds Till The Next Stake Period 
                } else if(payoutInProgress == true) {
               
                    passTime();
 
                } else {

                    revert Election__NoCandidates();
                }
 
                lastTimeStamp = block.timestamp;
            }        
    }
}