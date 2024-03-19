import React, { useState, useEffect, Suspense } from "react";
import { API_ENDPOINT } from "../../config/constants";
const MatchesList = React.lazy(() => import("./MatchesList"));

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
      const sorted = data.matches.sort((a: Match, b: Match) => {
        const aFavourite = localStorage.getItem(`match_${a.id}_favourite`);
        const bFavourite = localStorage.getItem(`match_${b.id}_favourite`);
        if (
          aFavourite &&
          JSON.parse(aFavourite) &&
          !(bFavourite && JSON.parse(bFavourite))
        ) {
          return -1;
        } else if (
          !(aFavourite && JSON.parse(aFavourite)) &&
          bFavourite &&
          JSON.parse(bFavourite)
        ) {
          return 1;
        } else {
          return b.isRunning ? 1 : -1;
        }
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
      {loading && (
        <div>
          <button
            disabled
            type="button"
            className="text-white bg-[#050708] hover:bg-[#050708]/80 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-[#050708]/40 dark:focus:ring-gray-600 me-2 m-2 p-1"
          >
            <svg
              aria-hidden="true"
              role="status"
              className="inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600"
              viewBox="0 0 100 101"
              fill="none"
              height={15}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="#1C64F2"
              />
            </svg>
            Loading...
          </button>
          <Suspense
            fallback={<div className="suspense-loading">Loading...</div>}
          >
            <MatchesList matches={matches} />
          </Suspense>
        </div>
      )}
      {error && <p>{error}</p>}

      {!loading && !error && (
        <div>
          <button
            onClick={handleRefresh}
            type="button"
            className="text-white bg-[#050708] hover:bg-[#050708]/80 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-[#050708]/40 dark:focus:ring-gray-600 me-2 m-2 p-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              data-name="Camada 1"
              viewBox="0 0 100 100"
              id="Refresh"
              height={15}
            >
              <path
                d="M66.42063 25.19626H91.61689V0H85.61038V14.19746A50.05167 50.05167 0 1 0 46.10564 99.90028l.54356-5.98109A44.0485 44.0485 0 1 1 82.10071 19.18975H66.42063zM53.62258 94.00718L54.01558 100a50.06189 50.06189 0 0 0 10.746-1.89463l-1.68347-5.766A44.11088 44.11088 0 0 1 53.62258 94.00718zM68.49417 90.35967l2.42841 5.49423a50.04765 50.04765 0 0 0 9.436-5.47664l-3.56245-4.83532A44.03011 44.03011 0 0 1 68.49417 90.35967zM81.20815 81.82307l4.16076 4.33087a50.33763 50.33763 0 0 0 7.0027-8.36747L87.374 74.45473A44.41638 44.41638 0 0 1 81.20815 81.82307zM93.51836 60.42585a43.766 43.766 0 0 1-3.2633 9.02834l5.39061 2.64936a49.76209 49.76209 0 0 0 3.71105-10.26992z"
                fill="#ffffff"
                className="color000000 svgShape "
              ></path>
            </svg>
            <span className="mx-2">Referesh Scores</span>
          </button>
          <Suspense
            fallback={<div className="suspense-loading">Loading...</div>}
          >
            <MatchesList matches={matches} />
          </Suspense>
        </div>
      )}
    </div>
  );
};

export default Matches;
