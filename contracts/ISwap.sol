//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
 
interface ISwap {

    function swapExactInputSingle(uint256 amountIn, address _receiver) external returns (uint256 amountOut);

    function swapExactOutputSingle(uint256 amountOut, uint256 amountInMaximum, address _receiver) external returns (uint256 amountIn);

}
 
