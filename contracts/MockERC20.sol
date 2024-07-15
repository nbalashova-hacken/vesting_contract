// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 { 
    constructor() ERC20("mock", "mk") {
        _mint(msg.sender, 10000000000000000000);
    }

    function balanceOf(address adr) public override view returns (uint) {
        return super.balanceOf(adr);
}}
