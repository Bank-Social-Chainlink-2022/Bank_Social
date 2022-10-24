// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
 
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./IDAOVault.sol";

//we can use the ERC token to itnerface with this contract
contract MemberCard is ERC721, ERC2981, AccessControlEnumerable {
    using Counters for Counters.Counter;
    using Strings for uint256;

    IDAOVault daoVault;

    string baseURI;
    string public baseExtension = ".json";

    address s_mintRoylatyTo;

    uint96 public s_royaltyFee = 2;
    uint public s_birthRate = 2;
    uint public maxSupply;
    
    struct CardAttributes {
        uint256 birthtime;
    }

    mapping (uint256 => CardAttributes) public cardAtrributes;
 
    Counters.Counter private _tokenIdCounter;
    Counters.Counter private _tokenSentToBurn;

    bytes32 public constant MINTER =
        keccak256("MINTER");

    bytes32 public constant OWNER =
        keccak256("OWNER");

    address nonTransferAddress;

    //EVENTS
    event Mint(address indexed _from, uint indexed _tokenId, address contractAddress); 
    event Burn(address indexed _from, uint indexed _tokenId, address contractAddress);

    constructor(  
    string memory  _name,
    string memory _symbol,
    string memory _initBaseURI,
    address _ownerAddress, //this is where permission token is made 
    address _marketPlace,
    address _daoProxy,
    uint96 _royaltyFee,
    uint _maxSupply

    ) ERC721(_name,  _symbol) {
        _grantRole(MINTER, msg.sender);
        _grantRole(OWNER, _ownerAddress);
        maxSupply = _maxSupply; 
        s_royaltyFee = _royaltyFee;

        setBaseURI(_initBaseURI);
        setApprovalForAll(_marketPlace, true);

        daoVault = IDAOVault(_daoProxy);

        s_mintRoylatyTo = _ownerAddress;
    }
    
    function setRoyaltyReciepient (address _receiver) public onlyRole(OWNER) {
         s_mintRoylatyTo = _receiver;
    }

    function setBirthRewardRate(uint _birthRate) public onlyRole(OWNER) {
          s_birthRate = _birthRate;
    }

    function burnCard(uint256 _tokenId, address _tokenHolder) public onlyRole(MINTER)
    {
        require(ownerOf(_tokenId) == _tokenHolder, "not owner");
        require(_tokenHolder != nonTransferAddress, "cannot transfer");

            _burn(_tokenId);
            _tokenSentToBurn.increment();
            delete cardAtrributes[_tokenId];

        emit Burn(_tokenHolder, _tokenId, address(this)); 
    }
  
    function getTotalSupply() public view returns (uint256) {
        uint256 supply = _tokenIdCounter.current() - _tokenSentToBurn.current();
        return supply;
    }

    function mint(address _to) public onlyRole(MINTER) payable returns(uint256) {
        //might need another min stake level require level 
        uint256 currentSupply = getTotalSupply();

        require(balanceOf(_to) < 1, "One per user"); //TESTING
        require(currentSupply <= maxSupply, "max NFT limit exceeded");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _safeMint(_to, tokenId);
       
        cardAtrributes[tokenId] = CardAttributes ({
                birthtime: block.timestamp
        });
 
        _setTokenRoyalty(tokenId, s_mintRoylatyTo, s_royaltyFee); 

        emit Mint(_to, tokenId, address(this)); 

        return tokenId;
    }

    function calculateWeight(uint256 _tokenId) public view returns (uint256) {
        uint256 weightedPoints;
        uint256 timePassed = 120; //2months //2628000; //1 month //make this custom  - this is like duration with staking rewards 
        uint256 stakeTime = block.timestamp - cardAtrributes[_tokenId].birthtime;
        if(stakeTime > timePassed){
            //normally we might set this as a rate
           uint256 points = (s_birthRate * stakeTime) / timePassed; //rate multiplied by these so we need a rate of earn 
            weightedPoints =  (points * 1e18)  / getTotalSupply();
        }
 
        return weightedPoints;
    }

    function setBaseURI(string memory _newBaseURI) public  {
        baseURI = _newBaseURI;
    }

    function _baseURI() internal view virtual override returns (string memory) {
       return baseURI;
    }
 
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControlEnumerable, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override
    {
        nonTransferAddress = daoVault.getProposeAddress();
        require(from != nonTransferAddress, "cannot transfer");
        super._beforeTokenTransfer(from, to, tokenId);
    }
 
}

