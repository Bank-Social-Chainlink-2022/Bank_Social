// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface IDAOVault {
    
    function autoPayout() external;

    function harvestYield(address _account, uint _amount) external returns (uint256);

    function setBenificiary(address _receiver, address _proposer, uint256 _amount, string memory _tokenPayout) external;

    function deleteBenificiary() external;

    function getProposeAddress() external view returns (address);

}