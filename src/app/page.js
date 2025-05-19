import Minter from "@/components/Minter";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <div className="flex justify-end mb-4">
          <Link href="/my-nfts" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            View My NFTs
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            NFT Minter
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Create and mint your unique digital assets
          </p>
        </div>
        
        {/* Minter Component */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden p-6 sm:p-8">
          <Minter />
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Powered by your blockchain technology</p>
        </div>
      </div>
    </main>
  );
}