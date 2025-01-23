import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./PlayerProfile.css";
import JuusoImage from "../Images/Juuso.png";
import JesseImage from "../Images/Jesse.png";
import RoniImage from "../Images/Roni.png";
import { LuArrowLeft } from "react-icons/lu";

function PlayerProfile() {
  const { playerName } = useParams();
  const [games, setGames] = useState([]);

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
    Jesse: { name: "Jesse Haimi", age: 23, height: "6 foot", weight: "86 kg", city: "Vantaa", image: JesseImage },
    Juuso: { name: "Juuso Vuorela", age: 29, height: "175 cm", weight: "93 kg", city: "Jyväskylä", image: JuusoImage },
    Roni: { name: "Roni Koskinen", age: 24, height: "153 cm", weight: "41 kg", city: "Tuulos", image: RoniImage },
  };

  const player = players[playerName];

  if (!player) {
    return <div>Pelaajaa ei löytynyt.</div>;
  }

  const playerGames = games.filter(
    (game) =>
      game.homePlayer === playerName || game.awayPlayer === playerName
  );

  return (
    <div className="player-profile">
      <Link to="/" className="back-button">
        <LuArrowLeft />
      </Link>
      <h1>{player.name}</h1>
      <img src={player.image} alt={`${playerName}`} className="profile-image" />
      <div className="player-info">
        <p><strong>Ikä:</strong> {player.age}</p>
        <p><strong>Pituus:</strong> {player.height}</p>
        <p><strong>Paino:</strong> {player.weight}</p>
        <p><strong>Kaupunki:</strong> {player.city}</p>
      </div>

      <h2>Pelatut pelit</h2>
      {playerGames.length > 0 ? (
        <table className="player-games">
          <tbody>
            {playerGames.map((game) => {
              const isWinner =
                (game.homePlayer === playerName && game.homeScore > game.awayScore) ||
                (game.awayPlayer === playerName && game.awayScore > game.homeScore);

              const opponent =
                game.homePlayer === playerName ? game.awayPlayer : game.homePlayer;

              return (
                <tr key={game.id} className="game-row">
                  <td>
                    <div className="game-players">
                      <span>{playerName}</span>
                      <span>{opponent}</span>
                    </div>
                  </td>
                  <td>
                    <div className="game-result">
                        <span>{game.homeScore}</span>
                        <span>{game.awayScore}</span>
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
      ) : (
        <p>Pelaajalla ei ole vielä pelattuja pelejä.</p>
      )}
    </div>
  );
}

export default PlayerProfile;
