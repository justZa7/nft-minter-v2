import { ethers } from "ethers";
import NFTMINTER from "@/contractAbi/MyNFT.json"

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS.toString();

export function getContact(signerOrPrivider) {
    return new ethers.Contract(CONTRACT_ADDRESS, NFTMINTER.abi, signerOrPrivider);
}