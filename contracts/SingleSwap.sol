// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity >=0.7.6;
pragma abicoder v2;

import "https://github.com/Uniswap/v3-periphery/blob/main/contracts/interfaces/ISwapRouter.sol";

import "./ISwap.sol";

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);

    function transfer(address recipient, uint256 amount)
        external 
        returns (bool);
    
    function approve(address spender, uint256 amount) external returns (bool);
}

contract SingleSwap is ISwap {
    bool _pauseContract = false;

    address public constant routerAddr = 0xE592427A0AEce92De3Edee1F18E0157C05861564;
    ISwapRouter public immutable swapRouter = ISwapRouter(routerAddr);

    //MAINNET ADDRESS
    address USDC_POLYGON_CROSSCHAIN = 0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174;
    address WETH_POLYGON = 0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619;

    IERC20 public USDCToken = IERC20(0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174);

    uint24 public constant poolFee = 3000;

    constructor() {}

    modifier notPaused() {
        require(!_pauseContract, "Contract is paused");
        _;
    }

    function swapExactInputSingle(
        uint256 amountIn, 
        address _receiver
    ) external override(ISwap) notPaused returns (uint256 amountOut) {

        USDCToken.approve(
            address(swapRouter), 
            amountIn
        );

        ISwapRouter.ExactInputSingleParams memory params =
            ISwapRouter.ExactInputSingleParams({
                tokenIn: USDC_POLYGON_CROSSCHAIN,
                tokenOut: WETH_POLYGON,
                fee: poolFee,
                recipient: _receiver, 
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        amountOut = swapRouter.exactInputSingle(params);
    }

    function swapExactOutputSingle(uint256 amountOut, uint256 amountInMaximum, address _receiver) external override(ISwap) notPaused returns (uint256 amountIn) {

        USDCToken.approve(
            address(swapRouter),
             amountInMaximum
            );

        ISwapRouter.ExactOutputSingleParams memory params =
            ISwapRouter.ExactOutputSingleParams({
                tokenIn: USDC_POLYGON_CROSSCHAIN,
                tokenOut: WETH_POLYGON,
                fee: poolFee,
                recipient: _receiver,
                deadline: block.timestamp,
                amountOut: amountOut,
                amountInMaximum: amountInMaximum,
                sqrtPriceLimitX96: 0
            });

        amountIn = swapRouter.exactOutputSingle(params);

        if (amountIn < amountInMaximum) {
            USDCToken.approve(
                address(swapRouter),
                0
            );

            USDCToken.transfer(
                msg.sender, 
                amountInMaximum - amountIn
            );
        }
    }

    function pauseContract(bool status) external  {
        _pauseContract = status;
    }

    function getBalance(address _tokenAddress) external view returns (uint256) {
        return IERC20(_tokenAddress).balanceOf(address(this));
    }
}