"use client";

import { baseSepolia } from "wagmi/chains";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import type { ReactNode } from "react";

import { WagmiProvider, createConfig, http } from "wagmi";
import { coinbaseWallet, metaMask } from "wagmi/connectors";

import { SessionProvider } from "next-auth/react";
import { EthersProvider } from "@/app/context/context"; // Import the EthersProvider

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <OnchainKitProvider
        apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
        chain={baseSepolia}
        config={{
          appearance: {
            mode: "auto",
          },
        }}
      >
        <EthersProvider>{children}</EthersProvider>
      </OnchainKitProvider>
    </SessionProvider>
  );
}