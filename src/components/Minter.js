"use client"

import { useState } from "react";
import { ethers } from "ethers";
import MyNFT from "@/contractAbi/MyNFT.json";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export default function Minter () {
    const [ file, setFile ] = useState(null);
    const [ name, setName ] = useState("");
    const [ desc, setDesc ] = useState("");
    const [ loading, setLoading ] = useState(false);
    const [ minted, setMinted ] = useState(false);

    const handleMint = async () => {
        if (!file || !name || !desc) return alert("Upload a file first.");

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("file", file);
            formData.append("name", name);
            formData.append("description", desc);

            const res = await fetch("/api/upload-to-pinata", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            
            const provider = new ethers.BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = await provider.getSigner();
            const feeData = await provider.getFeeData();

            const contract = new ethers.Contract(CONTRACT_ADDRESS, MyNFT.abi, signer);
            const tx = await contract.mint(await signer.getAddress(), data.uri, {
                value: ethers.parseEther("0.1"),
            });
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
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 text-center">Mint New NFT</h2>
        
          {/* File Upload */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">NFT Image</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                    <div className="flex text-sm text-gray-600">
                    <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                    >
                        <span>Upload a file</span>
                        <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={(e) => setFile(e.target.files?.[0])}
                        />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
                </div>
                {file && (
                <p className="text-sm text-gray-500 truncate">
                    Selected: {file.name}
                </p>
                )}
            </div>

            {/* Name Input */}
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    NFT Name
                </label>
                <input
                type="text"
                id="name"
                placeholder="My Awesome NFT"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="off"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            {/* Description Textarea */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
                </label>
                <textarea
                id="description"
                rows={3}
                placeholder="Describe your NFT..."
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            {/* Mint Button */}
            <div className="pt-2">
                <button
                onClick={handleMint}
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                {loading ? (
                    <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Minting...
                    </>
                ) : (
                    "Mint NFT"
                )}
                </button>
            </div>

            {/* Success Message */}
            {minted && (
                <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    </div>
                    <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                        NFT Minted Successfully! Token ID: <span className="font-bold">{minted}</span>
                    </p>
                    </div>
                </div>
            </div>
        )}
        </div>
    )
}