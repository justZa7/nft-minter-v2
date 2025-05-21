"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { fetchUserNFTs } from "@/lib/getUserNfts";
import Image from "next/image";

export default function MyNFTPage() {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    async function loadNFTs() {
      if (!window.ethereum) return alert("Please install MetaMask");

      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);

      try {
        const rawNFTs = await fetchUserNFTs(accounts[0]);

        const parsedNFTs = await Promise.all(
          rawNFTs.map(async ({ tokenId, tokenURI }) => {
            const url = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
            try {
              const res = await fetch(url);
              const meta = await res.json();
              return {
                tokenId,
                name: meta.name,
                description: meta.description,
                image: meta.image.replace("ipfs://", "https://ipfs.io/ipfs/"),
              };
            } catch (e) {
              return {
                tokenId,
                name: "Unknown",
                description: "Failed to fetch metadata",
                image: "",
              };
            }
          })
        );

        setNfts(parsedNFTs);
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadNFTs();
  }, []);

  if (loading) return <p>Loading your NFTs...</p>;
  if (!account) return <p>Please connect your wallet.</p>;
  if (nfts.length === 0) return <p>You don&apos;t own any NFTs yet.</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">My NFT Collection</h1>
  
     {nfts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500">No NFTs found in your collection</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {nfts.map(({ tokenId, name, description, image }) => (
            <div 
              key={tokenId} 
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
            >
              {image && (
                <div className="aspect-square overflow-hidden">
                  <Image 
                    src={image} 
                    alt={name} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/400x400?text=NFT+Image';
                      e.target.onerror = null;
                    }}
                  />
                </div>
              )}
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 truncate">{name || `Untitled #${tokenId}`}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{description || 'No description available'}</p>
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-md text-gray-600">ID: {tokenId}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>  
);
}
