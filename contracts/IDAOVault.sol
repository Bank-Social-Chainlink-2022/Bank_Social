// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface IDAOVault {
    
    function autoPayout() external;

    function setBenificiary(address _receiver, address _proposer, uint256 _amount, bool _tokenPayout, uint _tokenId) external;

    function deleteBenificiary() external;

    function setDAOAdmin(address _DAO) external;

    function getProposeAddress() external view returns (address);

    function getBenificiaryId() external view returns (uint256);

}