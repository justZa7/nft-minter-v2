"use client"

import { useEffect, useState } from "react"
import { ethers } from "ethers"
import MyNFT from "@/contractAbi/MyNFT.json";
import WithdrawButton from "@/components/WithdrawButton";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export default function AdminPage() {
    const [isOwner, setIsOwner] = useState(false)
    const [walletAddress, setWalletAddress] = useState('')
    const [balance, setBalance] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const checkOwnerAndBalance = async () => {
            if (!window.ethereum) {
                setIsLoading(false)
                return
            }

            try {
                const provider = new ethers.BrowserProvider(window.ethereum)
                const signer = await provider.getSigner()
                const userAddress = await signer.getAddress()
                setWalletAddress(userAddress)

                const contract = new ethers.Contract(CONTRACT_ADDRESS, MyNFT.abi, provider)
                
                const ownerAddress = await contract.owner()
                setIsOwner(userAddress.toLowerCase() === ownerAddress.toLowerCase())
                
                const raw = await contract.getBalance()
                const formattedEther = ethers.formatEther(raw)
                setBalance(formattedEther)
            } catch (err) {
                console.error("Error:", err)
            } finally {
                setIsLoading(false)
            }
        }

        checkOwnerAndBalance()
    }, [])

    if (isLoading) {
        return (
            <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-700 rounded w-3/4"></div>
                    <div className="h-24 bg-gray-700 rounded"></div>
                    <div className="h-12 bg-gray-700 rounded"></div>
                </div>
            </div>
        )
    }

    return (
        <section className="min-h-screen justify-center items-center flex">
            <WithdrawButton 
                isOwner={isOwner} 
                walletAddress={walletAddress} 
                balance={balance} 
                setBalance={setBalance} 
            />
        </section>
    )
}