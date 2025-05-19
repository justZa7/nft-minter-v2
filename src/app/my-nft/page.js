"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { fetchUserNFTs } from "@/lib/getUserNfts";

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
        const data = await fetchUserNFTs(accounts[0]);
        setNfts(data);
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
    <div>
      <h1>My NFTs</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
        {nfts.map(({ tokenId, tokenURI }) => {
          // tokenURI biasanya ipfs://cid, convert ke https gateway
          const imageUrl = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");

          return (
            <div key={tokenId} style={{ border: "1px solid #ccc", padding: 10, width: 200 }}>
              <img src={imageUrl} alt={`NFT ${tokenId}`} style={{ maxWidth: "100%" }} />
              <p>Token ID: {tokenId}</p>
              <p>
                <a href={imageUrl} target="_blank" rel="noreferrer">
                  View on IPFS
                </a>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
