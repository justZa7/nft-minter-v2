"use client"

import { useState } from "react";
import { ethers } from "ethers";
import { uploadToPinata } from "@/lib/pinataUpload";
import MyNFT from "@/contractAbi/MyNFT.json";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export default function Minter () {
    const [ file, setFile ] = useState(null);
    const [ loading, setLoading ] = useState(false);
    const [ minted, setMinted ] = useState(false);

    const handleMint = async () => {
        if (!file) return alert("Upload a file first.");

        try {
            setLoading(true);

            const provider = new ethers.BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = await provider.getSigner();

            const uri = await uploadToPinata(file);
            
            const contract = new ethers.Contract(CONTRACT_ADDRESS, MyNFT.abi, signer);
            const tx = await contract.mint(await signer.getAddress(), uri);
            const receipt = await tx.wait();

            const tokenId = receipt.logs[0].topics[3];
            setMinted(parseInt(tokenId, 16));
        } catch (err) {
            alert(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0])} />
            <button onClick={handleMint}>
                {loading ? "Minting..." : "Mint"}
            </button>
            {minted && <p className="text-green-600">NFT Minted! Token ID: {minted}</p>}
        </div>
    )
}