// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./DAO.sol";

contract DAOFactory {
    
    uint256 DAOCounter = 0;
    mapping(uint256 => DAO) public daos; 

    function createDAO(

        address _adminContract,
        address _daoVault

    ) external returns (DAO) {
        DAO daoAddress = new DAO(  _adminContract,  _daoVault);

        daos[DAOCounter] = daoAddress;
        DAOCounter++;

        return daoAddress;
        
    }

    function getDAOs(uint256 id) external view returns (DAO) {
        return daos[id];
    }

}