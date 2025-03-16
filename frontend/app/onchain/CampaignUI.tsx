import dynamic from "next/dynamic";


export default function CampaignUI() {
  return (
    <div>
      <h1 className="text-xl font-bold p-4"></h1>
      {/* Load the client-side component */}
      <CampaignClient />
    </div>
  );
}

// Import the client component dynamically (prevents SSR issues)
const CampaignClient = dynamic(() => import("./CampaignClient"), { ssr: false });


