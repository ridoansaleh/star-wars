import { useState, useEffect } from "react";
import ReactLoading from "react-loading";
import "./App.css";
import oopsIcon from "./embarrassed.svg";
import maleIcon from "./boy.svg";
import femaleIcon from "./woman.svg";
import request from "./request";
import { getData, saveData } from "./localstorage";
import { lowerCase, createArray } from "./utils";
import {
  PEOPLE_TOTAL_PAGE,
  PLANET_TOTAL_PAGE,
  STARSHIPS_TOTAL_PAGE,
  VEHICLES_TOTAL_PAGE,
  CACHE_TIME,
  BASE_API_URL,
} from "./constant";

function App() {
  const [isLoading, setLoading] = useState(false);
  const [potentialEnemyList, setPotentialEnemyList] = useState([]);
  const [starshipsList, setStarshipsList] = useState([]);
  const [vehiclesList, setVechiclesList] = useState([]);
  const [planetList, setPlanetList] = useState([]);
  const [foundPotentialEnemy, setFoundPotentialEnemy] = useState(null);
  const [searchPotentialEnemy, setSearchPotentialEnemy] = useState("");
  const [isSearchingNotFound, setSearchingNotFound] = useState(false);

  const runPromiseAll = (totalPage, path, setState) => {
    const allRequests = [];
    createArray(totalPage).forEach((numb) => {
      allRequests.push(request(`${BASE_API_URL}/${path}/?page=${numb}`));
    });
    Promise.allSettled(allRequests)
      .then((res) => {
        let data = [];
        res.forEach((d) => {
          data = [...data, ...d.value];
        });
        setState(data);
      })
      .catch(console.log);
  };

  useEffect(() => {
    const cacheData = getData("potentialEnemies");
    if (cacheData) {
      setPotentialEnemyList(cacheData);
    } else {
      setLoading(true);
      runPromiseAll(PEOPLE_TOTAL_PAGE, "people", setPotentialEnemyList);
    }
  }, []);

  useEffect(() => {
    const cacheData = getData("potentialEnemies");
    if (!cacheData && potentialEnemyList.length > 0) {
      runPromiseAll(PLANET_TOTAL_PAGE, "planets", setPlanetList);
      runPromiseAll(STARSHIPS_TOTAL_PAGE, "starships", setStarshipsList);
      runPromiseAll(VEHICLES_TOTAL_PAGE, "vehicles", setVechiclesList);
    }
  }, [potentialEnemyList]);

  useEffect(() => {
    const cacheData = getData("potentialEnemies");
    if (
      !cacheData &&
      potentialEnemyList.length > 0 &&
      planetList.length > 0 &&
      starshipsList.length > 0 &&
      vehiclesList.length > 0
    ) {
      const mapPotentialEnemyList = potentialEnemyList.map((data) => ({
        ...data,
        homeworld: planetList.find((d) => d.url === data.homeworld),
        starships: data.starships.map((d) =>
          starshipsList.find((s) => s.url === d)
        ),
        vehicles: data.vehicles.map((d) =>
          vehiclesList.find((v) => v.url === d)
        ),
      }));
      setPotentialEnemyList(mapPotentialEnemyList);
      saveData("potentialEnemies", mapPotentialEnemyList, CACHE_TIME);
      setLoading(false);
    }
  }, [potentialEnemyList, planetList, starshipsList, vehiclesList]);

  const handleNameChange = (e) => {
    if (isLoading) return;
    setSearchPotentialEnemy(e.target.value);
  };

  const handleSearchClick = () => {
    if (!searchPotentialEnemy) return;
    const foundEnemy = potentialEnemyList.find(
      (d) => lowerCase(searchPotentialEnemy) === lowerCase(d.name)
    );
    setFoundPotentialEnemy(foundEnemy);
    if (!foundEnemy) {
      setSearchingNotFound(true);
    } else {
      setSearchingNotFound(false);
      setSearchPotentialEnemy("");
    }
  };

  return (
    <div className="container">
      <div className="greetings">
        <h1>Welcome Back, Lord Vader!</h1>
        <p>You can find information about your potential enemies here.</p>
      </div>
      <div className="search-wrapper">
        <input
          type="text"
          className="search-input"
          autoComplete="off"
          placeholder="Search by name..."
          value={searchPotentialEnemy}
          onChange={handleNameChange}
        />
        <div
          className="search-icon"
          role="button"
          onClick={handleSearchClick}
        ></div>
      </div>
      {isLoading && (
        <div className="result-wrapper">
          <ReactLoading type="spokes" color="white" height={100} width={100} />
        </div>
      )}
      {isSearchingNotFound && (
        <div className="result-wrapper">
          <img src={oopsIcon} className="oops-icon" alt="Oops not found" />
          <h2>Oops, we didn't found it</h2>
          <p>Make sure he/she is still alive!</p>
        </div>
      )}
      {foundPotentialEnemy && (
        <div className="result-wrapper">
          <img
            className="dummy-photo"
            src={foundPotentialEnemy.gender === "male" ? maleIcon : femaleIcon}
            alt="Enemy Avatar"
          />
          <h2 className="person-name">{foundPotentialEnemy.name}</h2>
          <div>
            <span>Gender: </span>
            <span>{foundPotentialEnemy.gender}</span>
          </div>
          <div className="person-detail">
            <div className="detail-item">
              <span>Starship Name(s): </span>
              <>
                {foundPotentialEnemy.starships.length > 0 ? (
                  <ol>
                    {foundPotentialEnemy.starships.map((d) => (
                      <li>
                        <div>
                          <strong>model</strong>:{" "}
                          <span className="attr-value">{d.model}</span>
                        </div>
                        <div>
                          <strong>class</strong>:{" "}
                          <span className="attr-value">{d.starship_class}</span>
                        </div>
                        <div>
                          <strong>hyperdrive rating</strong>:{" "}
                          <span className="attr-value">
                            {d.hyperdrive_rating}
                          </span>
                        </div>
                        <div>
                          <strong>cost in credits</strong>:{" "}
                          <span className="attr-value">
                            {d.cost_in_credits}
                          </span>
                        </div>
                        <div>
                          <strong>manufacturer</strong>:{" "}
                          <span className="attr-value">{d.manufacturer}</span>
                        </div>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <span>-</span>
                )}
              </>
            </div>
            <div className="detail-item">
              <span>Vehicle Name(s): </span>
              <>
                {foundPotentialEnemy.vehicles.length > 0 ? (
                  <ol>
                    {foundPotentialEnemy.vehicles.map((d) => (
                      <li>
                        <div>
                          <strong>name</strong>:{" "}
                          <span className="attr-value">{d.name}</span>
                        </div>
                        <div>
                          <strong>model</strong>:{" "}
                          <span className="attr-value">{d.model}</span>
                        </div>
                        <div>
                          <strong>cost in credits</strong>:{" "}
                          <span className="attr-value">
                            {d.cost_in_credits}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <span>-</span>
                )}
              </>
            </div>
            <div className="detail-item">
              <span>Homeworld: </span>
              <div>
                {foundPotentialEnemy.homeworld ? (
                  <div className="homeworld">
                    <div>
                      <strong>name</strong>:{" "}
                      <span className="attr-value">
                        {foundPotentialEnemy.homeworld.name}
                      </span>
                    </div>
                    <div>
                      <strong>population</strong>:{" "}
                      <span className="attr-value">
                        {foundPotentialEnemy.homeworld.population}
                      </span>
                    </div>
                    <div>
                      <strong>climate</strong>:{" "}
                      <span className="attr-value">
                        {foundPotentialEnemy.homeworld.climate}
                      </span>
                    </div>
                  </div>
                ) : (
                  "-"
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
