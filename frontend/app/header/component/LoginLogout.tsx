// LoginClient.tsx
"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type GitHubUser = {
  login: string;
  // ... other properties as defined earlier
};

export default function LoginLogout() {
  const { data: session } = useSession();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    if (session && "accessToken" in session) {
      const fetchData = async () => {
        const response = await fetch("https://api.github.com/user", {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });
        const data: GitHubUser = await response.json();
        setUsername(data.login);  // GitHub username
        console.log(username);
      };

      fetchData();
    }
  }, [(session && "accessToken" in session)]);

  return (
    <>
      {session ? (
       <button
       onClick={() => signOut()}
       className="bg-red-600 text-white px-4 py-2 mr-5 rounded-lg hover:bg-red-700 transition"
     >
       Sign Out
     </button>
      ) : (
     
            <button
              onClick={() => signIn("github")}
              className="bg-gray-800 text-white px-4 py-2 mr-5 rounded-lg hover:bg-gray-900 transition"
            >
              Sign in with GitHub
            </button>
         
      )}
    </>
  );
}