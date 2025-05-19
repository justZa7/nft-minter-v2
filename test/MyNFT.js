const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("NFTMinter", () => {
  async function nftMinterFixture() {
    const [owner, addr1] = await ethers.getSigners();
    const NFTMinter = await ethers.getContractFactory("MyNFT");
    const minter = await NFTMinter.deploy(owner.address);
    await minter.waitForDeployment();

    return { owner, addr1, minter };
  }

  it("Should assign mint an NFT and assign it to address", async () => {
    const { addr1, minter } = await loadFixture(nftMinterFixture);

    const tx = await minter.connect(addr1).mint(addr1.address, "ipfs://exampleuri");
    const receipt = await tx.wait();

    // Get tokenId from Transfer event
    const transferEvent = receipt.logs.find((log) => log.fragment.name === "Transfer");
    const tokenId = transferEvent.args.tokenId;

    expect(await minter.balanceOf(addr1.address)).to.equal(1n);
    expect(await minter.tokenURI(tokenId)).to.equal("ipfs://exampleuri");
  });
})
