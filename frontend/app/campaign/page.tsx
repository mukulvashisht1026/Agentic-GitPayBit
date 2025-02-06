import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
// // import {
// //     Address,
// //     Avatar,
// //     Name,
// //     Identity,
// //     EthBalance,
// //   } from '@coinbase/onchainkit/identity';
// //   import { color } from '@coinbase/onchainkit/theme';
// //   import {
// //     ConnectWallet,
// //     Wallet,
// //     WalletAdvancedDefault,
// //     WalletAdvancedTokenHoldings,
// //     WalletDropdown,
// //     WalletDropdownBasename, 
// //     WalletDropdownDisconnect,
// //   } from '@coinbase/onchainkit/wallet';


// //   import { coinbaseWallet } from 'wagmi/connectors';
// import { BrowserProvider } from 'ethers';
// import { Contract } from 'ethers';
// import { JsonRpcSigner } from 'ethers';
 


// Your contract ABI (this should be from the compilation output)
const contractABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "ERC721IncorrectOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ERC721InsufficientApproval",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "approver",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidApprover",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidOperator",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "receiver",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidReceiver",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidSender",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ERC721NonexistentToken",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "OwnableInvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "OwnableUnauthorizedAccount",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "approved",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "ApprovalForAll",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_fromTokenId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_toTokenId",
          "type": "uint256"
        }
      ],
      "name": "BatchMetadataUpdate",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "campaignId",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "githubUsername",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "repositoryName",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "campaignName",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "prizePool",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "creator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address[]",
          "name": "maintainers",
          "type": "address[]"
        }
      ],
      "name": "CampaignCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "campaignId",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "contributor",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "level",
          "type": "uint256"
        }
      ],
      "name": "LevelAssigned",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "MetadataUpdate",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "campaignId",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "contributor",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "level",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "metadataURI",
          "type": "string"
        }
      ],
      "name": "NFTMinted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "contributor",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "NFTPaid",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "campaignId",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "contributor",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "level",
          "type": "uint256"
        }
      ],
      "name": "assignLevel",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "campaignLevels",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "nftSupply",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "metadataURI",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "name": "campaigns",
      "outputs": [
        {
          "internalType": "string",
          "name": "githubUsername",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "repositoryName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "campaignName",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "prizePool",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "creator",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "exists",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "contributorLevels",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_githubUsername",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_repositoryName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_campaignName",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_prizePool",
          "type": "uint256"
        },
        {
          "internalType": "address[]",
          "name": "_maintainers",
          "type": "address[]"
        },
        {
          "internalType": "uint256[]",
          "name": "_levelSupplies",
          "type": "uint256[]"
        },
        {
          "internalType": "string[]",
          "name": "_levelURIs",
          "type": "string[]"
        }
      ],
      "name": "createCampaign",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "getApproved",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "isApprovedForAll",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "campaignId",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "isMaintainer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "campaignId",
          "type": "bytes32"
        }
      ],
      "name": "mintNFT",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "nftPayments",
      "outputs": [
        {
          "internalType": "bool",
          "name": "paid",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ownerOf",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "payNFT",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "setApprovalForAll",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "tokenURI",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "campaignId",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "contributor",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "level",
          "type": "uint256"
        }
      ],
      "name": "verifyNFT",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

const contractAddress = '0xcD34D12Dd51b2152986bc948141fF05E0189A9ea'; // Add your deployed contract address here



