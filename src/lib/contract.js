import { ethers } from "ethers";
import NFTMINTER from "@/contractAbi/MyNFT.json"

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export function getContact(signerOrPrivider) {
    return new ethers.Contract(CONTRACT_ADDRESS, NFTMINTER.abi, signerOrPrivider);
}