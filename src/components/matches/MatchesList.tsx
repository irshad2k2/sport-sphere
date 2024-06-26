import React from "react";
const Match = React.lazy(() => import("./Match"));

interface MatchesListProps {
  matches: {
    id: number;
    name: string;
    location: string;
    sportName: string;
    endsAt: string;
    isRunning: boolean;
    teams: { id: number; name: string }[];
  }[];
}

const MatchesList: React.FC<MatchesListProps> = ({ matches }) => {
  return (
    <div className="flex w-full gap-1 overflow-x-scroll no-scrollbar">
      {matches.map((match) => (
        <Match key={match.id} match={match}></Match>
      ))}
    </div>
  );
};

export default MatchesList;
