import { Popover, Transition } from "@headlessui/react";
import { Fragment, useContext, useEffect, useState } from "react";
import { API_ENDPOINT } from "../../config/constants";
import { ThemeContext } from "../../context/theme";

interface Preference {
  name: string;
  selected: boolean;
}
interface Team {
  id: number;
  name: string;
  plays: string;
}

const AppBar = () => {
  const auth = localStorage.getItem("authToken");
  const { theme, setTheme } = useContext(ThemeContext);
  const [enabled, setEnabled] = useState(false);

  const [sports, setSports] = useState<Preference[]>([
    { name: "Basketball", selected: false },
    { name: "American Football", selected: false },
    { name: "Rugby", selected: false },
    { name: "Field Hockey", selected: false },
    { name: "Table Tennis", selected: false },
    { name: "Cricket", selected: false },
  ]);

  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);

  const toggleTheme = () => {
    let newTheme = "";
    if (theme === "light") {
      newTheme = "dark";
    } else {
      newTheme = "light";
    }
    setEnabled(!enabled);
    setTheme(newTheme);
  };

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const response = await fetch(`${API_ENDPOINT}/teams`);
        if (!response.ok) {
          throw new Error("Failed to fetch teams data");
        }
        const data = await response.json();
        setTeams(data);
      } catch (error) {
        console.error("Error fetching teams data:", error);
      }
    };

    const fetchUserPreferences = async () => {
      try {
        const response = await fetch(`${API_ENDPOINT}/user/preferences`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user preferences");
        }

        const data = await response.json();
        const { teams: selectedTeamsData, sports: selectedSportsData } =
          data.preferences;

        const selectedTeamNames = selectedTeamsData.map(
          (team: { name: string }) => team.name
        );
        setSelectedTeams(selectedTeamNames);

        setSports((prevSports) =>
          prevSports.map((sport) => ({
            ...sport,
            selected: selectedSportsData.some(
              (selectedSport: { name: string }) =>
                selectedSport.name === sport.name
            ),
          }))
        );
      } catch (error) {
        console.error("Error fetching user preferences:", error);
      }
    };

    fetchTeamData();
    {auth && (
      fetchUserPreferences()
    )}
  }, []);

  useEffect(() => {
    setTeams((prevTeams) =>
      prevTeams.map((team) => ({
        ...team,
        selected: selectedTeams.includes(team.name),
      }))
    );
  }, [selectedTeams]);

  const filteredTeams = teams.filter((team) =>
    sports.some((sport) => sport.selected && sport.name === team.plays)
  );

  const handleTeamChange = (team: Team | string) => {
    const teamName = typeof team === "string" ? team : team.name;
    setSelectedTeams((prevSelectedTeams) => {
      const isSelected = prevSelectedTeams.includes(teamName);
      if (isSelected) {
        const updatedTeams = prevSelectedTeams.filter(
          (prevTeamName) => prevTeamName !== teamName
        );
        return updatedTeams;
      } else {
        const updatedTeams = [...prevSelectedTeams, teamName];
        return updatedTeams;
      }
    });
  };

  const handleSportChange = (name: string) => {
    const updatedSports = sports.map((sport) =>
      sport.name === name ? { ...sport, selected: !sport.selected } : sport
    );
    setSports(updatedSports);
  };

  const renderCheckboxes = (
    items: (Preference | Team)[],
    onChange: (name: string) => void
  ) => {
    return items.map((item, index) => (
      <div key={item.name || index}>
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={
              "selected" in item
                ? item.selected
                : selectedTeams.includes((item as Team).name)
            }
            onChange={() =>
              onChange("name" in item ? item.name : (item as Team).name)
            }
            className="peer"
          />
          <span className="my-2 text-sm font-medium text-gray-900">
            {"name" in item ? item.name : (item as Team).name}
          </span>
        </label>
        <br />
      </div>
    ));
  };

  const updatePreferences = async () => {
    try {
      const selectedSportsArray = sports
        .filter((sport) => sport.selected)
        .map((sport) => ({ name: sport.name }));
      const selectedTeamsArray = teams
        .filter((team) => selectedTeams.includes(team.name))
        .map((team) => ({ name: team.name }));

      const response = await fetch(`${API_ENDPOINT}/user/preferences`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          preferences: {
            sports: selectedSportsArray,
            teams: selectedTeamsArray,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send data to API");
      }

      console.log("Data sent to API successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error sending data to API:", error);
    }
  };

  const handleSendDataClick = () => {
    updatePreferences();
  };

  return (
    <>
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <img
              src="/android-chrome-192x192.png"
              className="h-8"
              alt="Sport_sphere"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Sport Sphere
            </span>
          </div>
          <button
            data-collapse-toggle="navbar-default"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-default"
            aria-expanded="false"
          ></button>
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <a
                  href="dashboard"
                  className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500"
                  aria-current="page"
                >
                  Dashboard
                </a>
              </li>
              {!auth && (
                <li>
                  <a
                    href="signin"
                    className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  >
                    Sign In
                  </a>
                </li>
              )}
              {!auth && (
                <li>
                  <a
                    href="signup"
                    className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  >
                    Sign Up
                  </a>
                </li>
              )}
              {auth && (
                <li>
                  <div>
                    <Popover>
                      {() => (
                        <>
                          <Popover.Button className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                            Preferences
                          </Popover.Button>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0 translate-y-1"
                            enterTo="opacity-100 translate-y-0"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 translate-y-1"
                          >
                            <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-screen max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-3xl">
                              <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
                                <div className="relative grid gap-8 bg-white p-7 lg:grid-cols-2">
                                  <div className="bg-gray-50 p-4">
                                    <h1>Select Sports</h1>

                                    <div className="bg-gray-50 p-4">
                                      {renderCheckboxes(
                                        sports,
                                        handleSportChange
                                      )}
                                    </div>
                                  </div>
                                  <div className="bg-gray-50 p-4">
                                    <h1>Select Teams</h1>

                                    <div className="bg-gray-50 p-4">
                                      {renderCheckboxes(
                                        filteredTeams,
                                        handleTeamChange
                                      )}
                                    </div>
                                  </div>
                                  <button onClick={handleSendDataClick}>
                                    Save Preferences
                                  </button>
                                </div>
                              </div>
                            </Popover.Panel>
                          </Transition>
                        </>
                      )}
                    </Popover>
                  </div>
                </li>
              )}

              {auth && (
                <li>
                  <a
                    href="/logout"
                    className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  >
                    Logout
                  </a>
                </li>
              )}

              <li>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={!enabled}
                    onChange={toggleTheme}
                  ></input>
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default AppBar;
