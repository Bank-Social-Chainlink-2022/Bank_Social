// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./IMemberCard.sol";

contract MemberCard is IMemberCard, ERC721, AccessControlEnumerable {
    using Counters for Counters.Counter;

    string baseURI;
    string public baseExtension = ".json";

    uint public s_birthRate = 2;
    uint public maxSupply;
    
    struct CardAttributes {
        uint256 birthtime;
        bool isTransferable;
    }

    mapping (uint256 => CardAttributes) public cardAtrributes;
 
    Counters.Counter private _tokenIdCounter;
    Counters.Counter private _tokenSentToBurn;

    bytes32 public constant CORE =
        keccak256("CORE");

    bytes32 public constant OWNER =
        keccak256("OWNER");

    bytes32 public constant MINTER =
        keccak256("MINTER");

    //EVENTS
    event Mint(address indexed _from, uint indexed _tokenId, address contractAddress); 
    event Burn(address indexed _from, uint indexed _tokenId, address contractAddress);

    constructor(  
    string memory  _name,
    string memory _symbol,
    string memory _initBaseURI,
    address _ownerAddress, 
    uint _maxSupply

    ) ERC721(_name,  _symbol) {
        _grantRole(CORE, msg.sender);
        _grantRole(OWNER, _ownerAddress); 
        maxSupply = _maxSupply; 

        setBaseURI(_initBaseURI);
    }

    function setBirthRewardRate(uint _birthRate) public onlyRole(OWNER) {
          s_birthRate = _birthRate;
    }

    //onlyRole(MINTER)
    function setNonTransferableToken(uint _tokenId) external override(IMemberCard) {
        if(cardAtrributes[_tokenId].isTransferable == true){
            cardAtrributes[_tokenId].isTransferable = false;
        }
    }

    function resetNonTransferableToken(uint _tokenId) external override(IMemberCard) {
        if (cardAtrributes[_tokenId].isTransferable == false) {
            cardAtrributes[_tokenId].isTransferable = true;
        }   
    }

    //onlyRole(CORE) 
    function setMinterAddr(address _address) external override(IMemberCard){
           _grantRole(MINTER, _address);
    }

    //onlyRole(MINTER) 
    function burnCard(uint256 _tokenId, address _tokenHolder) external override(IMemberCard)
    {
        require(ownerOf(_tokenId) == _tokenHolder, "not owner");
        require(cardAtrributes[_tokenId].isTransferable == true, "cannot transfer");


            _burn(_tokenId);
            _tokenSentToBurn.increment();
            delete cardAtrributes[_tokenId];

        emit Burn(_tokenHolder, _tokenId, address(this)); 
    }
  
    function getTotalSupply() public view returns (uint256) {
        uint256 supply = _tokenIdCounter.current() - _tokenSentToBurn.current();
        return supply;
    }

    //onlyRole(MINTER) 
    function mint(address _to) external override(IMemberCard){
        uint256 currentSupply = getTotalSupply();

        require(balanceOf(_to) < 1, "One per user"); //TESTING
        require(currentSupply <= maxSupply, "max NFT limit exceeded");

        uint256 _tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

    
        cardAtrributes[_tokenId] = CardAttributes ({
                birthtime: block.timestamp,
                isTransferable: true
        });

        _safeMint(_to, _tokenId);
        //_mint(_to, _tokenId);
       
 
        emit Mint(_to, _tokenId, address(this)); 
    }

    function calculateWeight(uint256 _tokenId) external view override(IMemberCard) returns (uint256) {
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
        override(ERC721, AccessControlEnumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override
    {
        //require(from == nonTransferAddress, "cannot transfer");
       require(cardAtrributes[tokenId].isTransferable == true, "cannot transfer");
       super._beforeTokenTransfer(from, to, tokenId);
    }
 
}

