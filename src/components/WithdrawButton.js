'use client'

import { useState } from 'react'
import { ethers } from 'ethers'
import MyNFT from "@/contractAbi/MyNFT.json";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export default function WithdrawButton({ isOwner, walletAddress, balance, setBalance }) {
    const [status, setStatus] = useState(null)
    const [isWithdrawing, setIsWithdrawing] = useState(false)

    const handleWithdraw = async () => {
        if (!window.ethereum) {
            setStatus('No wallet found')
            return
        }

        try {
            setIsWithdrawing(true)
            setStatus(null)

            const provider = new ethers.BrowserProvider(window.ethereum)
            const signer = await provider.getSigner()
            const contract = new ethers.Contract(CONTRACT_ADDRESS, MyNFT.abi, signer)

            const tx = await contract.withdrawFee()
            setStatus('Waiting for confirmation...')
            await tx.wait()
            
            // Update balance after successful withdrawal
            const raw = await contract.getBalance();
            const formattedEther = ethers.formatEther(raw);
            setBalance(formattedEther);
            
            setStatus('Withdraw successful!')
        } catch (err) {
            setStatus(`Error: ${err.message}`)
        } finally {
            setIsWithdrawing(false)
        }
    }

    if (!isOwner) {
        return (
            <p className="text-sm text-red-500">
                Wallet <span className="font-mono">{walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}</span> is not owner.
            </p>
        )
    }

    return (
        <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Contract Funds</h2>
            
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center bg-gray-700 p-4 rounded-lg">
                    <span className="text-gray-300">Available Balance:</span>
                    <span className="text-xl font-mono text-white">
                        {balance !== null ? `${balance} ETH` : (
                            <span className="inline-block h-6 w-20 bg-gray-600 rounded animate-pulse"></span>
                        )}
                    </span>
                </div>

                <button
                    onClick={handleWithdraw}
                    disabled={isWithdrawing || !balance}
                    className={`px-6 py-3 rounded-lg font-medium transition-all
                        ${isWithdrawing || !balance 
                            ? "bg-purple-900 cursor-not-allowed" 
                            : "bg-purple-600 hover:bg-purple-500"}
                        text-white flex items-center justify-center gap-2`}
                >
                    {isWithdrawing ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </>
                    ) : (
                        'Withdraw Fees'
                    )}
                </button>

                {status && (
                    <div className={`mt-2 p-3 text-sm rounded-lg ${
                        status.includes("Failed") ? "bg-red-900 text-red-100" : "bg-green-900 text-green-100"
                    }`}>
                        {status}
                    </div>
                )}
            </div>
        </div>
    )
}