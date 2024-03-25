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
  const [isFavourite, setIsFavourite] = useState<boolean>(() => {
    const storedValue = localStorage.getItem(`match_${match.id}_favourite`);
    return storedValue ? JSON.parse(storedValue) : false;
  });

  const getScores = async () => {
    try {
      setIsFetching(true);
      const response = await fetch(`${API_ENDPOINT}/matches/${match.id}`);
      const data = await response.json();
      setScore(data.score);
    } catch (error) {
      console.error("Error fetching scores:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const changeFavourite = () => {
    const newFavouriteState = !isFavourite;
    setIsFavourite(newFavouriteState);
    localStorage.setItem(
      `match_${match.id}_favourite`,
      JSON.stringify(newFavouriteState)
    );
    window.location.reload();
  };

  useEffect(() => {
    getScores();
  }, []);

  return (
    <div
      className="flex flex-col p-4 rounded-md shadow-sm shadow-gray-400 dark:shadow-gray-900 m-2 
    flex-grow-0 flex-shrink-0 w-96
    bg-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 dark:bg-gray-700 dark:text-slate-300"
    >
      <div className="block max-w-sm p-4 bg-gray-100 border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-800 dark:hover:bg-gray-800">
        <div className="flex justify-between">
          <p className=" w-max font-bold text-3xl">{match.sportName}</p>
          <button onClick={changeFavourite}>
            {isFavourite ? (
              <svg
                height="30px"
                width="30px"
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 501.28 501.28"
                xmlSpace="preserve"
                fill="#000000"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <g>
                    <polygon
                      style={{ fill: "#FFDA44" }}
                      points="501.28,194.37 335.26,159.33 250.64,12.27 250.64,419.77 405.54,489.01 387.56,320.29 "
                    ></polygon>
                    <polygon
                      style={{ fill: "#FFDA44" }}
                      points="166.02,159.33 0,194.37 113.72,320.29 95.74,489.01 250.64,419.77 250.64,12.27 "
                    ></polygon>
                  </g>
                </g>
              </svg>
            ) : (
              <svg
                height="30px"
                width="30px"
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 501.28 501.28"
                xmlSpace="preserve"
                fill="#000000"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <g>
                    <polygon
                      style={{ fill: "#4b5563" }}
                      points="501.28,194.37 335.26,159.33 250.64,12.27 250.64,419.77 405.54,489.01 387.56,320.29 "
                    ></polygon>
                    <polygon
                      style={{ fill: "#4b5563" }}
                      points="166.02,159.33 0,194.37 113.72,320.29 95.74,489.01 250.64,419.77 250.64,12.27 "
                    ></polygon>
                  </g>
                </g>
              </svg>
            )}
          </button>
          {match.isRunning && (
            <p className="text-red-400 rounded font-semibold text-xl">
              {match.isRunning ? "Live" : ""}
            </p>
          )}
        </div>

        <div className="my-4 flex flex-col gap-2">
          <div className="flex justify-between text-xl font-semibold">
            <p>{match.teams[0].name}</p>
            <p>{score[match.teams[0].name]}</p>
          </div>
          <div className="flex justify-between text-xl font-semibold">
            <p>{match.teams[1].name}</p>
            <p>{score[match.teams[1].name]}</p>
          </div>
        </div>
        <div className="flex">
          <svg
            fill="#e30d0d"
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-11.87 -11.87 419.45 419.45"
            stroke="#e30d0d"
            strokeWidth="0.0039571"
            height={25}
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <g>
                {" "}
                <path d="M197.849,0C122.131,0,60.531,61.609,60.531,137.329c0,72.887,124.591,243.177,129.896,250.388l4.951,6.738 c0.579,0.792,1.501,1.255,2.471,1.255c0.985,0,1.901-0.463,2.486-1.255l4.948-6.738c5.308-7.211,129.896-177.501,129.896-250.388 C335.179,61.609,273.569,0,197.849,0z M197.849,88.138c27.13,0,49.191,22.062,49.191,49.191c0,27.115-22.062,49.191-49.191,49.191 c-27.114,0-49.191-22.076-49.191-49.191C148.658,110.2,170.734,88.138,197.849,88.138z"></path>{" "}
              </g>{" "}
            </g>
          </svg>
          <p className="pb-2 text-base font-semibold">{match.location}</p>
        </div>

        <button className="my-2" onClick={getScores} disabled={isFetching}>
          {isFetching ? (
            <svg
              fill="#000000"
              viewBox="0 0 24 24"
              id="loading"
              data-name="Flat Line"
              xmlns="http://www.w3.org/2000/svg"
              className="icon flat-line"
              height={30}
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  id="secondary"
                  d="M16,18v3H8V18a6,6,0,0,1,2.4-4.8L12,12l1.6,1.2A6,6,0,0,1,16,18ZM16,6V3H8V6a6,6,0,0,0,2.4,4.8L12,12l1.6-1.2A6,6,0,0,0,16,6Z"
                  style={{ fill: "#2ca9bc", strokeWidth: 2 }}
                ></path>
                <path
                  id="primary"
                  d="M16,18v3H8V18a6,6,0,0,1,2.4-4.8L12,12l1.6,1.2A6,6,0,0,1,16,18ZM16,6V3H8V6a6,6,0,0,0,2.4,4.8L12,12l1.6-1.2A6,6,0,0,0,16,6ZM6,21H18M6,3H18"
                  style={{
                    fill: "none",
                    stroke: "#000000",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                  }}
                ></path>
              </g>
            </svg>
          ) : (
            <div className="flex flex-row gap-1">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                stroke="#3b90ba"
                height={30}
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    d="M21 12C21 16.9706 16.9706 21 12 21C9.69494 21 7.59227 20.1334 6 18.7083L3 16M3 12C3 7.02944 7.02944 3 12 3C14.3051 3 16.4077 3.86656 18 5.29168L21 8M3 21V16M3 16H8M21 3V8M21 8H16"
                    stroke="#388ad6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>{" "}
                </g>
              </svg>
              <span>Refresh</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default Match;
