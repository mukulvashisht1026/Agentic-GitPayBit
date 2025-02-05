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
import ArrowSvg from '../../svg/ArrowSvg';
import ImageSvg from '../../svg/Image';
import OnchainkitSvg from '../../svg/OnchainKit';
import { signOut } from "next-auth/react";
import Chat from '../chat/Chat';
// const components = [
//   {
//     name: 'Transaction',
//     url: 'https://onchainkit.xyz/transaction/transaction',
//   },
//   { name: 'Swap', url: 'https://onchainkit.xyz/swap/swap' },
//   { name: 'Checkout', url: 'https://onchainkit.xyz/checkout/checkout' },
//   { name: 'Wallet', url: 'https://onchainkit.xyz/wallet/wallet' },
//   { name: 'Identity', url: 'https://onchainkit.xyz/identity/identity' },
// ];

// const templates = [
//   { name: 'NFT', url: 'https://github.com/coinbase/onchain-app-template' },
//   { name: 'Commerce', url: 'https://github.com/coinbase/onchain-commerce-template'},
//   { name: 'Fund', url: 'https://github.com/fakepixels/fund-component' },
// ];

type HeaderProps = {
  username: string | null;
};

export default function Dashboard({ username }: HeaderProps) {
  return (<>
    <div className="flex flex-col min-h-screen font-sans dark:bg-background dark:text-white bg-white text-black">
      <header className="pt-4 pr-4">
        <div className="flex justify-end">
        <div className="flex items-center gap-4">
        {username && <p className="text-gray-800 hidden sm:block">{username}</p>}
        <button
          onClick={() => signOut()}
          className="bg-red-600 text-white px-4 py-2 mr-5 rounded-lg hover:bg-red-700 transition"
        >
          Sign Out
        </button>
      </div>
          {/* <div className="wallet-container">
            <Wallet>
              <ConnectWallet>
                <Avatar className="h-6 w-6" />
                <Name />
              </ConnectWallet>
              <WalletDropdown>
                <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                  <Avatar />
                  <Name />
                  <Address />
                  <EthBalance />
                </Identity>
                <WalletDropdownLink
                  icon="wallet"
                  href="https://keys.coinbase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Wallet
                </WalletDropdownLink>
                <WalletDropdownDisconnect />
              </WalletDropdown>
            </Wallet>
          </div> */}
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center">
     
       <Chat/>
      </main>
    </div></>
  );
}
