import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Dashboard from "./dashboard/dashboard";


type GitHubSession = {
    user: {
      name: string;
      email: string;
      image: string;
    };
    expires: string;
    accessToken: string;
  };

type GitHubUser = {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    user_view_type: string;
    site_admin: boolean;
    name: string;
    company: string;
    blog: string | null;
    location: string;
    email: string;
    hireable: boolean | null;
    bio: string;
    twitter_username: string | null;
    notification_email: string;
    public_repos: number;
    public_gists: number;
    followers: number;
    following: number;
    created_at: string;
    updated_at: string;
    private_gists: number;
    total_private_repos: number;
    owned_private_repos: number;
    disk_usage: number;
    collaborators: number;
    two_factor_authentication: boolean;
    plan: {
      name: string;
      space: number;
      collaborators: number;
      private_repos: number;
    };
  };


export default function Login() {
  const { data: session } = useSession();
  
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    if (session?.accessToken) {
        console.log('session is : ', session);
      const fetchData = async () => {
        const response = await fetch("https://api.github.com/user", {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });
        const data: GitHubUser = await response.json();
        console.log(data.login, 'data');
        setUsername(data.login);  // GitHub username
      };

      fetchData();
    }
  }, [session?.accessToken]);

    // console.log(session);

  return (
    <>
      
        {session ? (<>
            
            <Dashboard username={username} />
          </>
        ) : (
          <>
            <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg">
      
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          {session ? `Welcome, ${session.user?.name}` : "Login"}
        </h2>
            <button
              onClick={() => signIn("github")}
              className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition"
            >
              Sign in with GitHub
            </button>
            </div>
    </div>
          </>
        )}
    
    </>
   
  );
}