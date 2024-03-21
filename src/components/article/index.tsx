import React, { useState, useEffect, Fragment, Suspense } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { API_ENDPOINT } from "../../config/constants";

interface Article {
  id: number;
  title: string;
  thumbnail: string;
  sport: {
    id: number;
    name: string;
  };
  date: string;
  summary: string;
  teams: { id: number; name: string }[];
}

const ArticleComponent: React.FC = () => {
  const auth = localStorage.getItem("authToken");
  const [articles, setArticles] = useState<Article[]>([]);
  const [openModalIndex, setOpenModalIndex] = useState<number | null>(null);
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [userPreferences, setUserPreferences] = useState<any>(null);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [selectedFav, setSelectedFav] = useState<number>(0);
  const [savedArticles, setSavedArticles] = useState<{
    [key: number]: boolean;
  }>({});
  const [showSavedArticles, setShowSavedArticles] = useState(false);
  const [showAllSports, setShowAllSports] = useState(true);

  /////////////////////////////////////////////////////// hooks /////////////////////////////////////////////////////////////
  useEffect(() => {
    const savedArticlesData = JSON.parse(
      localStorage.getItem("savedArticles") || "{}",
    );
    setSavedArticles(savedArticlesData);
  }, []);

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    if (auth) {
      fetchPreferences();
    }
  }, [selectedFav]);

  useEffect(() => {
    fetchArticles();
  }, [setSelectedSport, setSelectedTeam]);

  ////////////////////////////////////////////////// fetching functions ///////////////////////////////////////////////////////

  const fetchArticles = () => {
    fetch(`${API_ENDPOINT}/articles`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }
        return response.json();
      })
      .then((data) => {
        setArticles(data);
      })
      .catch((error) => {
        console.error("Error fetching articles:", error);
      });
  };

  const fetchPreferences = () => {
    fetch(`${API_ENDPOINT}/user/preferences`, {
      headers: {
        Authorization: `Bearer ${auth}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUserPreferences(data.preferences);
        fetchPreferredArticles();
      })
      .catch((error) => {
        console.error("Error fetching user preferences:", error);
      });
  };

  const fetchPreferredArticles = () => {
    fetch(`${API_ENDPOINT}/articles`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }
        return response.json();
      })
      .then((data) => {
        setArticles(filterByPreference(data));
      })
      .catch((error) => {
        console.error("Error fetching articles:", error);
      });
  };

  /////////////////////////////////////////////////// Sport Selection /////////////////////////////////////////////////////

  const handleSportSelection = (
    sport: string | null,
    team: string | null = null,
  ) => {
    setSelectedSport(sport);
    setSelectedTeam(team);

    if (sport === null || team === null) {
      fetchArticles();
    }
  };

  ///////////////////////////////////////////////// Select Preference ////////////////////////////////////////////////////////////

  const handlePreference = () => {
    setSelectedSport(null);
    setSelectedTeam(null);
    setArticles([]);
    if (selectedFav == 0) {
      setSelectedFav(1);
    } else {
      setSelectedFav(0);
    }

    fetchPreferences();
  };

  const filterByPreference = (articles: Article[]) => {
    if (!userPreferences) return articles;

    const preferredSports = userPreferences.sports.map(
      (sport: any) => sport.name,
    );
    const preferredTeams = userPreferences.teams.map((team: any) => team.name);
    return articles.filter((article) => {
      const isPreferredSport = preferredSports.includes(article.sport.name);
      let isPreferredTeam = article.teams.some((team) =>
        preferredTeams.includes(team.name),
      );
      if (preferredTeams.length == 0) {
        if (selectedSport) {
          return (
            isPreferredSport &&
            (isPreferredTeam || selectedSport === article.sport.name)
          );
        } else {
          return isPreferredSport;
        }
      } else {
        return isPreferredTeam;
      }
    });
  };

  const openModal = (index: number) => {
    setOpenModalIndex(index);
  };

  const closeModal = () => {
    setOpenModalIndex(null);
  };

  const handleSaveArticle = (articleId: number) => {
    const savedArticles = JSON.parse(
      localStorage.getItem("savedArticles") || "{}",
    );
    savedArticles[articleId] = !savedArticles[articleId];
    localStorage.setItem("savedArticles", JSON.stringify(savedArticles));
    setSavedArticles(savedArticles);
  };

  const filteredArticles = showSavedArticles
    ? articles.filter((article) => savedArticles[article.id])
    : selectedTeam
      ? articles.filter(
          (article) =>
            article.sport.name === selectedSport &&
            article.teams.some((team) => team.name === selectedTeam),
        )
      : selectedSport
        ? articles.filter((article) => article.sport.name === selectedSport)
        : articles;

  const handleShowSavedArticles = () => {
    setShowSavedArticles(true);
    setShowAllSports(false);
  };

  return (
    <Suspense fallback={<div className="suspense-loading">Loading...</div>}>
      <>
        <div className="">
          <div className="px-2 py-2 flex  overflow-x-scroll no-scrollbar">
            {auth && (
              <button
                type="button"
                className="whitespace-nowrap text-gray-900 border border-gray-300 focus:outline-none  focus:ring-4 focus:ring-yellow-300 font-semibold rounded-lg md:text-base text-xs px-5 py-2.5 me-2 mb-2 bg-yellow-500 dark:bg-yellow-500 dark:text-white dark:border-yellow-600 dark:hover:bg-yellow-400 hover:bg-yellow-400 dark:hover:border-yellow-600 dark:focus:ring-yellow-700"
                onClick={() => {
                  handleSportSelection(null);
                  setShowSavedArticles(false);
                  handlePreference();
                }}
              >
                Made For you
              </button>
            )}
            <button
              type="button"
              className="whitespace-nowrap text-gray-100 bg-black border border-gray-900 focus:outline-none hover:bg-gray-900 focus:ring-4 focus:ring-gray-400 font-semibold rounded-lg md:text-base text-xs px-5 py-2.5 me-2 mb-2 dark:bg-gray-300 dark:text-black dark:border-gray-600 dark:hover:bg-gray-400 dark:hover:border-gray-600 dark:focus:ring-gray-600"
              onClick={() => {
                handleSportSelection(null);
                handleShowSavedArticles();
              }}
            >
              Saved
            </button>
            <button
              type="button"
              className="whitespace-nowrap text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-semibold rounded-lg md:text-base text-xs px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              onClick={() => {
                handleSportSelection(null);
                setShowSavedArticles(false);
              }}
            >
              All Sports
            </button>
            <button
              type="button"
              className="whitespace-nowrap text-gray-900 bg-white font-semibold border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 rounded-lg md:text-base text-xs px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              onClick={() => {
                setShowSavedArticles(false);
                handleSportSelection("Basketball");
              }}
            >
              Basketball
            </button>
            <button
              type="button"
              className="whitespace-nowrap text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-semibold rounded-lg md:text-base text-xs px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              onClick={() => {
                setShowSavedArticles(false);
                handleSportSelection("American Football");
              }}
            >
              American Football
            </button>
            <button
              type="button"
              className="whitespace-nowrap text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-semibold rounded-lg md:text-base text-xs px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              onClick={() => {
                setShowSavedArticles(false);
                handleSportSelection("Field Hockey");
              }}
            >
              Field Hockey
            </button>
            <button
              type="button"
              className="whitespace-nowrap text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-semibold rounded-lg md:text-base text-xs px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              onClick={() => {
                setShowSavedArticles(false);
                handleSportSelection("Table Tennis");
              }}
            >
              Table Tennis
            </button>
            <button
              type="button"
              className="whitespace-nowrap text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-semibold rounded-lg md:text-base text-xs px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              onClick={() => {
                setShowSavedArticles(false);
                handleSportSelection("Cricket");
              }}
            >
              Cricket
            </button>
            <button
              type="button"
              className="whitespace-nowrap text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-semibold rounded-lg md:text-base text-xs px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              onClick={() => {
                setShowSavedArticles(false);
                handleSportSelection("Rugby");
              }}
            >
              Rugby
            </button>
          </div>

          <div className="mx-2">
            {selectedSport && (
              <>
                <select
                  className="whitespace-nowrap text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-semibold rounded-lg md:text-base text-xs px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                  id="teamSelect"
                  value={selectedTeam || ""}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                >
                  <option value="">All Teams</option>
                  {articles
                    .filter((article) => article.sport.name === selectedSport)
                    .flatMap((article) => article.teams)
                    .filter(
                      (team, index, self) =>
                        self.findIndex((t) => t.id === team.id) === index,
                    )
                    .map((team) => (
                      <option
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        key={team.id}
                        value={team.name}
                      >
                        {team.name}
                      </option>
                    ))}
                </select>
              </>
            )}
          </div>

          <div className="no-scrollbar overflow-y-scroll">
            {articles.length === 0 ? (
              <p>Loading</p>
            ) : filteredArticles.length === 0 ? (
              <p></p>
            ) : (
              filteredArticles.map((article, index) => (
                <div
                  className="flex md:flex-row flex-col my-3 mx-2 md:min-h-60  md:max-h-auto bg-gray-100 dark:bg-gray-700 rounded"
                  key={article.id}
                >
                  <span className="min-h-60 max-h-80 md:basis-5/12 basis-4/12 rounded align-middle overflow-hidden">
                    <img
                      className="object-cover"
                      src={article.thumbnail}
                      alt={article.title}
                    />
                  </span>
                  <div className="md:basis-7/12 p-5 md:flex flex-col gap-1 md:w-1/2">
                    <div className="basis-3/12 md:flex items-center px-4 py-2 md:w-11/12">
                      <h2 className="md:text-3xl text-2xl font-bold">
                        {article.title}
                      </h2>
                    </div>
                    <div className="basis-6/12 md:flex items-center px-4 py-2">
                      <p className="md:text-xl text-lg truncate md:w-8/12">
                        {article.summary}
                      </p>
                    </div>
                    <div className="basis-1/12 md:flex items-center justify-between px-4 py-2">
                      <button
                        type="button"
                        onClick={() => openModal(index)}
                        className=" rounded-md bg-black/40 px-4 py-2 mt-2 text-sm font-semibold text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
                      >
                        Read More
                      </button>
                    </div>

                    <div className="basis-1/12 flex items-center justify-between px-4 py-2">
                      <p className="bg-black/10 w-fit p-1 m-1 rounded-xl ">
                        {article.sport.name}
                      </p>
                      <button onClick={() => handleSaveArticle(article.id)}>
                        {savedArticles[article.id] ? (
                          <svg
                            viewBox="-4 0 30 30"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            fill="#000000"
                            height={35}
                          >
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g
                              id="SVGRepo_tracerCarrier"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></g>
                            <g id="SVGRepo_iconCarrier">
                              <title>bookmark</title>
                              <desc>Created with Sketch Beta.</desc>
                              <defs></defs>
                              <g
                                id="Page-1"
                                stroke="none"
                                strokeWidth="1"
                                fill="none"
                                fillRule="evenodd"
                              >
                                <g
                                  id="Icon-Set-Filled"
                                  transform="translate(-419.000000, -153.000000)"
                                  fill="#000000"
                                >
                                  <path
                                    d="M437,153 L423,153 C420.791,153 419,154.791 419,157 L419,179 C419,181.209 420.791,183 423,183 L430,176 L437,183 C439.209,183 441,181.209 441,179 L441,157 C441,154.791 439.209,153 437,153"
                                    id="bookmark"
                                  ></path>
                                </g>
                              </g>
                            </g>
                          </svg>
                        ) : (
                          <svg
                            viewBox="-4 0 30 30"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            fill="#000000"
                            height={35}
                          >
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g
                              id="SVGRepo_tracerCarrier"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></g>
                            <g id="SVGRepo_iconCarrier">
                              <title>bookmark</title>
                              <desc>Created with Sketch Beta.</desc>
                              <defs></defs>
                              <g
                                id="Page-1"
                                stroke="none"
                                strokeWidth="1"
                                fill="none"
                                fillRule="evenodd"
                              >
                                <g
                                  id="Icon-Set"
                                  transform="translate(-417.000000, -151.000000)"
                                  fill="#000000"
                                >
                                  <path
                                    d="M437,177 C437,178.104 436.104,179 435,179 L428,172 L421,179 C419.896,179 419,178.104 419,177 L419,155 C419,153.896 419.896,153 421,153 L435,153 C436.104,153 437,153.896 437,155 L437,177 L437,177 Z M435,151 L421,151 C418.791,151 417,152.791 417,155 L417,177 C417,179.209 418.791,181 421,181 L428,174 L435,181 C437.209,181 439,179.209 439,177 L439,155 C439,152.791 437.209,151 435,151 L435,151 Z"
                                    id="bookmark"
                                  ></path>
                                </g>
                              </g>
                            </g>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <Transition
                    appear
                    show={openModalIndex === index}
                    as={Fragment}
                  >
                    <Dialog
                      as="div"
                      className="relative z-10"
                      onClose={closeModal}
                    >
                      <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <div className="fixed inset-0 bg-black/25" />
                      </Transition.Child>

                      <div className="fixed inset-0 overflow-y-scroll">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                          <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                          >
                            <Dialog.Panel className="max-w-xl max-h-md transform overflow-hidden rounded-2xl bg-gray-300  p-6 text-left align-middle shadow-xl transition-all">
                              <h3 className="text-lg font-semibold leading-6 text-gray-900">
                                {article.title}
                              </h3>
                              <div className="mt-2">
                                <img
                                  src={article.thumbnail}
                                  alt={article.title}
                                  className="mb-4 rounded-lg"
                                />
                                <p className="text-sm text-gray-900">
                                  {article.summary}
                                </p>
                              </div>
                              <div className="mt-4">
                                <button
                                  type="button"
                                  className="inline-flex justify-center rounded-md border border-transparent bg-blue-300 px-4 py-2 text-sm font-semibold text-blue-900 hover:bg-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                  onClick={closeModal}
                                >
                                  Close
                                </button>
                              </div>
                            </Dialog.Panel>
                          </Transition.Child>
                        </div>
                      </div>
                    </Dialog>
                  </Transition>
                </div>
              ))
            )}
          </div>
        </div>
      </>
    </Suspense>
  );
};

export default ArticleComponent;
