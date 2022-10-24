// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./DAOVault.sol";

contract DAOVaultFactory {
    
    uint256 vaultCounter = 0;
    mapping(uint256 => DAOVault) public daoVault; 

    function createVault(

        address _tokenAddress,
        address _aTokenAddress,
        address _aaveLendingPoolAddressesProvider,
        address _swapperInterface,
        uint256 _minStake

    ) external returns (DAOVault) {
        DAOVault vaultAddress = new DAOVault( _tokenAddress, _aTokenAddress, _aaveLendingPoolAddressesProvider, _swapperInterface, _minStake);

        daoVault[ vaultCounter] = vaultAddress;
        vaultCounter++;

        return vaultAddress;
        
    }

    function getDAOVaults(uint256 id) external view returns (DAOVault) {
        return daoVault[id];
    }

}