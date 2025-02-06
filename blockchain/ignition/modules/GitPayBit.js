import { buildModule } from "@nomicfoundation/ignition-core";

const GitPayBitModule = buildModule("GitPayBitModule", (m) => {
  const gitPayBit = m.contract("OpenSourceCampaignNFT"); // No constructor arguments

  return { gitPayBit };
});

export default GitPayBitModule;