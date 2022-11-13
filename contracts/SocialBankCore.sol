// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "./MemberCardFactory.sol"; 
import "./DAOVaultFactory.sol";
import "./DAOFactory.sol";

import "./IMemberCard.sol";
import "./IDAOVault.sol";

contract SocialBankCore {

    event SocialBankCreated(
        address indexed DAOAddress,
        address indexed NFTAddress,
        address indexed poolAddress,
        string  bankName,
        uint256 maxSupply,
        uint256 minStake,
        uint256 daoId
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

    mapping(address => SocialBank) public bankOwnerAddress;
    mapping(uint => SocialBank) public socialBankId;

    mapping(address => address) public recordedAddress;

    constructor(

        address _memberCardFactory,
        address _dAOVaultFactory,
        address _daoFactory

    ){

        memberCardFactory = MemberCardFactory(_memberCardFactory);
        dAOVaultFactory = DAOVaultFactory(_dAOVaultFactory);
        daoFactory = DAOFactory(_daoFactory);

    }
        
    function createDAO(
        string memory  _name,
        string memory _initBaseURI,
        address _tokenAddress,
        address _aTokenAddress,
        address _aaveLendingPoolAddressesProvider,
        address _swap,
        uint _maxSupply,
        uint _minStake
   
    ) public {
        //require(msg.sender != recordedAddress[msg.sender]);

        MemberCard memberCard = memberCardFactory.createCard(
            _name,
            "CARD",
            _initBaseURI,
             msg.sender, //msg.sender would be all that we have to include
            _maxSupply
        );

        string memory daoName = _name;

        address _memberCards = address(memberCard); //dao pool takes this and dao takes this 

        DAOVault dvault = dAOVaultFactory.createVault(
            _tokenAddress,
            _aTokenAddress,
            _aaveLendingPoolAddressesProvider,
            _swap,
            _memberCards,
            _minStake
        );

        address _poolAddr = address(dvault); 

        //These Functions Are The Only Ones Which Changed
        //IMemberCard(_memberCards).setMinterAddr(_poolAddr); 

        DAO dao = daoFactory.createDAO(
            _poolAddr,
            _memberCards
        );

        address _daoAddress = address(dao);

        //These Functions Are The Only Ones Which Changed
        //IDAOVault(_poolAddr).setDAOAdmin(_daoAddress); 

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

        //These Functions Are The Only Ones Which Changed
        //recordedAddress[msg.sender] = msg.sender;

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

    //GET THE BANK STRUCTS
    function getDAOsByAddress(address _address) external view returns (DAO, DAOVault, MemberCard) {
        return (
            bankOwnerAddress[_address].daoAddress,
            bankOwnerAddress[_address].poolAddress,
            bankOwnerAddress[_address].nftAddress
        );
    }

    function getDAOsById(uint256 id) external view returns (DAO, DAOVault, MemberCard) {
        return (
            socialBankId[id].daoAddress,
            socialBankId[id].poolAddress,
            socialBankId[id].nftAddress
        );
    }
}