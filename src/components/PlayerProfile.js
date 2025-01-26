import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./PlayerProfile.css";
import JuusoImage from "../Images/Juuso.png";
import JesseImage from "../Images/Jesse.png";
import RoniImage from "../Images/Roni.png";
import { LuArrowLeft } from "react-icons/lu";

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';

import {Doughnut} from 'react-chartjs-2';


ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
)

function PlayerProfile() {
  const { playerName } = useParams();
  const [games, setGames] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [activeTab, setActiveTab] = useState("Tiedot");
 
  
  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchGames = async () => {
      const response = await fetch("http://localhost:3001/api/games");
      const data = await response.json();
      setGames(data);
    };

    fetchGames();
  }, []);

  const players = {
    Jesse: { color: "rgba(230, 0, 0)", team: "PPS United", firstname: "Jesse", lastname: "Haimi", age: 23, height: "6 foot", weight: "86 kg", city: "Vantaa", image: JesseImage },
    Juuso: { color:"rgba(0, 230, 0)", team: "Jääpallo FC", firstname: "Juuso", lastname: "Vuorela", age: 29, height: "175 cm", weight: "93 kg", city: "Jyväskylä", image: JuusoImage },
    Roni: { color:"rgba(255, 0, 230)", team: "Ei harrastuksia:D", firstname: "Roni", lastname: "Koskinen", age: 24, height: "153 cm", weight: "41 kg", city: "Tuulos", image: RoniImage },
  };

  const player = players[playerName];

  if (!player) {
    return <div>Pelaajaa ei löytynyt.</div>;
  }

  const playerGames = games.filter(
    (game) =>
      game.homePlayer === playerName || game.awayPlayer === playerName
  );

  const Tiedot = () => (
    <div>
      <div className="player-info">
        <div className="info-item">
          <p>Ikä</p>
          <p><strong>{player.age}</strong></p>
        </div>
        <div className="info-item">
          <p>Pituus</p>
          <p><strong>{player.height}</strong></p>
        </div>
        <div className="info-item">
          <p>Paino</p>
          <p><strong>{player.weight}</strong></p>
        </div>
        <div className="info-item">
          <p>Kaupunki</p>
          <p><strong>{player.city}</strong></p>
        </div>
      </div>

      <p className="games-played">Pelatut pelit</p>
      {playerGames.length > 0 ? (
        <div>
          <table className="player-games">
            <tbody>
              {(showAll ? playerGames.toReversed() : playerGames.slice(-5).toReversed()).map((game) => {
                const isWinner =
                  (game.homePlayer === playerName && game.homeScore > game.awayScore) ||
                  (game.awayPlayer === playerName && game.awayScore > game.homeScore);

                return (
                  <tr key={game.id} className="game-row">
                    <td>
                      <div className="game-players">
                        <span>{game.homePlayer}</span>
                        <span>{game.awayPlayer}</span>
                      </div>
                    </td>
                    <td>
                      <div className="game-result">
                        <span><strong>{game.homeScore}</strong></span>
                        <span><strong>{game.awayScore}</strong></span>
                      </div>
                    </td>
                    <td>
                      <div
                        className={`result-line ${isWinner ? "win-line" : "loss-line"}`}
                      ></div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {playerGames.length > 5 && !showAll && (
            <button className="show-all-button" onClick={() => setShowAll(true)}>
              Kaikki pelit
            </button>
          )}
          {playerGames.length > 5 && showAll && (
            <button className="hide-all-button" onClick={() => setShowAll(false)}>
              Piilota pelit
            </button>
          )}
        </div>
      ) : (
        <p>Pelaajalla ei ole vielä pelattuja pelejä.</p>
      )}
    </div>
  );

  const Tilastot = () => {
    
    const totalGames = playerGames.length;

    const wins = playerGames.filter((game) => {
      return (
        (game.homePlayer === playerName && game.homeScore > game.awayScore) ||
        (game.awayPlayer === playerName && game.awayScore > game.homeScore)
      );
    }).length;

    const losses = playerGames.filter((game) => {
        return (
          (game.homePlayer === playerName && game.homeScore < game.awayScore) ||
          (game.awayPlayer === playerName && game.awayScore < game.homeScore)
        );
      }).length;

    const winPercentage = totalGames > 0 ? ((wins / totalGames) * 100).toFixed(1) : 0;

    const homeGames = playerGames.filter((game) => {
        return (
            (game.homePlayer === playerName)
        )
    }).length;

    const homeWins = playerGames.filter((game) => {
        return (
          (game.homePlayer === playerName && game.homeScore > game.awayScore)
        );
      }).length;

    const homeWinPrecentage = totalGames > 0 ? ((homeWins / homeGames) * 100).toFixed(1) : 0;


    const awayGames = playerGames.filter((game) => {
        return (
            (game.awayPlayer === playerName)
        )
    }).length;

    const awayWins = playerGames.filter((game) => {
        return (
            (game.awayPlayer === playerName && game.awayScore > game.homeScore)
        )
    }).length;

    const awayWinPrecentage = totalGames > 0 ? ((awayWins / awayGames) * 100).toFixed(1) : 0;

    const calculateWinningStreak = () => {
        let maxStreak = 0;
        let currentStreak = 0;
    
        playerGames.forEach((game) => {
          const isWin =
            (game.homePlayer === playerName && game.homeScore > game.awayScore) ||
            (game.awayPlayer === playerName && game.awayScore > game.homeScore);
    
          if (isWin) {
            currentStreak++;
            maxStreak = Math.max(maxStreak, currentStreak);
          } else {
            currentStreak = 0;
          }
        });
    
        return maxStreak;
      };

      const longestWinStreak = calculateWinningStreak();
    //   const winStreakPercentage = totalGames > 0 ? ((longestWinStreak / totalGames) * 100).toFixed(1) : 0;

      const winstreak = {
        labels: ["Voittoputki"],
        datasets: [{
            label: "Poll",
            data: [longestWinStreak, (10 - longestWinStreak)],
            backgroundColor: ["orange", "transparent"]
        }]
      }

    const voittoprosentti = {
        labels: ["Voitto %"],
        datasets: [{
            label: "Poll",
            data: [winPercentage, (100 - winPercentage)], // Käytä voittoprosenttia ja loput häviöille
            backgroundColor: ["green", "transparent"]
        }],
      }


    const kotivoittoprosentti = {
        labels: ["Kotivoitto %"],
        datasets: [{
            label: "Poll",
            data: [homeWinPrecentage, (100 - homeWinPrecentage)],
            backgroundColor: ["purple", "transparent"]
        }]
    }

    const vierasvoittoprosentti = {
        labels: ["Vierasvoitto %"],
        datasets: [{
            label: "Poll",
            data: [awayWinPrecentage, (100 - awayWinPrecentage)],
            backgroundColor: ["lightblue", "transparent"]
        }]
    }

    const options = {
    }

    return (
      <div className="player-stats">
        <p className="games-played">Pelatut pelit: <strong>{totalGames}</strong></p>
        <div className="player-games-stats">
            <span>Voitot: <strong>{wins}</strong></span>
            <span>Häviöt: <strong>{losses}</strong></span>
            <span>Kotipelit: <strong>{homeGames}</strong></span>
            <span>Vieraspelit: <strong>{awayGames}</strong></span>
        </div>
        <span className="doughnut-1">{winPercentage}%</span>
        <span className="doughnut-2">{longestWinStreak}</span>
        <span className="doughnut-3">{homeWinPrecentage}%</span>
        <span className="doughnut-4">{awayWinPrecentage}%</span>
        <div className="doughnuts">
            <div className="doughnut">
            <Doughnut
            data={voittoprosentti}
            options={options}
            />
        </div>
        <div className="doughnut">
            <Doughnut
            data={winstreak}
            options={options}
            />
        </div>
        <div className="doughnut">
            <Doughnut
            data={kotivoittoprosentti}
            options={options}
            />
        </div>
        <div className="doughnut">
            <Doughnut
            data={vierasvoittoprosentti}
            options={options}
            />
        </div>
        </div>
      </div>
    );
  };

  return (
    <div className="player-profile">
      <Link to="/" className="back-button">
        <LuArrowLeft />
      </Link>
      <div className="player-top">
        <div className="player-name">
          <p>{player.firstname}</p>
          <p><strong>{player.lastname}</strong></p>
        </div>
        <div className="variviiva" style={{ backgroundColor: player.color }}>
          <span className="player-team">{player.team}</span>
        </div>
        <img src={player.image} alt={`${playerName}`} className="profile-image" />
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === "Tiedot" ? "active" : ""}`}
          onClick={() => setActiveTab("Tiedot")}
        >
          Tiedot
        </button>
        <button
          className={`tab ${activeTab === "Tilastot" ? "active" : ""}`}
          onClick={() => setActiveTab("Tilastot")}
        >
          Tilastot
        </button>
      </div>
      <div className="tab-content">
        {activeTab === "Tiedot" && <Tiedot />}
        {activeTab === "Tilastot" && <Tilastot />}
      </div>
    </div>
  );
}

export default PlayerProfile;