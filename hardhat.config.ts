import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

require("hardhat-gas-reporter");


const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true, // Enable the optimizer
        runs: 200,     // Number of optimization runs
      },
    },
  },
  networks: {
    hardhat: {
      allowBlocksWithSameTimestamp: true,
    },
  },
  // gasReporter: {
  //   enabled: true,
  //   currency: "ETH", // Report gas costs in ETH instead of a fiat currency
  //   gasPrice: 21, // Set a gas price in gwei
  //   outputFile: "gas-report.txt", // Optionally specify an output file
  //   noColors: false,
  //   onlyCalledMethods: true,
  //   showTimeSpent: true,
  //   excludeContracts: ["Migrations"],
  // },
};

export default config;
