'use client';

import { useState } from 'react';

export default function TabsClient({ tabs }: { tabs: { [key: string]: React.ReactNode } }) {
  const tabKeys = Object.keys(tabs);
  const [activeTab, setActiveTab] = useState(tabKeys[0]); // Default to the first tab

  return (
    <div className="w-1/2 mt-10 justify-center">
      {/* Tabs Header */}
      <div className="flex">
        {tabKeys.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-4 text-lg font-semibold ${
              activeTab === tab ? 'border-b-4 border-white text-white' : 'text-gray-300'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Keep all tabs mounted but control visibility */}
      <div className="border border-b-8 border-r-8 rounded-lg border-yellow-400">
        {tabKeys.map((tab) => (
          <div key={tab} style={{ display: activeTab === tab ? 'block' : 'none' }}>
            {tabs[tab]}
          </div>
        ))}
      </div>
    </div>
  );
}
