import React from "react";
import Match from "./Match";

interface MatchesListProps {
  matches: {
    id: number;
    name: string;
    location: string;
    sportName: string;
    endsAt: string;
    isRunning: boolean;
    teams: { id: number; name: string}[];
  }[];
}

const MatchesList: React.FC<MatchesListProps> = ({ matches }) => {
  return (
    <div className="flex w-full gap-2 overflow-x-scroll">
      {matches.map((match) => (
        <Match key={match.id} match={match}></Match>
      ))}
    </div>
  );
};

export default MatchesList;
