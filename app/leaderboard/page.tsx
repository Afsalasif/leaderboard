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
    <div className="container mx-auto p-6 bg-gray-900 text-white rounded-xl shadow-2xl">
    <div className="mb-8 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:gap-6">
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-4 border border-transparent rounded-xl bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xl transition-transform duration-300 hover:scale-105"
        />
        <div className="flex gap-4 md:flex-row flex-col">
          <input
            type="number"
            placeholder="Min attempts"
            value={minAttempts}
            onChange={(e) => setMinAttempts(e.target.value)}
            className="flex-1 p-4 border border-transparent rounded-xl bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xl transition-transform duration-300 hover:scale-105"
          />
          <input
            type="number"
            placeholder="Max attempts"
            value={maxAttempts}
            onChange={(e) => setMaxAttempts(e.target.value)}
            className="flex-1 p-4 border border-transparent rounded-xl bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xl transition-transform duration-300 hover:scale-105"
          />
        </div>
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
  
      <div className="flex gap-4">
        <button
          onClick={() => fetchData(true)} // Validation applies only to search
          className="flex-1 p-4 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition-transform duration-300 hover:scale-105"
        >
          Search
        </button>
        <button
          onClick={() => {
            setSearch("");
            setMinAttempts("");
            setMaxAttempts("");
            setError("");
            fetchData(false); // No validation on refresh
          }}
          className="flex-1 p-4 bg-gray-700 text-white rounded-xl shadow-lg hover:bg-gray-600 transition-transform duration-300 hover:scale-105"
        >
          Refresh
        </button>
      </div>
    </div>
  
    {loading ? (
      <p className="text-center text-gray-400">Loading leaderboard...</p>
    ) : (
      <table className="w-full border-collapse shadow-2xl rounded-xl overflow-hidden">
        <thead className="bg-gray-800">
          <tr>
            <th className="p-4 text-left text-lg font-medium border-b border-gray-700">Name</th>
            <th className="p-4 text-left text-lg font-medium border-b border-gray-700">Email</th>
            <th className="p-4 text-left text-lg font-medium border-b border-gray-700">Attempts</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.email} className="hover:bg-gray-700 transition-all duration-300">
                <td className="p-4 border-b border-gray-700">{user.name}</td>
                <td className="p-4 border-b border-gray-700">{user.email}</td>
                <td className="p-4 border-b border-gray-700">{user.attempts}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="p-4 border-b border-gray-700 text-center text-gray-400">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    )}
  </div>
  
  
  
  );
}
