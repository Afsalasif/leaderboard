'use client'
import { useRouter } from "next/navigation"; // To handle navigation

export default function Home() {
  const router = useRouter();

  const handleGoToLeaderboard = () => {
    router.push("/leaderboard"); // Navigate to the leaderboard page
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center px-4 py-10">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to the Modern Leaderboard</h1>
        <p className="text-lg mb-8 text-gray-400">
          Discover your performance and compare with others in this sleek, modern leaderboard system.
        </p>
        
        <button
          onClick={handleGoToLeaderboard}
          className="px-6 py-3 bg-indigo-600 text-white text-lg rounded-xl shadow-lg hover:bg-indigo-700 transition-all duration-300 hover:scale-105"
        >
          Go to Leaderboard
        </button>
      </div>
    </div>
  );
}
