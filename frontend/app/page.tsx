
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
import Link from 'next/link';
import Header from './header/header';
import LoginPage from './login/LoginPage';
import Chat from './chat/Chat';
import CampaignUI from './onchain/CampaignUI';
import Tabs from './tabs/tabs';
import DynamicContent from './dangerousHtml/DynamicContent';

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


// Example Server Components
const chatTabComponent =  <div className="p-2"><Chat/></div>;
const campaignTabComponent = <div className="p-2"><CampaignUI/></div>;
// const SettingsComponent = () => <div className="p-4">⚙️ Adjust your Settings here. (Server Component)</div>;



export default function App() {
  const tabsComponent = {
    chat: chatTabComponent,
    campaign: campaignTabComponent
  };


  return (
    <>

      <Header></Header>
      <Tabs tabs={tabsComponent}></Tabs>
      <DynamicContent/>
    
    </>
  );
}
