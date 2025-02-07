"use client";

export default function ClientRenderer({ content }: { content: string }) {
  return (
    <div className="p-4 border">
      <h2 className="text-lg font-semibold mb-2">Dynamic Content</h2>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
