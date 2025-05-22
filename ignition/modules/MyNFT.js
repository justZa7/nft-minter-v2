// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("MyNFTV1", (m) => {
  const owner = m.getAccount(0);

  const myNFT = m.contract("MyNFT", [owner]);

  return { myNFT };
});
