// const { expect } = require("chai");
// const { ethers } = require("hardhat");
// const { BigNumber } = require("ethers");

// describe("OpenSourceCampaignNFT", function () {
//   let OpenSourceCampaignNFT;
//   let contract;
//   let owner, maintainer, contributor;
//   let campaignId;

//   beforeEach(async function () {
//     // Get accounts
//     [owner, maintainer, contributor] = await ethers.getSigners();

//     // Deploy contract
//     OpenSourceCampaignNFT = await ethers.getContractFactory("OpenSourceCampaignNFT");
//     contract = await OpenSourceCampaignNFT.deploy();

//     // Create a campaign for testing
//     const githubUsername = "testUser1";
//     const repositoryName = "testRepo";
//     const campaignName = "Test Campaign2";
//     const prizePool = ethers.parseEther("10");
//     const maintainers = [maintainer.address];
//     const levelSupplies = [2];
//     const levelURIs = ["https://testuri.com/level1"];

//     // const createdCampaign = await contract.createCampaign(
//     //   githubUsername,
//     //   repositoryName,
//     //   campaignName,
//     //   prizePool,
//     //   maintainers,
//     //   levelSupplies,
//     //   levelURIs
//     // );
//     // Get the campaign ID using the keccak256 hash
//     // await contract.cam


//     const abiCoder = new AbiCoder()

//     console.log('abicoder propso', Object.getOwnPropertyNames(abiCoder.prototype));


//     await expect(contract.createCampaign(
//       githubUsername,
//       repositoryName,
//       campaignName,
//       prizePool,
//       maintainers,
//       levelSupplies,
//       levelURIs
//     ))
//     .to.emit(contract, "CampaignCreated")
//     .withArgs(
//       // the expected arguments for the CampaignCreated event
//       ethers.keccak256(
//         abiCoder.encode(
//           ["string", "string", "string", "address"],
//           [githubUsername, repositoryName, campaignName, owner.address]
//         )), // campaignId is generated as the keccak256 hash
//       githubUsername,
//       repositoryName,
//       campaignName,
//       prizePool,
//       owner.address,
//       maintainers
//     );

//     const receipt = await createdCampaign.wait()
//       // console.log(receipt, 'reciept <<< ')
//       const events = receipt.events; // `events` will contain an array of emitted events
// console.log(' 00 90 9------ -- ', events , ' ---fsdfsdf--- ');
//     // for (const event of receipt.events) {
//     //   console.log(`Event ${event.event} with args ${event.args}`);
//     // }

//     console.log(createdCampaign, 'created campaign')
    
   


//     campaignId = ethers.keccak256(
//       abiCoder.encode(
//         ["string", "string", "string", "address"],
//         [githubUsername, repositoryName, campaignName, owner.address]
//       )
//     );
   
//     console.log(campaignId, "campaignId")
//   });

//   it("should create a new campaign", async function () {
//     const campaign = await contract.campaigns(campaignId);
//     console.log(campaignId, campaign)
//     expect(campaign.exists).to.be.true;
//     expect(campaign.githubUsername).to.equal("testUser");
//     expect(campaign.repositoryName).to.equal("testRepo");
//     expect(campaign.campaignName).to.equal("Test Campaign");
//   });

//   it("should assign a level to a contributor", async function () {
//     await contract.assignLevel(campaignId, contributor.address, 1);
//     const levels = await contract.contributorLevels(campaignId, contributor.address);
//     expect(levels).to.include(1);
//   });

//   // it("should not allow non-maintainer to assign a level", async function () {
//   //   await expect(
//   //     contract.connect(contributor).assignLevel(campaignId, contributor.address, 1)
//   //   ).to.be.revertedWith("Not authorized");
//   // });

//   // it("should mint an NFT when a contributor reaches a level", async function () {
//   //   await contract.assignLevel(campaignId, contributor.address, 1);

//   //   // Check that the contributor is assigned the level
//   //   const levelsBeforeMint = await contract.contributorLevels(campaignId, contributor.address);
//   //   expect(levelsBeforeMint).to.include(1);

//   //   await contract.connect(contributor).mintNFT(campaignId);

//   //   // Check if NFT is minted
//   //   const balance = await contract.balanceOf(contributor.address);
//   //   expect(balance).to.equal(1);

//   //   // Check if the token URI is set correctly
//   //   const tokenId = await contract.tokenOfOwnerByIndex(contributor.address, 0);
//   //   const tokenURI = await contract.tokenURI(tokenId);
//   //   expect(tokenURI).to.equal("https://testuri.com/level1");
//   // });

//   // it("should not mint NFT if no levels are assigned", async function () {
//   //   await expect(contract.connect(contributor).mintNFT(campaignId))
//   //     .to.be.revertedWith("No assigned levels");
//   // });

//   // it("should verify that the contributor owns an NFT for a specific level", async function () {
//   //   await contract.assignLevel(campaignId, contributor.address, 1);
//   //   await contract.connect(contributor).mintNFT(campaignId);

//   //   const isVerified = await contract.verifyNFT(campaignId, contributor.address, 1);
//   //   expect(isVerified).to.be.true;
//   // });

//   // it("should allow maintainers to pay the developer associated with an NFT", async function () {
//   //   await contract.assignLevel(campaignId, contributor.address, 1);
//   //   await contract.connect(contributor).mintNFT(campaignId);

//   //   const tokenId = await contract.tokenOfOwnerByIndex(contributor.address, 0);
    
//   //   // Send payment to the NFT holder
//   //   const paymentAmount = ethers.parseEther("1");
//   //   await expect(
//   //     contract.connect(maintainer).payNFT(tokenId, { value: paymentAmount })
//   //   )
//   //     .to.emit(contract, "NFTPaid")
//   //     .withArgs(tokenId, contributor.address, paymentAmount);

//   //   const paymentDetails = await contract.nftPayments(tokenId);
//   //   expect(paymentDetails.paid).to.be.true;
//   //   expect(paymentDetails.amount).to.equal(paymentAmount);
//   // });

//   // it("should not allow payment if NFT payment has already been made", async function () {
//   //   await contract.assignLevel(campaignId, contributor.address, 1);
//   //   await contract.connect(contributor).mintNFT(campaignId);

//   //   const tokenId = await contract.tokenOfOwnerByIndex(contributor.address, 0);
//   //   const paymentAmount = ethers.parseEther("1");

//   //   await contract.connect(maintainer).payNFT(tokenId, { value: paymentAmount });

//   //   // Try to pay again
//   //   await expect(
//   //     contract.connect(maintainer).payNFT(tokenId, { value: paymentAmount })
//   //   ).to.be.revertedWith("NFT payment already made");
//   // });

//   // it("should check if address is maintainer", async function () {
//   //   const isMaintainer = await contract.isMaintainer(campaignId, maintainer.address);
//   //   expect(isMaintainer).to.be.true;

//   //   const isNotMaintainer = await contract.isMaintainer(campaignId, contributor.address);
//   //   expect(isNotMaintainer).to.be.false;
//   // });
// });
