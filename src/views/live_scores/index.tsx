import ErrorBoundary from "../../components/ErrorBoundary";
import Matches from "../../components/matches/Matches";

const LiveScores = () => {
  return (
    <>
      <div>
        <h1 className="text-5xl mx-4 my-5 text-bold">Live Scores</h1>
        <ErrorBoundary>
          <Matches></Matches>
        </ErrorBoundary>
      </div>
    </>
  );
};

export default LiveScores;
