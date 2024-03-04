import React, { useState, useEffect } from "react";
import { API_ENDPOINT } from "../../config/constants";
import MatchesList from "./MatchesList";

interface Match {
  id: number;
  name: string;
  location: string;
  sportName: string;
  endsAt: string;
  isRunning: boolean;
  teams: { id: number; name: string }[];
}

const Matches: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_ENDPOINT}/matches`);
      if (!response.ok) {
        throw new Error("Failed to fetch matches");
      }
      const data = await response.json();
      const sorted = data.matches.sort((_a: Match, b: Match) => {
        return b.isRunning ? 1 : -1;
      });
      setMatches(sorted);
    } catch (error: any) {
      setError(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchMatches();
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <div>
          <button onClick={handleRefresh}>Refresh Scores</button>
          <MatchesList matches={matches} />
        </div>
      )}
    </div>
  );
};

export default Matches;
