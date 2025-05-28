import React, { useState, useEffect } from "react";
import "./AddGame.css";

const Notification = ({ message, type }) => {
  return (
    <div className={`notification ${type}`}>
      {message}
    </div>
  );
};

function AddGame({ onGameAdd }) {
  const [players, setPlayers] = useState([]);
  const [homePlayer, setHomePlayer] = useState("");
  const [awayPlayer, setAwayPlayer] = useState("");
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");
  const [notification, setNotification] = useState({ message: "", type: "" });

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  useEffect(() => {
    
    const fetchPlayers = async () => {
      try {
        // const response = await fetch(`${process.env.REACT_APP_API_URL}/api/players`)
        const response = await fetch('/api/players');
        const data = await response.json();
        setPlayers(data);
      } catch (error) {
        console.error("Virhe pelaajien hakemisessa:", error);
      }
    };

    fetchPlayers();
  }, []);

  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Varmista, että estät oletustoiminnon
    if (!homePlayer || !awayPlayer || homePlayer === awayPlayer) {
      setNotification({ message: "Valitse eri pelaajat kotijoukkueelle ja vierasjoukkueelle.", type: "error" });
      return;
    }
    if (homeScore === awayScore) {
      setNotification({ message: "Ei voi olla tasapeli", type: "error" });
      return;
    }

    const game = {
      homePlayer,
      awayPlayer,
      homeScore: Number(homeScore),
      awayScore: Number(awayScore),
    };

    // Lähetä tiedot backendille
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/games`, {
        // const response = await fetch('/api/games', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(game),
      });

      if (response.ok) {
        setNotification({ message: "Peli lisätty!", type: "success" });
        setHomePlayer("");
        setAwayPlayer("");
        setHomeScore("");
        setAwayScore("");
      } else {
        setNotification({ message: "Virhe tallennuksessa!", type: "error" });
      }
    } catch (error) {
      setNotification({ message: "Virhe pelin tallennuksessa!", type: "error" });
      console.log(error)
      console.log(game)
      console.log(players)
    }
  };

  const handleScoreClick = (score, setter) => {
    setter(score);
  };

  return (
    <div className="add-game">
      {notification.message && <Notification message={notification.message} type={notification.type} />}
      <h2 className="add-game-title">Lisää peli</h2>
      <form onSubmit={handleSubmit} className="add-game-form">
        <div className="team-selection">
          <div className="team home-team">
            <label className="home-team-select" htmlFor="home-team-select">Kotijoukkue:</label>
            <select
              id="home-team-select"
              className="team-select"
              value={homePlayer || ""}
              onChange={(e) => setHomePlayer(e.target.value)}
            >
              <option className="team-select-menu" value="" disabled>
                Valitse pelaaja
              </option>
              {players.map((player) => (
                <option
                className="team-select-menu"
                  key={player.id}
                  value={player.firstname}
                  disabled={awayPlayer === player.firstname}
                >
                  {player.firstname}
                </option>
              ))}
            </select>
            {homePlayer && <p className="selected-player">Valittu: {homePlayer}</p>}
            {!homePlayer && <p className="selected-player">Valittu: -</p>}
          </div>

          <div className="team away-team">
            <label className="away-team-select" htmlFor="away-team-select">Vierasjoukkue:</label>
            <select
              id="away-team-select"
              className="team-select"
              value={awayPlayer || ""}
              onChange={(e) => setAwayPlayer(e.target.value)}
            >
              <option value="" disabled>
                Valitse pelaaja
              </option>
              {players.map((player) => (
                <option
                  key={player.id}
                  value={player.firstname}
                  disabled={homePlayer === player.firstname}
                >
                  {player.firstname}
                </option>
              ))}
            </select>
            {awayPlayer && <p className="selected-player">Valittu: {awayPlayer}</p>}
            {!awayPlayer && <p className="selected-player">Valittu: -</p>}
          </div>
        </div>

        <div className="score-section">
          <div className="score-box">
            <label className="scorebox-header">
              {homePlayer ? `${homePlayer}n` : "Kotijoukkue"} pisteet:
            </label>
            <div className="score-input">
              <div className="score-display">{homeScore || 0}</div>
              <div className="score-buttons">
              {numbers.map((number, index) => (
                <button
                  type="button"
                  key={index}
                  onClick={() => handleScoreClick(number, setHomeScore)}
                  className={number === 0 ? "zero-button" : ""}
                >
                  {number}
                </button>
              ))}
            </div>
            </div>
          </div>

          <span className="score-viiva">-</span>

          <div className="score-box">
            <label className="scorebox-header">
              {awayPlayer ? `${awayPlayer}n` : "Vierasjoukkue"} pisteet:
            </label>
            <div className="score-input">
              <div className="score-display">{awayScore || 0}</div>
              <div className="score-buttons">
              {numbers.map((number, index) => (
                <button
                  type="button"
                  key={index}
                  onClick={() => handleScoreClick(number, setAwayScore)}
                  className={number === 0 ? "zero-button" : ""}
                >
                  {number}
                </button>
              ))}
            </div>
            </div>
          </div>
        </div>

        <button type="submit" className="add-game-submit">
          Lisää peli
        </button>
      </form>
    </div>
  );
}

export default AddGame;
