import TabsClient from './TabsClient';

export default function Tabs({ tabs }: { tabs: { [key: string]: React.ReactNode } }) {
  return <TabsClient tabs={tabs} />;
}