export default function Onchain() {

  const [account, setAccount] = useState<JsonRpcSigner | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [campaignId, setCampaignId] = useState('');
  const [githubUsername, setGithubUsername] = useState('');
  const [repositoryName, setRepositoryName] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const [prizePool, setPrizePool] = useState('');
  const [maintainers, setMaintainers] = useState<string[] >([]);
  const [level, setLevel] = useState(0);
  const [nftMinted, setNftMinted] = useState(false);


      useEffect(() => {
    const init = async () => {
    try {

      // Connect to Ethereum network and contract
      const _provider =  new ethers.BrowserProvider(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const _contract = new ethers.Contract(contractAddress, contractABI, await _provider.getSigner());
      setProvider(_provider);
      setContract(_contract);
        console.log('this is the contract...... ', _contract);
      const accounts = await _provider.listAccounts();
      setAccount(accounts[0]);

    } catch (error) {
        console.error(error);
        alert('Error initializing campaign');
      }
    };

    init();
  }, []);



  // Create Campaign
  const createCampaign = async () => {
    try {
      const tx = await contract?.createCampaign(
        githubUsername,
        repositoryName,
        campaignName,
        ethers.parseEther(prizePool),
        maintainers,
        [10, 20], // Example Level supplies
        ['https://example.com/level1.json', 'https://example.com/level2.json'] // Example URIs
      );
      await tx.wait();
      alert('Campaign Created!');
    } catch (error) {
      console.error(error);
      alert('Error creating campaign');
    }
  };


  const mintNFT = async () => {

    console.log('minting nft');

  };

  const assignLevel = async () => {
    console.log("assigning")
  };



  return (
    <div className='flex justify-center align-middle m-10' >
        
    <div className='flex justify-center align-middle m-96'>

    <div>
      <h1>OpenSource Campaign NFT</h1>
      <p>Connected Account: {account?.getAddress()}</p>

      <div>
        <h2>Create Campaign</h2>
        <input
          type="text"
          placeholder="GitHub Username"
          value={githubUsername}
          onChange={(e) => setGithubUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="Repository Name"
          value={repositoryName}
          onChange={(e) => setRepositoryName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Campaign Name"
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Prize Pool"
          value={prizePool}
          onChange={(e) => setPrizePool(e.target.value)}
        />
        <input
          type="text"
          placeholder="Maintainers (comma separated)"
          value={maintainers}
          onChange={(e) => setMaintainers(e.target.value.split(','))}
        />
        <button onClick={createCampaign}>Create Campaign</button>
      </div>

      <div>
        <h2>Assign Level to Developer</h2>
        <input
          type="text"
          placeholder="Campaign ID"
          value={campaignId}
          onChange={(e) => setCampaignId(e.target.value)}
        />
        <input
          type="number"
          placeholder="Level"
          value={level}
          onChange={(e) => setLevel(Number(e.target.value))}
        />
        <button onClick={assignLevel}>Assign Level</button>
      </div>

      <div>
        <h2>Mint NFT</h2>
        <button onClick={mintNFT}>Mint NFT</button>
        {nftMinted && <p>Your NFT has been minted successfully!</p>}
      </div>
    </div>
    </div>
    </div>
  )
}




// // const OnChain = () => {






// //   // Assign Level
// //   const assignLevel = async () => {
// //     try {
// //       const tx = await contract.assignLevel(campaignId, account, level);
// //       await tx.wait();
// //       alert('Level assigned!');
// //     } catch (error) {
// //       console.error(error);
// //       alert('Error assigning level');
// //     }
// //   };

// //   // Mint NFT
// //   const mintNFT = async () => {
// //     try {
// //       const tx = await contract.mintNFT(campaignId);
// //       await tx.wait();
// //       setNftMinted(true);
// //       alert('NFT Minted!');
// //     } catch (error) {
// //       console.error(error);
// //       alert('Error minting NFT');
// //     }
// //   };

// //   return (
  
// //   );
// // };

// // export default OnChain;




// // <Wallet>
// //         <ConnectWallet>
// //           <Avatar className="h-6 w-6" />
// //           <Name />
// //         </ConnectWallet>
// //         <WalletDropdown>
// //           <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
// //             <Avatar />
// //             <Name />
// //             <Address className={color.foregroundMuted} />
// //           </Identity>
// //           {/* <WalletAdvancedDefault/> */}
// //           <WalletDropdownDisconnect />
// //         </WalletDropdown>
// //       </Wallet>