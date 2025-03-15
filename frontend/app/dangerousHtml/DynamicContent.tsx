"use client";

import { useEffect, useState } from "react";
import ClientRenderer from "./ClientRenderer";
import { useAIResponse } from "../context/dynamicAIContentContext";

async function getContent(message: string) {
  if (!message) return "<div>No content available</div>"; // Handle empty messages

  try {
    // https://gitbit-9138f8eb30be.herokuapp.com/chat
    const apiUrl = process.env.NEXT_PUBLIC_API_URL_BACKEND || "https://gitbit-9138f8eb30be.herokuapp.com";
    const response = await fetch(`${apiUrl}/get-code?message=${encodeURIComponent(message)}`);
    const data = await response.json();
    return data.codeString;
  } catch (error) {
    console.error("Error fetching data:", error);
    return "<div>Error loading content</div>";
  }
}

export default function DynamicContent() {
  const { aiResponse } = useAIResponse(); // Get AI-generated response
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    if (aiResponse) {
      const fetchData = async () => {  // ✅ Function expression (arrow function)
        const htmlContent = await getContent(aiResponse);
        setContent(htmlContent);
      };
      fetchData();
    }
  }, [aiResponse]);// Re-run when aiResponse changes

  return <ClientRenderer content={content} />;
}
