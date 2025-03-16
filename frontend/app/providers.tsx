"use client";

import { baseSepolia } from "wagmi/chains";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import type { ReactNode } from "react";


import { SessionProvider } from "next-auth/react";
import { EthersProvider } from "@/app/context/context"; // Import the EthersProvider
import { AIResponseProvider } from "./context/dynamicAIContentContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AIResponseProvider>
      {/* <OnchainKitProvider
        apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
        chain={baseSepolia}
        config={{
          appearance: {
            mode: "auto",
          },
        }}
      > */}
        <EthersProvider>{children}</EthersProvider>
      {/* </OnchainKitProvider> */}
      </AIResponseProvider>
    </SessionProvider>
  );
}