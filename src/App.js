import React, { useState } from "react";
import AddGame from "./components/AddGame";
import GameTable from "./components/GameTable";

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
    <div>
      <h1 className="nhl-header">Änäri Matsien Tulokset</h1>
      <AddGame onGameAdd={handleGameAdd} />
      {/* <button onClick={handleReset} style={{ margin: "10px 0", padding: "10px" }}>
        Nollaa tilastot
      </button> */}
      <GameTable games={games} />
    </div>
  );
}

export default App;
