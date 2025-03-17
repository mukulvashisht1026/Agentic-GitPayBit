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
  const [isClicked, setIsClicked] = useState(true);

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


       className={`bg-red-900 text-white  mr-5 rounded-md transition border-yellow-200 px-6 py-[12px] hover:bg-gray-900 hover:border-[3px]
       ${isClicked ? " border border-b-[5px] border-r-[5px] " : "bg-gray-900   border-[3px]"}`}

      //  className="bg-red-600 text-white px-4 py-2 mr-5 rounded-lg hover:bg-red-700 transition border border-yellow-200"
     >
       Sign Out
     </button>
      ) : (
     
            <button
              onClick={() => {
                setIsClicked(!isClicked)
                signIn("github")
              }}


              className={`bg-green-900 text-white  mr-5 rounded-md transition border-yellow-200 px-6 py-[12px] hover:bg-gray-900 hover:border-[3px]
              ${isClicked ? " border border-b-[5px] border-r-[5px] " : "bg-gray-900 border-[3px]"}`}



              // className="peer bg-gray-800 text-white px-4 py-2 mr-5 rounded-lg transition border border-yellow-200 focus:bg-gray-900 focus:border-b-4 focus:border-r-4"


              // className="bg-gray-800 text-white px-4 py-[6px] mr-5 rounded-lg hover:bg-gray-900 transition border border-yellow-200 focus:border-b-4 focus:border-r-4 focus:pb-[4px] focus:pr-[4px]"

              // className="bg-gray-800 text-white px-4 py-2 mr-5 rounded-lg hover:bg-gray-900 transition border border-yellow-200 outline-none hover:outline- hover:outline-4 hover:outline-yellow-200"

              // className="bg-gray-800 text-white px-4 py-2 mr-5 rounded-lg hover:bg-gray-900 hover:border-b-4 hover:border-r-4 transition border border-yellow-200"
            >
              Sign in with GitHub
            </button>
         
      )}
    </>
  );
}