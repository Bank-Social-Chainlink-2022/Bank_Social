// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./MemberCard.sol";

contract MemberCardFactory {
    
    uint256 memberCardsCounter = 0;
    mapping(uint256 => MemberCard) public memberCards; 

    function createCard(

        string memory _name,
        string memory _symbol,
        string memory _initBaseURI,
        address _ownerAddress,
        address _marketPlace,
        uint96 _royaltyFee,
        uint _maxSupply

    ) external returns (MemberCard) {
        MemberCard cardsAddress = new MemberCard( _name,  _symbol, _initBaseURI, _ownerAddress, _marketPlace, _royaltyFee, _maxSupply);

        memberCards[memberCardsCounter] = cardsAddress;
        memberCardsCounter++;

        return cardsAddress;
        
    }

    function getCardCollections(uint256 id) external view returns (MemberCard) {
        return memberCards[id];
    }

}