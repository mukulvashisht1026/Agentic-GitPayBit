'use client';

import { useState } from 'react';

export default function TabsClient({ tabs }: { tabs: { [key: string]: React.ReactNode } }) {
  const tabKeys = Object.keys(tabs);
  const [activeTab, setActiveTab] = useState(tabKeys[0]); // Default to the first tab

  return (
    <div className="max-w-4xl mx-auto mt-10">
      {/* Tabs Header */}
      <div className="flex border-b">
        {tabKeys.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-4 text-lg font-semibold ${
              activeTab === tab ? 'border-b-4 border-blue-500 text-blue-500' : 'text-gray-600'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Keep all tabs mounted but control visibility */}
      <div className="p-4 border">
        {tabKeys.map((tab) => (
          <div key={tab} style={{ display: activeTab === tab ? 'block' : 'none' }}>
            {tabs[tab]}
          </div>
        ))}
      </div>
    </div>
  );
}
