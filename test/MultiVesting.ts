// import {
//   time,
//   loadFixture,
// } from "@nomicfoundation/hardhat-toolbox/network-helpers";
// import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
// import { expect } from "chai";
// import hre from "hardhat";

// describe("MultiVesting", function () {

//   async function deployFixture() {


//     const [owner, otherAccount] = await hre.ethers.getSigners();

//     const MultiVesting = await hre.ethers.getContractFactory("MultiVesting");
//     const multiVesting = await MultiVesting.deploy();

//     const MockERC20 = await hre.ethers.getContractFactory("MockERC20");
//     const mockERC20 = await MockERC20.deploy();

//     await hre.ethers.provider.send("evm_mine")

//     mockERC20.approve(multiVesting.target, 1000000)


//     return { multiVesting, mockERC20, owner, otherAccount };
//   }

//   describe("createVestingSchedule", function () {
//     it("Should revert if vestingDuration is less than cliffDuration", async function () {
//       const { multiVesting, mockERC20, owner, otherAccount } = await loadFixture(deployFixture);
//       await expect(
//         multiVesting.createVestingSchedule(
//           otherAccount.address,
//           await time.latest(),
//           100,
//           60,
//           mockERC20.target,
//           70000
//         )
//       ).to.be.revertedWithCustomError(multiVesting, "CliffDurationLongerThanVestingDuration");
//     });
//   });

//   describe("withdraw", function () {
//     it("Should allow full withdrawal after vesting duration", async function () {
//       const { multiVesting, mockERC20, owner, otherAccount } = await loadFixture(deployFixture);
//       await multiVesting.createVestingSchedule(
//         otherAccount.address,
//         await time.latest(),
//         60,
//         100,
//         mockERC20.target,
//         100000
//       );

//       await time.increase(100);
//       await multiVesting.connect(otherAccount).withdraw(0);
//       expect(await mockERC20.balanceOf(otherAccount.address)).to.be.equal(100000);
//     });

//     it("Should not allow withdrawal before cliff duration", async function () {
//       const { multiVesting, mockERC20, owner, otherAccount } = await loadFixture(deployFixture);
//       await multiVesting.createVestingSchedule(
//         otherAccount.address,
//         await time.latest(),
//         60,
//         100,
//         mockERC20.target,
//         100000
//       );
//       console.log(await time.latest())
//       await time.increase(50);

//       await multiVesting.connect(otherAccount).withdraw(0);
//       expect(await mockERC20.balanceOf(otherAccount.address)).to.be.equal(0);
//     });
//   });

//   describe("Deployment", function () {
//     it("Should set the right vesting time", async function () {
//       const { multiVesting, mockERC20 } = await loadFixture(deployFixture);
//       const [owner, otherAccount] = await hre.ethers.getSigners();
//       await multiVesting.createVestingSchedule(
//         otherAccount.address,
//         await time.latest(),
//         60,
//         100,
//         mockERC20.target,
//         100000

//       )
//       console.log(await mockERC20.balanceOf(otherAccount.address))

//       await time.increase(80);


//       await multiVesting.connect(otherAccount).withdraw(0);
//       console.log(await mockERC20.balanceOf(otherAccount.address))
//       const balanceAfterFirstWithdrawal = await mockERC20.balanceOf(otherAccount.address);
//       expect(balanceAfterFirstWithdrawal).to.be.equal(80000);

//     });

//     it("Should set the right vesting duration for gradual vesting", async function () {
//       const { multiVesting, mockERC20 } = await loadFixture(deployFixture);
//       const [owner, otherAccount] = await hre.ethers.getSigners();
//       await multiVesting.createVestingSchedule(
//         otherAccount.address,
//         await time.latest(),
//         60,
//         100,
//         mockERC20.target,
//         100000
//       )
//       await time.increase(65);
//       console.log(await mockERC20.balanceOf(otherAccount.address))

//       await multiVesting.connect(otherAccount).withdraw(0);
//       console.log(await mockERC20.balanceOf(otherAccount.address))
//       const partialBalance = await mockERC20.balanceOf(otherAccount.address);
//       expect(partialBalance).to.be.equal(65000);

//       await time.increase(100);
//       await multiVesting.connect(otherAccount).withdraw(0);
//       console.log(await mockERC20.balanceOf(otherAccount.address))
//       const finalBalance = await mockERC20.balanceOf(otherAccount.address);
//       expect(finalBalance).to.be.equal(100000);
//     });

//     it("Vesting period did not start yet", async function () {
//       const { multiVesting, mockERC20 } = await loadFixture(deployFixture);
//       const [owner, otherAccount] = await hre.ethers.getSigners();
//       await multiVesting.createVestingSchedule(
//         otherAccount.address,
//         await time.latest(),
//         60,
//         100,
//         mockERC20.target,
//         100000
//       )

