// app/onchain/CampaignUI.tsx
export default function CampaignUI() {
  return (
    <div>
      <h1 className="text-xl font-bold p-4">Open Source Campaign</h1>
      {/* Load the client-side component */}
      <CampaignClient />
    </div>
  );
}

// Import the client component dynamically (prevents SSR issues)
import dynamic from "next/dynamic";
const CampaignClient = dynamic(() => import("./CampaignClient"), { ssr: false });




// import { useState } from "react";
// import { useEthers } from "@/app/context/context";
// import { ethers } from "ethers";


// export default function CampaignUI() {
//   const { contract, account, connectWallet } = useEthers();
//   const [campaignData, setCampaignData] = useState({
//     githubUsername: "",
//     repositoryName: "",
//     campaignName: "",
//     prizePool: "",
//     maintainers: "",
//     levelSupplies: "",
//     levelURIs: "",
//   });
//   const [campaignId, setCampaignId] = useState("");
//   const [level, setLevel] = useState("");
//   const [contributor, setContributor] = useState("");
//   const [tokenId, setTokenId] = useState("");
//   const [paymentAmount, setPaymentAmount] = useState("");

//   const createCampaign = async () => {
//     if (!contract) return;
//     const maintainersArray = campaignData.maintainers.split(",");
//     const levelSuppliesArray = campaignData.levelSupplies.split(",").map(Number);
//     const levelURIsArray = campaignData.levelURIs.split(",");
//     await contract.createCampaign(
//       campaignData.githubUsername,
//       campaignData.repositoryName,
//       campaignData.campaignName,
//       ethers.parseUnits(campaignData.prizePool, "ether"),
//       maintainersArray,
//       levelSuppliesArray,
//       levelURIsArray
//     );
//   };

//   const assignLevel = async () => {
//     if (!contract) return;
//     await contract.assignLevel(campaignId, contributor, Number(level));
//   };

//   const mintNFT = async () => {
//     if (!contract) return;
//     await contract.mintNFT(campaignId);
//   };

//   const payNFT = async () => {
//     if (!contract) return;
//     await contract.payNFT(tokenId, { value: ethers.parseUnits(paymentAmount, "ether") });
//   };

//   return (
//     <div className="p-4 space-y-4">
//       <h1 className="text-xl font-bold">Open Source Campaign</h1>
//       {!account && <button onClick={connectWallet}>Connect Wallet</button>}

//       <div>
//         <h2 className="font-bold">Create Campaign</h2>
//         <input placeholder="GitHub Username" onChange={(e) => setCampaignData({ ...campaignData, githubUsername: e.target.value })} />
//         <input placeholder="Repository Name" onChange={(e) => setCampaignData({ ...campaignData, repositoryName: e.target.value })} />
//         <input placeholder="Campaign Name" onChange={(e) => setCampaignData({ ...campaignData, campaignName: e.target.value })} />
//         <input placeholder="Prize Pool (ETH)" onChange={(e) => setCampaignData({ ...campaignData, prizePool: e.target.value })} />
//         <input placeholder="Maintainers (comma-separated)" onChange={(e) => setCampaignData({ ...campaignData, maintainers: e.target.value })} />
//         <input placeholder="Level Supplies (comma-separated)" onChange={(e) => setCampaignData({ ...campaignData, levelSupplies: e.target.value })} />
//         <input placeholder="Level URIs (comma-separated)" onChange={(e) => setCampaignData({ ...campaignData, levelURIs: e.target.value })} />
//         <button onClick={createCampaign}>Create</button>
//       </div>

//       <div>
//         <h2 className="font-bold">Assign Level</h2>
//         <input placeholder="Campaign ID" onChange={(e) => setCampaignId(e.target.value)} />
//         <input placeholder="Contributor Address" onChange={(e) => setContributor(e.target.value)} />
//         <input placeholder="Level" onChange={(e) => setLevel(e.target.value)} />
//         <button onClick={assignLevel}>Assign</button>
//       </div>

//       <div>
//         <h2 className="font-bold">Mint NFT</h2>
//         <input placeholder="Campaign ID" onChange={(e) => setCampaignId(e.target.value)} />
//         <button onClick={mintNFT}>Mint</button>
//       </div>

//       <div>
//         <h2 className="font-bold">Pay NFT</h2>
//         <input placeholder="Token ID" onChange={(e) => setTokenId(e.target.value)} />
//         <input placeholder="Amount (ETH)" onChange={(e) => setPaymentAmount(e.target.value)} />
//         <button onClick={payNFT}>Pay</button>
//       </div>
//     </div>
//   );
// }
