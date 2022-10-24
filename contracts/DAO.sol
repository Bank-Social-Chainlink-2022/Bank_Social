// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./IDAOVault.sol";

error Election__NoCandidates();
error Payment__Failure();

//make the proposers ID non transferable for the duration of the stake
contract DAO is AccessControlEnumerable, KeeperCompatibleInterface  {
    using Counters for Counters.Counter;

    IDAOVault daoVault;

    //should we create a modifier for the MOD
    bool public payoutInProgress = true;
    uint256 public weeklyTimeSchedule = 120; //This is how much it subtracts by 

    enum ProposelPeriod {
        OPEN,
        CLOSED
    }

    ProposelPeriod public s_proposelPeriod = ProposelPeriod.OPEN;

    uint [] public s_proposals;
    address public owner;

    uint256 public immutable intervalWeek = 600; //10 minutes this is when the payout is called 
    uint256 public lastTimeStamp;

    struct Proposal {
        uint id;
        address proposer;
        address receiver;
        uint amount;
        string tokenSelection;
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

    bytes32 public constant ADMIN = keccak256("ADMIN");

    //DAO EVENTS 
    event ProposalCreated(address indexed _proposer, address _receiver, uint _id, uint256 _amount, string _ipfsHash, string _tokenSelection);
    event ProposalElected(bool _passed, address indexed _proposer, address indexed _receiver, uint _id);
    event VoteCast(address indexed _from, uint256 _votesUp, uint256 _votesDown, bool _yes, uint _proposalid);
 
    constructor(
        address _adminContract,
        address _daoVault
    ){

        _grantRole(ADMIN, _adminContract);
        daoVault = IDAOVault(_daoVault);
    }

    function propose (uint _amount, string memory _tokenSelection, string memory _ipfsHash, address _customer, address _receiver) public onlyRole(ADMIN) {
        require(s_proposelPeriod == ProposelPeriod.OPEN, "Proposel Period is not open");

        Proposal memory _proposal;

        _proposal.id = totalProposals;
        _proposal.proposer = _customer;
        _proposal.receiver = _receiver;
        _proposal.amount = _amount;
        _proposal.tokenSelection = _tokenSelection;
        _proposal.description = _ipfsHash;

        proposals[_proposal.id] = _proposal;
        totalProposals +=1;

        s_proposals.push(totalProposals);

        emit ProposalCreated(_customer, _receiver, _amount, _proposal.id, _ipfsHash, _tokenSelection);
 
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

            emit ProposalElected(proposals[winningID].isPassed, proposals[winningID].proposer, proposals[winningID].receiver, proposals[winningID].id);

            return winningID;  
    }
 
    function getLosers(uint256 _winningProposal) internal {

          for (uint i = 0; i <= s_proposals.length; i++) {
                if(proposals[i].yesVotes <= proposals[_winningProposal].yesVotes){
                    proposals[i].isPassed = false;
                    emit ProposalElected(proposals[i].isPassed, proposals[i].proposer, proposals[i].receiver, proposals[i].id);
                    delete proposals[i];
                }
            }
    }
 
    function calculateWinner() public onlyRole(ADMIN) returns (address, address, string memory, uint256) {
        require((block.timestamp - lastTimeStamp) > intervalWeek);

        uint256 winningProposal = getHighestVote();
 
        address winnerAddress = proposals[winningProposal].receiver;

        address proposer = proposals[winningProposal].proposer;
 
        uint256 awardAmount = proposals[winningProposal].amount;

        string memory tokenSelection = proposals[winningProposal].tokenSelection;

        getLosers(winningProposal);
 
        delete proposals[winningProposal];
        s_proposals = new uint[](0);
        delete totalProposals;
        lastTimeStamp = 0;

        s_proposelPeriod = ProposelPeriod.CLOSED; //while calculating it is closed

        return (winnerAddress, proposer, tokenSelection, awardAmount);

    }

    function vote(bool _yes, uint _proposalId, address _voter, uint _weightedVote) public onlyRole(ADMIN) {
        require(s_proposelPeriod == ProposelPeriod.OPEN, "Proposel Period is not open");
        require(voterHistory[_proposalId][_voter] == false, "User already voted");
        if (_yes) {
            proposals[_proposalId].yesVotes += (1 + _weightedVote);
        //we are not using no votes only yesVotes
        } else {
            proposals[_proposalId].noVotes += (1 + _weightedVote);
        }
        voterHistory[_proposalId][_voter] == true;
    }

    function passTime() internal {
        weeklyTimeSchedule = weeklyTimeSchedule - 20;
        payout();
    }

    function reset() internal {
        weeklyTimeSchedule = weeklyTimeSchedule + 120;
        payoutInProgress = false;
        daoVault.deleteBenificiary();
    }

    function sendFundsToUser() internal {
        daoVault.autoPayout();
    }

    function payout() internal {      
        if (weeklyTimeSchedule  == 100) {
            payoutInProgress= true;
        } else if (weeklyTimeSchedule  == 80) {
            sendFundsToUser();
        } else if (weeklyTimeSchedule  == 60) { 
            sendFundsToUser(); 
        } else if (weeklyTimeSchedule == 40) { 
            sendFundsToUser(); 
        } else if (weeklyTimeSchedule  == 20) { 
            sendFundsToUser(); 
        } else if (weeklyTimeSchedule < 20) {
            //in this reset function we will reset the transferablity of the owner
            reset();
        }
    }

    //CHAINLINK WOULD GO HERE - with chainlink because we dont need to call these function we can run harvest yield in this 
    //How Would I Set This Automatically So I Dont Have To Manually Input The Address In Chainlink Each Time
    //Same Thing With The Enitre Contract, I Dont Want To Manually Set Up Each Contract With Moralis 
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
 
        bool isOpen = s_proposelPeriod == ProposelPeriod.OPEN;
        bool timePassed = ((block.timestamp - lastTimeStamp) > intervalWeek);
        bool hasCandidates = s_proposals.length > 0;
        upkeepNeeded = (timePassed && isOpen && hasCandidates);
        return (upkeepNeeded, "0x0");
       
    }
 
    function performUpkeep(
        bytes calldata /* performData */
    ) external {
 
            if((block.timestamp - lastTimeStamp) > intervalWeek){
 
                if(payoutInProgress && s_proposals.length > 0){

                    //grab the address from the core contract and factory pass it through to make that non transferablle
                    (address _winnerAddress, address _proposer, string memory _tokenSelection, uint256 _amount) = calculateWinner();
                    daoVault.setBenificiary(_winnerAddress, _proposer, _amount, _tokenSelection);
                    passTime();

                    //the proposer address is for tracking event 
 
                } else if(!payoutInProgress) {
               
                    passTime();
 
                } else {
                    revert Election__NoCandidates();
                }
 
                lastTimeStamp = block.timestamp;
            }        
    }
}