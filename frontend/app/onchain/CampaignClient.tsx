"use client"; // Ensures this is a client component

import { useState } from "react";
import { useEthers } from "@/app/context/context";
import { ethers } from "ethers";

export default function CampaignClient() {
  const { contract, account, connectWallet } = useEthers();
  const [campaignData, setCampaignData] = useState({
    githubUsername: "",
    repositoryName: "",
    campaignName: "",
    prizePool: "",
    maintainers: "",
    levelSupplies: "",
    levelURIs: "",
  });
  const [campaignId, setCampaignId] = useState("");
  const [level, setLevel] = useState("");
  const [contributor, setContributor] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [campaignInfo, setCampaignInfo] = useState(null);

  // Function to create a campaign
  const createCampaign = async () => {
    console.log('creating campaign', contract);
    if (!contract) return;
    const maintainersArray = campaignData.maintainers.split(",");
    const levelSuppliesArray = campaignData.levelSupplies.split(",").map(Number);
    const levelURIsArray = campaignData.levelURIs.split(",");
    
    try {
      const tx = await contract.createCampaign(
        campaignData.githubUsername,
        campaignData.repositoryName,
        campaignData.campaignName,
        ethers.parseUnits(campaignData.prizePool, "ether"),
        maintainersArray,
        levelSuppliesArray,
        levelURIsArray
      );
      await tx.wait();
      alert("Campaign created successfully!");
    } catch (error) {
      console.error("Error creating campaign:", error);
    }
  };

  // Function to assign a level
  const assignLevel = async () => {
    if (!contract) return;
    try {
      const tx = await contract.assignLevel(campaignId, contributor, Number(level));
      await tx.wait();
      alert("Level assigned successfully!");
    } catch (error) {
      console.error("Error assigning level:", error);
    }
  };

  // Function to mint NFT
  const mintNFT = async () => {
    if (!contract) return;
    try {
      const tx = await contract.mintNFT(campaignId);
      await tx.wait();
      alert("NFT Minted Successfully!");
    } catch (error) {
      console.error("Error minting NFT:", error);
    }
  };

  // Function to pay for an NFT
  const payNFT = async () => {
    if (!contract) return;
    try {
      const tx = await contract.payNFT(tokenId, { value: ethers.parseUnits(paymentAmount, "ether") });
      await tx.wait();
      alert("NFT Payment Successful!");
    } catch (error) {
      console.error("Error paying for NFT:", error);
    }
  };


    // Function to fetch campaign details
    const viewCampaign = async () => {
        if (!contract || !campaignId) return;
        try {
          const campaign = await contract.getCampaignDetails(campaignId);
          setCampaignInfo(campaign);
        } catch (error) {
          console.error("Error fetching campaign details:", error);
        }
      };

  return (
    <div className="p-4 space-y-4">
      {!account && (
        <button onClick={connectWallet} className="bg-blue-500 text-white p-2 rounded">
          Connect Wallet
        </button>
      )}

         {/* View Campaign */}
      <div>
        <h2 className="font-bold">View Campaign</h2>
        <input placeholder="Campaign ID" className="border p-2 rounded w-full" onChange={(e) => setCampaignId(e.target.value)} />
        <button onClick={viewCampaign} className="bg-gray-500 text-white p-2 rounded w-full">
          View Campaign
        </button>
        {campaignInfo && (
          <div className="p-4 border rounded mt-2">
            <p><strong>Campaign Name:</strong> {campaignInfo[0]}</p>
            <p><strong>Repository:</strong> {campaignInfo[1]}</p>
            <p><strong>Prize Pool:</strong> {ethers.formatUnits(campaignInfo[2], "ether")} ETH</p>
            {/* <p><strong>Maintainers:</strong> {campaignInfo[3]?.join(", ")}</p> */}
          </div>
        )}
      </div>


      {/* Create Campaign */}
      <div>
        <h2 className="font-bold">Create Campaign</h2>
        <input placeholder="GitHub Username" className="border p-2 rounded w-full" onChange={(e) => setCampaignData({ ...campaignData, githubUsername: e.target.value })} />
        <input placeholder="Repository Name" className="border p-2 rounded w-full" onChange={(e) => setCampaignData({ ...campaignData, repositoryName: e.target.value })} />
        <input placeholder="Campaign Name" className="border p-2 rounded w-full" onChange={(e) => setCampaignData({ ...campaignData, campaignName: e.target.value })} />
        <input placeholder="Prize Pool (ETH)" className="border p-2 rounded w-full" onChange={(e) => setCampaignData({ ...campaignData, prizePool: e.target.value })} />
        <input placeholder="Maintainers (comma-separated)" className="border p-2 rounded w-full" onChange={(e) => setCampaignData({ ...campaignData, maintainers: e.target.value })} />
        <input placeholder="Level Supplies (comma-separated)" className="border p-2 rounded w-full" onChange={(e) => setCampaignData({ ...campaignData, levelSupplies: e.target.value })} />
        <input placeholder="Level URIs (comma-separated)" className="border p-2 rounded w-full" onChange={(e) => setCampaignData({ ...campaignData, levelURIs: e.target.value })} />
        <button onClick={createCampaign} className="bg-green-500 text-white p-2 rounded w-full">
          Create Campaign
        </button>
      </div>

      {/* Assign Level */}
      <div>
        <h2 className="font-bold">Assign Level</h2>
        <input placeholder="Campaign ID" className="border p-2 rounded w-full" onChange={(e) => setCampaignId(e.target.value)} />
        <input placeholder="Contributor Address" className="border p-2 rounded w-full" onChange={(e) => setContributor(e.target.value)} />
        <input placeholder="Level" className="border p-2 rounded w-full" onChange={(e) => setLevel(e.target.value)} />
        <button onClick={assignLevel} className="bg-yellow-500 text-white p-2 rounded w-full">
          Assign Level
        </button>
      </div>

      {/* Mint NFT */}
      <div>
        <h2 className="font-bold">Mint NFT</h2>
        <input placeholder="Campaign ID" className="border p-2 rounded w-full" onChange={(e) => setCampaignId(e.target.value)} />
        <button onClick={mintNFT} className="bg-purple-500 text-white p-2 rounded w-full">
          Mint NFT
        </button>
      </div>

      {/* Pay for NFT */}
      <div>
        <h2 className="font-bold">Pay NFT</h2>
        <input placeholder="Token ID" className="border p-2 rounded w-full" onChange={(e) => setTokenId(e.target.value)} />
        <input placeholder="Amount (ETH)" className="border p-2 rounded w-full" onChange={(e) => setPaymentAmount(e.target.value)} />
        <button onClick={payNFT} className="bg-red-500 text-white p-2 rounded w-full">
          Pay NFT
        </button>
      </div>
    </div>
  );
}
