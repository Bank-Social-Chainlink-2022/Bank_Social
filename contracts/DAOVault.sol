// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import "@aave/core-v3/contracts/interfaces/IPool.sol";

import "./MemberCard.sol";
import "./IDAOVault.sol";
import "./ISwap.sol";

contract DAOVault is IDAOVault, AccessControlEnumerable {
    using Counters for Counters.Counter;

    IMemberCard public memberCardInterface;
    address memberCardAddr;

    IPoolAddressesProvider public immutable ADDRESSES_PROVIDER;
    IPool public immutable POOL;

    uint256 internal totalStake;
    uint256 internal minStake;
   
    IERC20 public aaveAToken;
    IERC20 public token; //token to deposit

    address tokenAddr;

    ISwap public swap;
    address swapAddr;

    bytes32 public constant CORE = keccak256("CORE");
    bytes32 public constant DAO_CORE = keccak256("BANKCORE");

    struct Benificiary {
        address receiver;
        address proposer;
        bool altToken;
        uint256 amount;
        uint256 tokenId;
    }

    mapping(uint256 => Benificiary) public benificiaries;
    Counters.Counter private benificiaryCounter;       

    mapping(address => uint256) public customers;

    bool public wasYieldRetreived = false;

    event Benificiaries(address indexed _receiver, address indexed _proposer, uint256 _amount, bool _tokenPayout, uint _tokenId);

    event UnStaked(address indexed customer, uint256 totalStake, uint256 amount);
    event Staked(address indexed _customer, uint256 _totalStake, uint256 _amount);
    event Claimed(address indexed _customer, uint256 _amount);

    //Will Have To Input Our Swap
    constructor(
       
        address _tokenAddress,
        address _aTokenAddress,
        address _aaveLendingPoolAddressesProvider,
        address _swapperInterface,
        address _memberCardInterface,
        uint256 _minStake

    ) {

        ADDRESSES_PROVIDER = IPoolAddressesProvider(_aaveLendingPoolAddressesProvider);
        POOL = IPool(ADDRESSES_PROVIDER.getPool());

        memberCardInterface = IMemberCard(_memberCardInterface);
        memberCardAddr = _memberCardInterface;

        aaveAToken = IERC20(_aTokenAddress);
        token = IERC20(_tokenAddress);

        tokenAddr = _tokenAddress;

        swap = ISwap(_swapperInterface);
        minStake = _minStake;

        swapAddr = _swapperInterface;
        _grantRole(CORE, msg.sender); 
    }

    //onlyRole(CORE)
    function setDAOAdmin(address _DAO) external override(IDAOVault) {
         _grantRole(DAO_CORE, _DAO);
    }

    function stake(uint256 _amount) public returns (uint256) {
        require(token.allowance(msg.sender, address(this)) >= minStake, "Not enough tokens");
        require(IERC721(memberCardAddr).balanceOf(msg.sender) == 0);

        uint256 amount = _amount;//* 10**6;

        token.transferFrom(msg.sender, address(this), amount); //turned off during testing 

        token.approve(address(POOL), amount);
        
        POOL.supply(tokenAddr, amount, address(this), 0); 

        memberCardInterface.mint(msg.sender);

        customers[msg.sender] += amount;
        totalStake += amount;

        emit Staked(msg.sender, totalStake, amount);
        return amount;
    }

    function unstakeFull(uint256 _tokenId) public returns (uint256) {
        uint256 currentStake = customers[msg.sender];
        require(currentStake >= 0, "no customer");

        address tokenOwner = IERC721(memberCardAddr).ownerOf(_tokenId);
        require(IERC721(memberCardAddr).balanceOf(msg.sender) >= 1, "Use doesn't have enough NFTs to create proposal"); 
        require(tokenOwner == msg.sender);

        memberCardInterface.burnCard(_tokenId, msg.sender);

        //this works with no approval 
        POOL.withdraw(tokenAddr, currentStake, msg.sender); 

        delete customers[msg.sender];
            
        customers[msg.sender] = 0;
        totalStake -= currentStake;

        emit UnStaked(msg.sender, totalStake, currentStake);

        return currentStake;
    }

    //Auto Claims onlyRole(DAO_CORE) - This should work in terms of payments/payments work 
    function autoPayout() external override(IDAOVault) {
        uint256 _counter = benificiaryCounter.current();
        address _receiver = benificiaries[_counter].receiver;
        //uint256 _amount = benificiaries[_counter].amount;

        uint256 currentBalance = aaveAToken.balanceOf(address(this));
        //require(currentBalance > _amount, "Current pool balance is less than principal"); For this we are not going to do amount just Total Yield

        uint256 yield = currentBalance - staked();
        uint256 finalAmount = yield; //pay in 4 possibly but I think I will just pay in one

        bool isTokenPayout = tokenPayout();

        if(isTokenPayout == false){

            if(claimable() >= 1) {

                POOL.withdraw(tokenAddr, finalAmount, _receiver);
                token.approve(_receiver, 1000000);
                token.transfer(_receiver, 1000000);

                wasYieldRetreived = true;

                emit Claimed(_receiver, finalAmount + 1000000);

            } else {

                token.approve(_receiver, 1000000);
                token.transfer(_receiver, 1000000);

                wasYieldRetreived = false;

                emit Claimed(_receiver, 1000000);
            }

            //This Works For The Yield If It did Not We Would Have Gotten An Error
            //POOL.withdraw(tokenAddr, finalAmount, _receiver);
            //token.approve(_receiver, 1000000);
            //token.transfer(_receiver, 1000000);


        } else if(isTokenPayout == true){

            //im not sure if this will work the best way to test it is witha boolean value
            if(claimable() >= 1) {

                POOL.withdraw(tokenAddr, finalAmount, _receiver);
                uint256 contractBalance = finalAmount + 1000000;
                token.approve(address(swap), contractBalance); //in the normal one we just do a regular final balance
                token.transfer(address(swap), contractBalance);

                swap.swapExactInputSingle(contractBalance, _receiver);

                wasYieldRetreived = true;

                emit Claimed(_receiver, contractBalance);

            } else {

                token.approve(address(swap), 1000000);
                token.transfer(address(swap), 1000000);
                swap.swapExactInputSingle(1000000, _receiver);

                wasYieldRetreived = false;

                emit Claimed(_receiver, 1000000);
            }

            //POOL.withdraw(tokenAddr, finalAmount, address(this));

            //uint256 contractBalance = token.balanceOf(address(this)); 
            //uint256 contractBalance = finalAmount + 1000000;

            //token.approve(address(swap), contractBalance);
            //token.transfer(address(swap), contractBalance);

            //swap.swapExactInputSingle(contractBalance, _receiver);

        }
    }

    //PROXY FUNCTIONS
    function setBenificiary(address _receiver, address _proposer, uint256 _amount, bool _altToken, uint _tokenId) external override(IDAOVault) {
 
        Benificiary memory _benificiary;
 
        _benificiary.receiver = _receiver;
        _benificiary.proposer = _proposer; 
        _benificiary.altToken = _altToken;
        _benificiary.amount = _amount;
        _benificiary.tokenId = _tokenId;

        memberCardInterface.setNonTransferableToken(_tokenId);
 
        benificiaryCounter.increment();
        uint256 currentBenificiary = benificiaryCounter.current();
        benificiaries[currentBenificiary] = _benificiary;

        emit Benificiaries(_receiver, _proposer, _amount, _altToken, _tokenId);
 
    }
  
    //onlyRole(DAO_CORE)
    function deleteBenificiary() external override(IDAOVault) {
 
        uint256 _counter = benificiaryCounter.current();
        delete benificiaries[_counter]; //for some reason this is not deleting or the counter is not deleting
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

    function tokenPayout() internal view returns (bool) {
        uint256 currentBenificiary = benificiaryCounter.current();
        return benificiaries[currentBenificiary].altToken;
    }

    function getBalance(address _tokenAddress) external view returns (uint256) {
        return IERC20(_tokenAddress).balanceOf(address(this));
    }

    function getPoolAddress() external view returns (address) {
        return address(POOL);
    }

    function getATokenBalance() external view returns (uint256) {
        return aaveAToken.balanceOf(address(this));

    }

    function getProposeAddress() external view override(IDAOVault) returns (address) {
        uint256 currentBenificiary = benificiaryCounter.current();
        return benificiaries[currentBenificiary].proposer;
    }

    function getBenificiaryId() external view override(IDAOVault) returns (uint256) {
        uint256 _counter = benificiaryCounter.current();
        return benificiaries[ _counter].tokenId;
    }

    receive() external payable {}
    
}
