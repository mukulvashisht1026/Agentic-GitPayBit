import { buildModule } from "@nomicfoundation/ignition-core";

const GitBitModule = buildModule("GitBitModule", (m) => {
    const gitBit = m.contract("GitBitNFT");
    return {gitBit};
})

export default GitBitModule;