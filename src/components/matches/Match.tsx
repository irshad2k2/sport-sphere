import React, { useEffect, useState } from "react";
import { API_ENDPOINT } from "../../config/constants";

interface Team {
  id: number;
  name: string;
}

interface MatchProps {
  match: {
    id: number;
    name: string;
    location: string;
    sportName: string;
    endsAt: string;
    isRunning: boolean;
    teams: Team[];
  };
}

const Match: React.FC<MatchProps> = ({ match }) => {
  const [score, setScore] = useState<{ [key: string]: string }>({});
  const [isFetching, setIsFetching] = useState(false);

  const getScores = async () => {
    try {
      setIsFetching(true); // Set fetching state to true
      const response = await fetch(`${API_ENDPOINT}/matches/${match.id}`);
      const data = await response.json();
      setScore(data.score);
    } catch (error) {
      console.error("Error fetching scores:", error);
    } finally {
      setIsFetching(false); // Set fetching state to false regardless of success or failure
    }
  };

  useEffect(() => {
    getScores();
  }, []);

  return (
    <div
      className="flex flex-col p-4 rounded-md shadow-sm shadow-gray-400 dark:shadow-gray-900 m-2 
    flex-grow-0 flex-shrink-0 w-96
    bg-white dark:bg-slate-700 dark:text-slate-300"
    >
      <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        <p className="flex w-full justify-between mb-2">{match.sportName}</p>
        <p>
          {match.teams[0].name} - {score[match.teams[0].name]}
        </p>
        <p>
          {match.teams[1].name} - {score[match.teams[1].name]}
        </p>
        <p className="flex w-full justify-between mb-2">
          Location: {match.location}
        </p>

        <p className="flex w-full justify-between mb-2">
          Ends At: {new Date(match.endsAt).toLocaleString()}
        </p>
        <p className="flex w-full justify-between">
          Status: {match.isRunning ? "Running" : "Not Running"}
        </p>

        <button onClick={getScores} disabled={isFetching}>
          {isFetching ? "..." : "Refresh"}
        </button>
      </div>
    </div>
  );
};

export default Match;
