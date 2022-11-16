// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface IMemberCard {
    
    function setNonTransferableToken(uint _tokenId) external;

    function setMinterAddr(address _address) external;

    function burnCard(uint256 _tokenId, address _tokenHolder) external;

    function mint(address _to) external;

    function calculateWeight(uint256 _tokenId) external view returns (uint256);

    function resetNonTransferableToken(uint _tokenId) external;

}