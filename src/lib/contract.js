import { ethers } from "ethers";
import NFTMINTER from "@/contractAbi/MyNFT.json"

const CONTRACT_ADDRESS = "0x449CA877B30E582FDCe8893CA8e3526619b154DE";

export function getContact(signerOrPrivider) {
    return new ethers.Contract(CONTRACT_ADDRESS, NFTMINTER.abi, signerOrPrivider);
}