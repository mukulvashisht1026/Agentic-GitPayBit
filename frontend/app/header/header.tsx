'use client';

import { SessionProvider } from "next-auth/react";
import LoginLogout from "./component/LoginLogout";



type HeaderProps = {
  username: string | null;
};

export default function Header() {
  return (<>


<header>
    <nav className="mb-2  px-4 lg:px-6 py-2.5 bg-gray-200">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
            <div className="flex items-center">
                {/* <img src="https://flowbite.com/docs/images/logo.svg" className="mr-3 h-6 sm:h-9" alt="Flowbite Logo" /> */}
                <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white"> <LoginLogout></LoginLogout></span>
            </div>
           
        </div>
    </nav>
</header>  
     </>
  );
}


 /* <div classNameName="wallet-container">
            <Wallet>
              <ConnectWallet>
                <Avatar classNameName="h-6 w-6" />
                <Name />
              </ConnectWallet>
              <WalletDropdown>
                <Identity classNameName="px-4 pt-3 pb-2" hasCopyAddressOnClick>
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
          </div> */