import React, { useState } from "react";
import "./AddGame.css";

function AddGame({ onGameAdd }) {
  const players = ["Jesse", "Juuso", "Roni", "Miro"];

  const [homePlayer, setHomePlayer] = useState("");
  const [awayPlayer, setAwayPlayer] = useState("");
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");

  const handleSubmit = async (e) => {
    if (!homePlayer || !awayPlayer || homePlayer === awayPlayer) {
      alert("Valitse eri pelaajat kotijoukkueelle ja vierasjoukkueelle.");
      return;
    }
  
    const game = {
      homePlayer,
      awayPlayer,
      homeScore: Number(homeScore),
      awayScore: Number(awayScore),
    };
  
    // Lähetä tiedot backendille
    const response = await fetch("http://localhost:3001/api/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(game),
    });
  
    if (response.ok) {
      alert("Peli lisätty!");
      setHomePlayer("");
      setAwayPlayer("");
      setHomeScore("");
      setAwayScore("");
    } else {
      alert("Virhe tallennuksessa!");
    }
  };
  

  const handleScoreClick = (score, setter) => {
    setter(score);
  };

  return (
    <div className="add-game">
      <h2 className="add-game-title">Lisää peli</h2>
      <form onSubmit={handleSubmit} className="add-game-form">

      <div className="team-selection">
        <div className="team home-team">
          <label htmlFor="home-team-select">Kotijoukkue:</label>
          <select
            id="home-team-select"
            className="team-select"
            value={homePlayer || ""}
            onChange={(e) => setHomePlayer(e.target.value)}
          >
            <option value="" disabled>
              Valitse pelaaja
            </option>
            {players.map((player) => (
              <option key={player} value={player} disabled={awayPlayer === player}>
                {player}
              </option>
            ))}
          </select>
          {homePlayer && <p className="selected-player">Valittu: {homePlayer}</p>}
          {!homePlayer && <p className="selected-player">Valittu: -</p>}
        </div>

          <div className="team away-team">
            <label htmlFor="away-team-select">Vierasjoukkue:</label>
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
                <option key={player} value={player} disabled={homePlayer === player}>
                  {player}
                </option>
              ))}
            </select>
            {awayPlayer && <p className="selected-player">Valittu: {awayPlayer}</p>}
            {!awayPlayer && <p className="selected-player">Valittu: -</p>}
          </div>
        </div>

        <div className="score-section">
          <div className="score-box">
            <label className="scorebox-header">{homePlayer ? homePlayer + "n" : "Kotijoukkue"} pisteet:</label>
            <div className="score-input">
              <div className="score-display">{homeScore || 0}</div>
              <div className="score-buttons">
                {Array.from({ length: 10 }, (_, i) => (i + 1) % 10).map((number, index) => (
                  <button
                    type="button"
                    key={number}
                    onClick={() => handleScoreClick(number, setHomeScore)}
                  >
                    {number}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <span style={{ fontSize: "128px" }}>-</span>

          <div className="score-box">
            <label className="scorebox-header">{awayPlayer ? awayPlayer + "n" : "Vierasjoukkue"} pisteet:</label>
            <div className="score-input">
              <div className="score-display">{awayScore || 0}</div>
              <div className="score-buttons">
                {Array.from({ length: 10 }, (_, i) => (i + 1) % 10).map((number, index) => (
                  <button
                    type="button"
                    key={number}
                    onClick={() => handleScoreClick(number, setAwayScore)}
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
