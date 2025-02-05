'use client';

import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownLink,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance,
} from '@coinbase/onchainkit/identity';
import ArrowSvg from './svg/ArrowSvg';
import ImageSvg from './svg/Image';
import OnchainkitSvg from './svg/OnchainKit';
import Login from './components/Login';
import { SessionProvider } from "next-auth/react"
import type { AppProps } from "next/app";

const components = [
  {
    name: 'Transaction',
    url: 'https://onchainkit.xyz/transaction/transaction',
  },
  { name: 'Swap', url: 'https://onchainkit.xyz/swap/swap' },
  { name: 'Checkout', url: 'https://onchainkit.xyz/checkout/checkout' },
  { name: 'Wallet', url: 'https://onchainkit.xyz/wallet/wallet' },
  { name: 'Identity', url: 'https://onchainkit.xyz/identity/identity' },
];

const templates = [
  { name: 'NFT', url: 'https://github.com/coinbase/onchain-app-template' },
  { name: 'Commerce', url: 'https://github.com/coinbase/onchain-commerce-template'},
  { name: 'Fund', url: 'https://github.com/fakepixels/fund-component' },
];

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
    <SessionProvider session={pageProps?.session}>
      <Login/>
    </SessionProvider>
    </>
  );
}
