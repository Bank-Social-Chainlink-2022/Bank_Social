// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;


import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./IAaveLendingPoolAddressesProvider.sol";
import "./IAaveLendingPool.sol";

import "./IDAOVault.sol";
import "./ISwap.sol";

contract DAOVault is IDAOVault, AccessControlEnumerable {
    using Counters for Counters.Counter;

    IAaveLendingPoolAddressesProvider public aaveLendingPoolAddressesProvider;

    uint256 internal totalStake;
    uint256 internal minStake;
   
    IERC20 public token; //token to deposit
    IERC20 public aaveAToken;
    IERC20 public underlyingToken;

    ISwap public swap;

    bytes32 public constant CORE = keccak256("CORE");
    bytes32 public constant DAO_CORE = keccak256("BANKCORE");

    struct Benificiary {
        address receiver;
        address proposer;
        string tokenPayOut;
        uint256 amount;
    }

    mapping(uint256 => Benificiary) public benificiaries;
    Counters.Counter private benificiaryCounter;       

    mapping(address => uint256) public customers;

    event Benificiaries(address indexed _receiver, address indexed _proposer, uint256 _amount, string _tokenPayout);

    event UnStaked(address indexed customer, uint256 totalStake, uint256 amount);
    event Staked(address indexed _customer, uint256 _totalStake, uint256 _amount);
    event Claimed(address indexed _customer, uint256 _amount);

    //Will Have To Input Our Swap
    constructor(
       
        address _tokenAddress,
        address _aTokenAddress,
        address _aaveLendingPoolAddressesProvider,
        address _swapperInterface,
        uint256 _minStake

    ) {

        token = IERC20(_tokenAddress);
        underlyingToken = IERC20(_tokenAddress);

        aaveAToken = IERC20(_aTokenAddress);
        aaveLendingPoolAddressesProvider = IAaveLendingPoolAddressesProvider(_aaveLendingPoolAddressesProvider);

        swap = ISwap(_swapperInterface);
        minStake = _minStake;

        _grantRole(CORE, msg.sender); //lets see if this works when testing 
    }

    //AFTER THE DAO IS PUBLISHED SET IT AS ADMIN FOR THIS VAULT AUTOMATICALLY
    function setDAOAdmin(address _DAO) public onlyRole(CORE) {
         _grantRole(DAO_CORE, _DAO);
    }

    //I Dont Know If This Will Work
    function stake(address _account, uint256 _amount) public onlyRole(CORE) returns (uint256) {
        require(token.allowance(_account, address(this)) >= minStake, "Not enough tokens");

        uint256 amount = _amount;

        token.transferFrom(_account, address(this), _amount);
        _deposit(_amount);

        customers[_account] += amount;
        totalStake += amount;

        emit Staked(_account, totalStake, amount);
        return amount;
    }

    //Do I Have To Add The Underlying Toke Like In NO Cost?
    function deposit(address _account, uint256 _amount) public onlyRole(CORE) returns (uint256){
        uint256 currentStake = customers[ _account];
        require(currentStake>= 0, "no customer");

        token.transferFrom(_account, address(this), _amount);
        _deposit(_amount);

        customers[ _account] += _amount;
        totalStake += _amount;

        emit Staked(  _account, totalStake, _amount);
        return _amount;
    }

    function unstake(address _account, uint256 _amount) public onlyRole(CORE) returns (uint256) {
        uint256 currentStake = customers[_account];
        uint256 requiredAmount = currentStake - minStake;

        require(currentStake >= 0, "no customer");
        require(currentStake >= minStake); //permissioned balance cannot withdraw more
        require(_amount <= requiredAmount, "not enough in the account");

        IAaveLendingPool lendingPool = aaveLendingPoolAddressesProvider.getLendingPool();
        lendingPool.withdraw(address(underlyingToken), _amount, _account);
            
        customers[_account] = currentStake - _amount;
        totalStake -= _amount;

        emit UnStaked(_account, totalStake, _amount);
        return _amount;
    }

    function unstakeFull(address _account) public onlyRole(CORE) returns (uint256) {
        uint256 currentStake = customers[_account];
        require(currentStake >= 0, "no customer");


        IAaveLendingPool lendingPool = aaveLendingPoolAddressesProvider.getLendingPool();
        lendingPool.withdraw(address(underlyingToken), currentStake, _account);
        
        delete customers[_account];
            
        customers[_account] = 0;
        totalStake -= currentStake;

        emit UnStaked(_account, totalStake, currentStake);


        return currentStake;
    }

    //Auto Claims
    function autoPayout() external onlyRole(DAO_CORE) override(IDAOVault) {
        uint256 _counter = benificiaryCounter.current();
        address _receiver = benificiaries[_counter].receiver;
        uint256 _amount = benificiaries[_counter].amount;

        IAaveLendingPool lendingPool = aaveLendingPoolAddressesProvider.getLendingPool();
  
        lendingPool.withdraw(address(underlyingToken), _amount, _receiver);

        emit Claimed(_receiver, _amount);

    }

    //HARVEST MANUEL
    function harvestYield(address _account, uint _amount) external onlyRole(CORE) override(IDAOVault) returns (uint256) {
        uint256 amount = _amount;
        uint256 currentBalance = aaveAToken.balanceOf(address(this));
        require(currentBalance > amount, "Current pool balance is less than principal"); //-may return this

        IAaveLendingPool lendingPool = aaveLendingPoolAddressesProvider.getLendingPool();
  
        lendingPool.withdraw(address(underlyingToken), amount, _account);

        emit Claimed(_account, amount);
        return amount;
    }

    function _deposit(uint256 _amount) internal returns (uint256) {
        //principalBalance = principalBalance.add(amount);

        IAaveLendingPool lendingPool = aaveLendingPoolAddressesProvider.getLendingPool();
        require(underlyingToken.approve(address(lendingPool), _amount), "underlyingToken approve failed" );
        lendingPool.deposit(address(underlyingToken), _amount, address(this), 0);
        return _amount;
    }

    //PROXY CONTRACTS 
    function setBenificiary(address _receiver, address _proposer, uint256 _amount, string memory _tokenPayout) external onlyRole(DAO_CORE) override(IDAOVault) {
 
        Benificiary memory _benificiary;
 
        _benificiary.receiver = _receiver;
        _benificiary.proposer = _proposer; //could we make this tokenID
        _benificiary.tokenPayOut = _tokenPayout;
        _benificiary.amount = _amount;
 
        benificiaryCounter.increment();
        uint256 currentBenificiary = benificiaryCounter.current();
        benificiaries[currentBenificiary] = _benificiary;

        emit Benificiaries(_receiver, _proposer, _amount, _tokenPayout);
 
    }
  
    //add the amount paid to this struct
    function deleteBenificiary() external onlyRole(DAO_CORE) override(IDAOVault) {
 
        uint256 _counter = benificiaryCounter.current();
         delete  benificiaries[_counter];
    }

    //GETTERS
    function claimable() public view returns (uint256) {
        uint256 currentBalance = aaveAToken.balanceOf(address(this));
        uint256 yield = currentBalance - totalStake;
        return yield;
    }

    function staked() public view returns (uint256) {
        return totalStake;
    }

    function getProposeAddress() external view override(IDAOVault) returns (address) {
        uint256 currentBenificiary = benificiaryCounter.current();
        return benificiaries[currentBenificiary].proposer;
    }

   //UniSwap Mix In Goes Here
}
