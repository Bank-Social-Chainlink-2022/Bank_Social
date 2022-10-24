// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "./MemberCardFactory.sol"; 
import "./DAOVaultFactory.sol";
import "./DAOFactory.sol";

import "./ISocialBankCore.sol";

contract SocialBankCore is ISocialBankCore {

    event SocialBankCreated(
        address indexed DAOAddress,
        address indexed NFTAddress,
        address indexed poolAddress,
        string  bankName,
        uint256 maxSupply,
        uint256 minStake,
        uint256 daoId
    );

    event TokenWeight(
        uint indexed DAOId, 
        uint256 indexed _TOKENID, 
        address indexed contractAddress, 
        uint256 _WEIGHT
    );
    
    MemberCardFactory public memberCardFactory;
    DAOVaultFactory public dAOVaultFactory;
    DAOFactory public daoFactory;
    
    uint256 public daoCounter;
    bytes32 public constant OWNER = keccak256("OWNER");

    struct SocialBank {
        MemberCard nftAddress;
        DAOVault poolAddress; 
        DAO daoAddress;
    }

    mapping(address => uint256) public minStakeForAllDAOS;
    mapping(address => SocialBank) public bankOwnerAddress;
    mapping(uint => SocialBank) public socialBankId;

    //do this exaclty like election state opened 
    mapping(address => address) public recordedAddress;

    constructor(){}
        
    function createDAO(
        string memory  _name,
        string memory _initBaseURI,
        address _tokenAddress,
        address _aTokenAddress,
        address _aaveLendingPoolAddressesProvider,
        address _marketPlace,
        address _swap,
        uint96 _royaltyFee,
        uint _maxSupply,
        uint _minStake
   
    ) public {
        //CREATE NFT COLLECTION 
        require(msg.sender != recordedAddress[msg.sender]);

        DAOVault dvault = dAOVaultFactory.createVault(
            _tokenAddress,
            _aTokenAddress,
            _aaveLendingPoolAddressesProvider,
            _swap,
            _minStake
        );

        address _poolAddr = address(dvault);  

        //we might have this function interface with the proxy contract or dao contract
        MemberCard memberCard = memberCardFactory.createCard(
            _name,
            "CARD",
            _initBaseURI,
             msg.sender, //msg.sender would be all that we have to include
            _marketPlace,
            _poolAddr,
            _royaltyFee,
            _maxSupply
        );

        string memory daoName = _name;

        address _memberCards = address(memberCard);  

        minStakeForAllDAOS[_memberCards] = _minStake;

        DAO dao = daoFactory.createDAO(
            address(this),
            _poolAddr
        );

        address _daoAddress = address(dao);

        socialBankId[daoCounter] = SocialBank(
            memberCard,
            dvault, 
            dao
        );

        daoCounter++;

        bankOwnerAddress[msg.sender] = SocialBank(
            memberCard,
            dvault, 
            dao
        );

        recordedAddress[msg.sender] = msg.sender;

        emit SocialBankCreated(
            _daoAddress,
            _memberCards,
            _poolAddr,
             daoName,
            _maxSupply,
            _minStake,
            daoCounter
        );
    }

    //FIND & JOIN DAO
    function _joinDAO(uint256 _daoId, uint256 _amount) public payable {
        require(memberCardFactory.getCardCollections(_daoId).balanceOf(msg.sender) == 0);
         
        memberCardFactory.getCardCollections(_daoId).mint(msg.sender); //do we need to grab the ID of this NFT 
        dAOVaultFactory.getDAOVaults(_daoId).stake(msg.sender, _amount); //we need to make the msg.sender address gets in there 

    }

    //STAKING AND BANKING -- ALL FUNCTIONS TOKEN GATED
    function _depositInDAO(uint256 _daoId, uint256 _tokenId, uint256 _amount) public payable {
        address tokenOwner = memberCardFactory.getCardCollections(_daoId).ownerOf(_tokenId);
        require(memberCardFactory.getCardCollections(_daoId).balanceOf(msg.sender) >= 1, "Use doesn't have enough NFTs to create proposal"); 
        require(tokenOwner == msg.sender);

        dAOVaultFactory.getDAOVaults(_daoId).deposit(msg.sender, _amount);

    }

    //Does This Have To Payable??
    function _unstakeInDAO(uint256 _daoId, uint256 _amount, uint256 _tokenId) public {
        address tokenOwner = memberCardFactory.getCardCollections(_daoId).ownerOf(_tokenId);
        require(memberCardFactory.getCardCollections(_daoId).balanceOf(msg.sender) >= 1, "Use doesn't have enough NFTs to create proposal"); 
        require(tokenOwner == msg.sender);
     
        dAOVaultFactory.getDAOVaults(_daoId).unstake(msg.sender,_amount);
        //emit Unstaked(_daoId, daoIds[_daoId].poolAddress, msg.sender, amount);
    }

    //We have to token gate some of these functions since staking is based off a specific ID
    function _unstakeFullInDAO(uint256 _daoId, uint256 _tokenId) public {
        address tokenOwner = memberCardFactory.getCardCollections(_daoId).ownerOf(_tokenId);
        require(memberCardFactory.getCardCollections(_daoId).balanceOf(msg.sender) >= 1, "Use doesn't have enough NFTs to create proposal"); 
        require(tokenOwner == msg.sender);

        dAOVaultFactory.getDAOVaults(_daoId).unstakeFull(msg.sender);
        memberCardFactory.getCardCollections(_daoId).burnCard(_tokenId, msg.sender);
    }

    //DAO FUNCTIONS
    function _propose(
        uint256 _amount, 
        string memory _tokenSelection,
        string memory _ipfsHash,
        address _receiver,
        uint256 _tokenId,
        uint256 _daoId    
    ) public {
        address tokenOwner = memberCardFactory.getCardCollections(_daoId).ownerOf(_tokenId);
        require(memberCardFactory.getCardCollections(_daoId).balanceOf(msg.sender) >= 1, "Use doesn't have enough NFTs to create proposal"); 
        require(tokenOwner == msg.sender);

        daoFactory.getDAOs(_daoId).propose(
            _amount, 
            _tokenSelection, 
            _ipfsHash, 
            msg.sender, 
            _receiver
        );
    }

    function _vote(
        bool _yes, 
        uint _daoId, 
        uint256 _tokenId, 
        uint _proposalId
        
    ) public {

        address tokenOwner = memberCardFactory.getCardCollections(_daoId).ownerOf(_tokenId);
        require(memberCardFactory.getCardCollections(_daoId).balanceOf(msg.sender) >= 1, "Use doesn't have enough NFTs to create proposal"); 
        require(tokenOwner == msg.sender);

        uint256 _weight = memberCardFactory.getCardCollections(_daoId).calculateWeight(_tokenId);
        MemberCard nftAddress = memberCardFactory.getCardCollections(_daoId);

        address _nftAddress = address(nftAddress);

        daoFactory.getDAOs(_daoId).vote(_yes, _proposalId, msg.sender, _weight);

        emit TokenWeight(
            _daoId, 
            _tokenId, 
            _nftAddress, 
            _weight
        );
      
    }

    //GETTER FUNCTIONS 
    function getMinStake(address _memberAddress) external view override(ISocialBankCore) returns (uint256){
         return minStakeForAllDAOS[_memberAddress];
    }

    //GET BANKS BY OWNERS ADDRESS
    function getDAOByAddress(address _address) external view returns (DAO) {
        return bankOwnerAddress[_address].daoAddress;
    }

    function getVaultByAddress(address _address) external view returns (DAOVault) {
        return bankOwnerAddress[_address].poolAddress;
    }

    function getNFTByAddress(address _address) external view returns (MemberCard) {
        return bankOwnerAddress[_address].nftAddress;
    }

    //GET BANKS BY ID
    function getDAOById(uint256 id) external view returns (DAO) {
        return socialBankId[id].daoAddress;
    }

    function getVaultById(uint256 id) external view returns (DAOVault) {
        return socialBankId[id].poolAddress;
    }

    function getNFTById(uint256 id) external view returns (MemberCard) {
        return socialBankId[id].nftAddress;
    }

}