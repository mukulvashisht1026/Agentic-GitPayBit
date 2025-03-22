"use client"; // Ensures this is a client component

import { useState } from "react";
import { useEthers } from "@/app/context/context";
import { ethers } from "ethers";

export default function CampaignClient() {
  const { contract, account, connectWallet, disconnectWallet } = useEthers();
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
