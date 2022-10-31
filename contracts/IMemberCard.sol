// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface IMemberCard {
    
    function setNonTransferableAddr(address _address) external;

    function setMinterAddr(address _address) external;

    function burnCard(uint256 _tokenId, address _tokenHolder) external;

    function mint(address _to) external returns(uint256);

    function calculateWeight(uint256 _tokenId) external view returns (uint256);

}