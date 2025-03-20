

import Header from './header/header';
import Chat from './chat/Chat';
import CampaignUI from './onchain/CampaignUI';
import Tabs from './tabs/tabs';
import Footer from './footer/Footer';




// Example Server Components
const chatTabComponent =  <div className="p-4"><Chat/></div>;
const campaignTabComponent = <div className="p-4"><CampaignUI/></div>;
// const SettingsComponent = () => <div className="p-4">⚙️ Adjust your Settings here. (Server Component)</div>;



export default function App() {
  const tabsComponent = {
    chat: chatTabComponent,
    campaign: campaignTabComponent
  };


  return (
    <>
      <div className='flex flex-col min-h-screen bg-black'>
      <Header></Header>
      <div className='flex justify-center'>
      <Tabs  tabs={tabsComponent}></Tabs>
      </div>
      {/* <DynamicContent/> */}
      <Footer></Footer>
      </div>
    </>
  );
}
