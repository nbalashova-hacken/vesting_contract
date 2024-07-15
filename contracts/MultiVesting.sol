// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";


contract MultiVesting {
    using SafeERC20 for IERC20;

    error CliffDurationLongerThanVestingDuration();

    struct Vesting {
        uint amount;
        address token;
        uint256 vestingStartTime;
        uint256 vestingDuration;
        uint    claimedAmount;
        uint256 cliffDuration;
    }

    mapping (address => Vesting[]) public vestings;
    function createVestingSchedule (
        address beneficiary, 
        uint32 vestingStartTime, 
        uint32 cliffDuration, 
        uint32 vestingDuration,
        address token,
        uint amount
    ) external {
        if (vestingDuration < cliffDuration) {
            revert CliffDurationLongerThanVestingDuration();
        }
        IERC20(token).safeTransferFrom(msg.sender,address (this), amount);
        vestings[beneficiary].push(Vesting(
            amount, 
            token,
            vestingStartTime, 
            vestingDuration, 
            0, 
            cliffDuration
        ));

    }
    function currrentTimestamp() external view returns (uint) {
        return block.timestamp;
    }
    function getAddressBalance(address adr) external view returns (uint) {
        return adr.balance;
    }
   
    function _calculateTotalVestedAmount(
        uint256 vestingStartTime, 
        uint256 cliffDuration, 
        uint256 vestingDuration, 
        uint amount
    ) view internal returns (uint) {

         if(block.timestamp >= vestingStartTime + vestingDuration) {
            return amount;
            
        } else if (block.timestamp < vestingStartTime + cliffDuration) {
            return 0;

        }else{
            return amount* (block.timestamp - vestingStartTime)/vestingDuration;
            
        }
    }

    function withdraw(uint id) public { 
        Vesting storage vesting = vestings[msg.sender][id];
      
        uint vestedAmount =_calculateTotalVestedAmount(
            vesting.vestingStartTime, 
            vesting.cliffDuration, 
            vesting.vestingDuration, 
            vesting.amount
        );

        uint withdrawableAmount = vestedAmount - vesting.claimedAmount;
        vesting.claimedAmount = vestedAmount;

        IERC20(vesting.token).safeTransfer(msg.sender, withdrawableAmount);
        
    }

}
