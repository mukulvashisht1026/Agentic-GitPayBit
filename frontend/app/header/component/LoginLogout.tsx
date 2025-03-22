"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function LoginLogout() {
  const { data: session } = useSession();
  const [username, setUsername] = useState<string | null>(null);
  const [isClicked, setIsClicked] = useState(true);

  useEffect(() => {
    console.log('session 123_123', session)
    if (session?.accessToken) {
      // authenticateWithBackend(session.accessToken);
      setUsername(session?.user?.name || "")

    }
  }, [session?.accessToken]);



  return (
    <>
      {session ? (
        <div>
          <div className="flex">
          <p className="just mr-8 text-white">Logged in as: {username || "User"}</p>
          <button
            onClick={() => signOut()}
            className={`bg-red-900 text-white mr-5 rounded-md transition border-yellow-200 px-6 py-[12px] hover:bg-gray-900 hover:border-[3px]
            ${isClicked ? "border border-b-[5px] border-r-[5px]" : "bg-gray-900 border-[3px]"}`}
          >
            Sign Out
          </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => {
            setIsClicked(!isClicked);
            signIn("github");
          }}
          className={`bg-green-900 text-white mr-5 rounded-md transition border-yellow-200 px-6 py-[12px] hover:bg-gray-900 hover:border-[3px]
          ${isClicked ? "border border-b-[5px] border-r-[5px]" : "bg-gray-900 border-[3px]"}`}
        >
          Sign in with GitHub
        </button>
      )}
    </>
  );
}
