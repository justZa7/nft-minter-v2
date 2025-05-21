// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const { setBlockGasLimit } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { ethers } = require("hardhat");


module.exports = buildModule("MyNFT", (m) => {
  const owner = m.getAccount(0);

  const myNFT = m.contract("MyNFT", [owner], {
    ovverides: {
      gasLimit: 5000000,
      gasPrice: ethers.parseUnits("10", "gwei")
    }
  });

  return { myNFT };
});
