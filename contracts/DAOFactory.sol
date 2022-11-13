// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./DAO.sol";

contract DAOFactory {
    
    uint256 DAOCounter = 0;
    mapping(uint256 => DAO) public daos; 

    function createDAO(

        address _daoVault,
        address  _memberCardInterface

    ) external returns (DAO) {
        DAO daoAddress = new DAO( _daoVault, _memberCardInterface);

        daos[DAOCounter] = daoAddress;
        DAOCounter++;

        return daoAddress;
        
    }

    function getDAOs(uint256 id) external view returns (DAO) {
        return daos[id];
    }

}