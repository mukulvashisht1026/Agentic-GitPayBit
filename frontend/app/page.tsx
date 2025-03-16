

import Header from './header/header';
import Chat from './chat/Chat';
import CampaignUI from './onchain/CampaignUI';
import Tabs from './tabs/tabs';
import Footer from './footer/Footer';




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
      {/* <DynamicContent/> */}
      <Footer></Footer>
    
    </>
  );
}
