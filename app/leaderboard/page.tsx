"use client";
import { useState, useEffect } from "react";

interface User {
  name: string;
  email: string;
  attempts: number;
}

export default function Leaderboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState<string>("");
  const [minAttempts, setMinAttempts] = useState<string>("");
  const [maxAttempts, setMaxAttempts] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch leaderboard data
  const fetchData = async (validate: boolean = false) => {
    if (validate) {
      // Apply validation ONLY when search is clicked
      if (!search.trim() && !minAttempts.trim() && !maxAttempts.trim()) {
        setError("Please enter at least one search filter.");
        return;
      }

      if (minAttempts && maxAttempts && Number(minAttempts) > Number(maxAttempts)) {
        setError("Min attempts cannot be greater than max attempts.");
        return;
      }
    }

    setError(""); // Clear error
    setLoading(true); // Show loading indicator

    try {
      const params = new URLSearchParams({
        ...(search && { search }),
        ...(minAttempts && { minAttempts }),
        ...(maxAttempts && { maxAttempts }),
      });

      const res = await fetch(`/api/leaderboard?${params}`, { method: "GET" });
      const data = await res.json();

      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
      setUsers([]);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  // Auto-load data on first render (without validation)
  useEffect(() => {
    fetchData(false);
  }, []);

  return (
    <div className="container mx-auto p-6 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900  shadow-2xl backdrop-blur-lg border border-white/10">
    <div className="mb-8 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="🔍 Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-lg transition-all duration-300 hover:bg-white/10"
        />
        <div className="flex gap-4">
          <input
            type="number"
            placeholder="⬆️ Min attempts"
            value={minAttempts}
            onChange={(e) => setMinAttempts(e.target.value)}
            className="w-full p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg transition-all duration-300 hover:bg-white/10"
          />
          <input
            type="number"
            placeholder="⬇️ Max attempts"
            value={maxAttempts}
            onChange={(e) => setMaxAttempts(e.target.value)}
            className="w-full p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg transition-all duration-300 hover:bg-white/10"
          />
        </div>
      </div>
  
      {error && (
        <div className="p-3 bg-red-900/50 border border-red-400/30 rounded-lg text-red-300 flex items-center gap-2">
          ⚠️ {error}
        </div>
      )}
  
      <div className="flex gap-4">
        <button
          onClick={() => fetchData(true)}
          className="flex-1 p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg hover:shadow-xl text-white font-semibold transition-all duration-300 hover:scale-[1.02] hover:from-purple-500 hover:to-blue-500 active:scale-95"
        >
          🔎Search
        </button>
        <button
          onClick={() => {
            setSearch("");
            setMinAttempts("");
            setMaxAttempts("");
            setError("");
            fetchData(false);
          }}
          className="flex-1 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 shadow-lg hover:shadow-xl text-white font-semibold transition-all duration-300 hover:scale-[1.02] hover:bg-white/20 active:scale-95"
        >
          ♻️ Refresh
        </button>
      </div>
    </div>
  
    {loading ? (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    ) : (
      <div className="overflow-x-auto rounded-xl border border-white/10 shadow-2xl">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-lg">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-purple-300 uppercase tracking-wider border-b border-white/10">
                👤 Name
              </th>
              <th className="p-4 text-left text-sm font-semibold text-blue-300 uppercase tracking-wider border-b border-white/10">
                📧 Email
              </th>
              <th className="p-4 text-left text-sm font-semibold text-indigo-300 uppercase tracking-wider border-b border-white/10">
                🎯 Attempts
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.length > 0 ? (
              users.map((user) => (
                <tr 
                  key={user.email} 
                  className="hover:bg-white/5 transition-all duration-300 group"
                >
                  <td className="p-4 text-white/90 group-hover:text-white font-medium">
                    {user.name}
                  </td>
                  <td className="p-4 text-blue-400/90 group-hover:text-blue-300">
                    {user.email}
                  </td>
                  <td className="p-4">
                    <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20">
                      <span className="text-purple-300 text-sm font-semibold">
                        {user.attempts}
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="p-8 text-center text-white/50">
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-4xl">😕</span>
                    <p className="text-lg">No users found matching your criteria</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    )}
  </div>
  
  
  
  );
}
