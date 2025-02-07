import { createContext, useContext, useState, ReactNode } from "react";

// Define Context Type
interface AIResponseContextType {
  aiResponse: string;
  setAiResponse: (response: string) => void;
}

// Create Context
const AIResponseContext = createContext<AIResponseContextType | undefined>(undefined);

// Provider Component
export const AIResponseProvider = ({ children }: { children: ReactNode }) => {
  const [aiResponse, setAiResponse] = useState("");

  return (
    <AIResponseContext.Provider value={{ aiResponse, setAiResponse }}>
      {children}
    </AIResponseContext.Provider>
  );
};

// Custom Hook for easy access
export const useAIResponse = () => {
  const context = useContext(AIResponseContext);
  if (!context) {
    throw new Error("useAIResponse must be used within an AIResponseProvider");
  }
  return context;
};