//       console.log(await mockERC20.balanceOf(otherAccount.address))
//       await time.increase(50);
//       await multiVesting.connect(otherAccount).withdraw(0);
//       expect(await mockERC20.balanceOf(otherAccount.address)).to.be.equal(0)
//       //   await expect(
//       //     multiVesting.connect(otherAccount).withdraw(0)
//       //   ).to.be.revertedWith("cliff did not end yet");
//     });
//   });
  
// });
import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre, { ethers } from "hardhat";

describe("MultiVesting", function () {

  async function deployFixture() {
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const MultiVesting = await hre.ethers.getContractFactory("MultiVesting");
    const multiVesting = await MultiVesting.deploy();

    const MockERC20 = await hre.ethers.getContractFactory("MockERC20");
    const mockERC20 = await MockERC20.deploy();

    await hre.ethers.provider.send("evm_mine");

    await mockERC20.approve(multiVesting.target, 1000000000);

    return { multiVesting, mockERC20, owner, otherAccount };
  }

  describe("createVestingSchedule", function () {
    it("Should revert if vestingDuration is less than cliffDuration", async function () {
      const { multiVesting, mockERC20, owner, otherAccount } = await loadFixture(deployFixture);
      await expect(
        multiVesting.createVestingSchedule(
          otherAccount.address,
          await time.latest(),
          100,
          60,
          mockERC20.target,
          70000
        )
      ).to.be.revertedWithCustomError(multiVesting, "CliffDurationLongerThanVestingDuration");
    });
  });

  describe("withdraw", function () {
    it("Should allow full withdrawal after vesting duration", async function () {
      const { multiVesting, mockERC20, owner, otherAccount } = await loadFixture(deployFixture);
      await multiVesting.createVestingSchedule(
        otherAccount.address,
        await time.latest(),
        60,
        100,
        mockERC20.target,
        100000
      );

      await time.increase(100);
      await multiVesting.connect(otherAccount).withdraw(0);
      expect(await mockERC20.balanceOf(otherAccount.address)).to.be.equal(100000);
    });

    it("Should not allow withdrawal before cliff duration", async function () {
      const { multiVesting, mockERC20, owner, otherAccount } = await loadFixture(deployFixture);
      await multiVesting.createVestingSchedule(
        otherAccount.address,
        await time.latest(),
        60,
        100,
        mockERC20.target,
        100000
      );

      await time.increase(50);
      await multiVesting.connect(otherAccount).withdraw(0);
      expect(await mockERC20.balanceOf(otherAccount.address)).to.be.equal(0)
    });
  });

  describe("Deployment", function () {
    it("Should set the right vesting time", async function () {
      const { multiVesting, mockERC20 } = await loadFixture(deployFixture);
      const [owner, otherAccount] = await hre.ethers.getSigners();
      await multiVesting.createVestingSchedule(
        otherAccount.address,
        await time.latest(),
        60,
        100,
        mockERC20.target,
        100000
      );
      console.log(await mockERC20.balanceOf(otherAccount.address))
      await time.increase(80);
      await multiVesting.connect(otherAccount).withdraw(0);
      console.log(await mockERC20.balanceOf(otherAccount.address))
      const balanceAfterFirstWithdrawal = await mockERC20.balanceOf(otherAccount.address);
      expect(balanceAfterFirstWithdrawal).to.be.equal(80000);
    });

    it("Should set the right vesting duration for gradual vesting", async function () {
      const { multiVesting, mockERC20 } = await loadFixture(deployFixture);
      const [owner, otherAccount] = await hre.ethers.getSigners();
      await multiVesting.createVestingSchedule(
        otherAccount.address,
        await time.latest(),
        60,
        100,
        mockERC20.target,
        100000
      );

      await time.increase(65);
      await multiVesting.connect(otherAccount).withdraw(0);
      const partialBalance = await mockERC20.balanceOf(otherAccount.address);
      expect(partialBalance).to.be.equal(65000);

      await time.increase(100);
      await multiVesting.connect(otherAccount).withdraw(0);
      const finalBalance = await mockERC20.balanceOf(otherAccount.address);
      expect(finalBalance).to.be.equal(100000);
    });

    it("Should not allow withdrawal before vesting period starts", async function () {
      const { multiVesting, mockERC20 } = await loadFixture(deployFixture);
      const [owner, otherAccount] = await hre.ethers.getSigners();
      await multiVesting.createVestingSchedule(
        otherAccount.address,
        await time.latest(),
        60,
        100,
        mockERC20.target,
        100000
      );
      
      await time.increase(50);
      await multiVesting.connect(otherAccount).withdraw(0);
      expect(await mockERC20.balanceOf(otherAccount.address)).to.be.equal(0)
    });
  });

});
