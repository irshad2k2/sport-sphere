import React, { useState, useEffect, Fragment } from "react";
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

  useEffect(() => {
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

    if (selectedSport === null) {
      fetchArticles();
    }
  }, []);

  {auth && (
    useEffect(() => {
      const fetchPreferences = () => {
        fetch(`${API_ENDPOINT}/user/preferences`, {
          headers: {
            Authorization: `Bearer ${auth}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setUserPreferences(data.preferences);
          })
          .catch((error) => {
            console.error("Error fetching user preferences:", error);
          });
      };
        fetchPreferences()
    },[auth])
  )}


  const openModal = (index: number) => {
    setOpenModalIndex(index);
  };

  const closeModal = () => {
    setOpenModalIndex(null);
  };

  const handleSportSelection = (
    sport: string | null,
    team: string | null = null
  ) => {
    setSelectedSport(sport);
    setSelectedTeam(team);

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

    if (sport === null || team === null) {
      fetchArticles();
    }
  };

  const filterArticles = (articles: Article[]) => {
    if (!userPreferences) return articles;

    const preferredSports = userPreferences.sports.map(
      (sport: any) => sport.name
    );
    const preferredTeams = userPreferences.teams.map((team: any) => team.name);
    return articles.filter((article) => {
      const isPreferredSport = preferredSports.includes(article.sport.name);
      let isPreferredTeam = article.teams.some((team) =>
        preferredTeams.includes(team.name)
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

  const handlePreference = () => {
    setSelectedSport(null);
    setSelectedTeam(null);
    const fetchPreferences = () => {
      fetch(`${API_ENDPOINT}/user/preferences`, {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUserPreferences(data.preferences);
        })
        .catch((error) => {
          console.error("Error fetching user preferences:", error);
        });
    };
    fetchPreferences();

    const preferredArticles = filterArticles(articles);
    setArticles(preferredArticles);
  };

  const filteredArticles = articles.filter((article) => {
    const sportMatches = !selectedSport || article.sport.name === selectedSport;

    const teamMatches =
      !selectedTeam || article.teams.some((team) => team.name === selectedTeam);

    return sportMatches && teamMatches;
  });

  return (
    <>
      <div>
        <h1>Sports News</h1>
        <div>
          {auth && (
            <button
              type="button"
              className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              onClick={() => handlePreference()}
            >
              Favourites
            </button>
          )}
          <button
            type="button"
            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            onClick={() => handleSportSelection(null)}
          >
            All Sports
          </button>
          <button
            type="button"
            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            onClick={() => handleSportSelection("Basketball")}
          >
            Basketball
          </button>
          <button
            type="button"
            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            onClick={() => handleSportSelection("American Football")}
          >
            American Football
          </button>
          <button
            type="button"
            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            onClick={() => handleSportSelection("Rugby")}
          >
            Rugby
          </button>
          <button
            type="button"
            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            onClick={() => handleSportSelection("Field Hockey")}
          >
            Field Hockey
          </button>
          <button
            type="button"
            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            onClick={() => handleSportSelection("Table Tennis")}
          >
            Table Tennis
          </button>
          <button
            type="button"
            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            onClick={() => handleSportSelection("Cricket")}
          >
            Cricket
          </button>
        </div>

        <div>
          {selectedSport && (
            <>
              <select
                className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
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
                      self.findIndex((t) => t.id === team.id) === index
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

        <div>
          {filteredArticles.map((article, index) => (
            <div className="m-4 flex" key={article.id}>
              <span className="basis-1/6">
                <img src={article.thumbnail} alt={article.title} />
              </span>
              <span className="basis-5/6 p-5 justify-end">
                <h2 className="text-2xl">{article.title}</h2>
                <p>{article.summary}</p>
                <button
                  type="button"
                  onClick={() => openModal(index)}
                  className="rounded-md bg-black/40 px-4 py-2 mt-2 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
                >
                  Read More
                </button>
                <p className="bg-black/10 w-fit p-1 m-1 rounded-xl ">
                  {article.sport.name}
                </p>
              </span>
              <hr />
              <Transition appear show={openModalIndex === index} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
                        <Dialog.Panel className="max-w-xl max-h-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                          <h3 className="text-lg font-medium leading-6 text-gray-900">
                            {article.title}
                          </h3>
                          <div className="mt-2">
                            <img
                              src={article.thumbnail}
                              alt={article.title}
                              className="mb-4 rounded-lg"
                            />
                            <p className="text-sm text-gray-500">
                              {article.summary}
                            </p>
                          </div>
                          <div className="mt-4">
                            <button
                              type="button"
                              className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                              onClick={closeModal}
                            >
                              Got it, thanks!
                            </button>
                          </div>
                        </Dialog.Panel>
                      </Transition.Child>
                    </div>
                  </div>
                </Dialog>
              </Transition>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ArticleComponent;
