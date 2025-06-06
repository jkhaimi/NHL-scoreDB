import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import AddGame from "./components/AddGame";
import GameTable from "./components/GameTable";
import PlayerProfile from "./components/PlayerProfile";
import AddPlayer from "./components/AddPlayer";
import EditPlayer from "./components/EditPlayer";
import StanleyCup from "./Images/Stanley_Cup.png";
import Footer from "./components/Footer";

function App() {
  const [players, setPlayers] = useState([]);
  const [games, setGames] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const fetchData = async () => {
    try {
      // const playersResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/players`);
      // const gamesResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/games`);
      const playersResponse = await fetch('/api/players');
      const gamesResponse = await fetch('/api/games');
      const gamesData = await gamesResponse.json();
      const playersData = await playersResponse.json();

      setGames(gamesData);
      setPlayers(playersData);
    } catch (error) {
      console.error("Virhe tietojen hakemisessa:", error);
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Home players={players} games={games} fetchData={fetchData} setMenuOpen={setMenuOpen} menuOpen={menuOpen} />}
        />
        <Route path="/addplayer" element={<AddPlayer />} />
        <Route path="/editplayer" element={<EditPlayer />} />
        <Route path="/player/:playerName" element={<PlayerProfile />} />
      </Routes>
    </Router>
  );
}

const Home = ({ players, games, fetchData, setMenuOpen, menuOpen }) => {
  // const location = useLocation(); // React Routerin sijainti

  // // Hakee tiedot uudelleen aina, kun sijainti (reitti) muuttuu
  // useEffect(() => {
  //   fetchData();
  // }, [location]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div>
      <p className="desktop-view">Tämä on mobiilisovellus, käytä puhelinta</p>
      <div className="app">
        <div className="player-top">
          <img src={StanleyCup} className="trophy" alt="Stanley Cup" />
          <p className="league-title">NHL-cup</p>
          <p className="league-year">2025</p>
          <div
            className={`hamburger-icon ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
          {menuOpen && (
            <div className="fullscreen-menu">
              <div className="fullscreen-top">
                <img src={StanleyCup} className="trophy" alt="Stanley Cup" />
                <p className="league-title">NHL-cup</p>
                <p className="league-year">2025</p>
              </div>
              <ul>
                <li>
                  <Link to="/" onClick={() => setMenuOpen(false)}>
                    Etusivu
                  </Link>
                </li>
                <li>
                  <Link to="/addplayer" onClick={() => setMenuOpen(false)}>
                    Lisää pelaaja
                  </Link>
                </li>
                <li>
                  <Link to="/editplayer" onClick={() => setMenuOpen(false)}>
                    Muokkaa pelaajaa
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="app">
        <AddGame />
        <GameTable players={players} games={games} />
      </div>
      <div className="app">
        <Footer />
      </div>
    </div>
  );
};

export default App;
