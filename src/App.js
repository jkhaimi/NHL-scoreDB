import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AddGame from "./components/AddGame";
import GameTable from "./components/GameTable";
import PlayerProfile from "./components/PlayerProfile";

function App() {
  const [games, setGames] = useState([]);

  const handleGameAdd = (game) => {
    setGames((prevGames) => [...prevGames, game]);
  };

  const handleReset = () => {
    if (window.confirm("Haluatko varmasti nollata tilastot?")) {
      setGames([]);
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <h1 className="nhl-header">Änäri Matsien Tulokset</h1>
              <AddGame onGameAdd={handleGameAdd} />
              <GameTable games={games} />
              {/* <button onClick={handleReset}>Nollaa tilastot</button> */}
            </div>
          }
        />
        <Route path="/player/:playerName" element={<PlayerProfile />} />
      </Routes>
    </Router>
  );
  }

export default App;

