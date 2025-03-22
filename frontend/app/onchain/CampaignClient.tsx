"use client"; // Ensures this is a client component

import { useEthers } from "@/app/context/context";

export default function CampaignClient() {
  const { account, connectWallet, disconnectWallet } = useEthers();



  return (
    <div className="p-4 space-y-4">
     {!account ? (<>
        <button onClick={connectWallet} className="bg-blue-500 text-white p-2 rounded">
          Connect Wallet
        </button>

        {/* <div className="text-white">Hello</div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4 bg-gray-800 text-white rounded-lg">
      <input
        type="text"
        name="githubUsername"
        value={campaignData.githubUsername}
        onChange={handleChange}
        placeholder="GitHub Username"
        className="w-full p-2 rounded bg-gray-700"
      />
      <input
        type="text"
        name="repositoryName"
        value={campaignData.repositoryName}
        onChange={handleChange}
        placeholder="Repository Name"
        className="w-full p-2 rounded bg-gray-700"
      />
      <input
        type="text"
        name="campaignName"
        value={campaignData.campaignName}
        onChange={handleChange}
        placeholder="Campaign Name"
        className="w-full p-2 rounded bg-gray-700"
      />
      <input
        type="text"
        name="prizePool"
        value={campaignData.prizePool}
        onChange={handleChange}
        placeholder="Prize Pool (ETH)"
        className="w-full p-2 rounded bg-gray-700"
      />
      <input
        type="text"
        name="maintainers"
        value={campaignData.maintainers}
        onChange={handleChange}
        placeholder="Maintainers (comma-separated)"
        className="w-full p-2 rounded bg-gray-700"
      />
      <input
        type="text"
        name="levelSupplies"
        value={campaignData.levelSupplies}
        onChange={handleChange}
        placeholder="Level Supplies (comma-separated)"
        className="w-full p-2 rounded bg-gray-700"
      />
      <input
        type="text"
        name="levelURIs"
        value={campaignData.levelURIs}
        onChange={handleChange}
        placeholder="Level URIs (comma-separated)"
        className="w-full p-2 rounded bg-gray-700"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
        Create Campaign
      </button>
    </form> */}

      </>) : (<> <button onClick={disconnectWallet} className="bg-gray-700 text-white p-2 rounded">
          Disconnect ({account})
        </button></>)}
     
      

    
    </div>
  );
}
