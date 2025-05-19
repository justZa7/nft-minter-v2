import { ethers } from "ethers";
import MyNFT from "@/contractAbi/MyNFT.json";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export async function fetchUserNFTs(userAddress) {
  if (!window.ethereum) throw new Error("No Ethereum wallet found");

  const provider = new ethers.BrowserProvider(window.ethereum);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, MyNFT.abi, provider);

  const totalSupply = await contract._tokenIds?.() || 100; 
  let nfts = [];

  for (let tokenId = 1; tokenId <= totalSupply; tokenId++) {
    try {
      const owner = await contract.ownerOf(tokenId);
      if (owner.toLowerCase() === userAddress.toLowerCase()) {
        const tokenURI = await contract.tokenURI(tokenId);
        nfts.push({ tokenId, tokenURI });
      }
    } catch (e) {
      
    }
  }

  return nfts;
}
