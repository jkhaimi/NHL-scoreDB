import React, { useState, useEffect } from "react";
import "./EditPlayer.css";
import { Link } from "react-router-dom";
import { LuArrowLeft } from "react-icons/lu";
import StanleyCup from "../Images/Stanley_Cup.png";
import { useNavigate } from "react-router-dom";



const EditPlayer = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [updatedData, setUpdatedData] = useState({});

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        // const response = await fetch(`${process.env.REACT_APP_API_URL}/api/players`);
        const response = await fetch('/api/players');
        const data = await response.json();
        setPlayers(data);
      } catch (error) {
        console.error("Virhe pelaajien hakemisessa:", error);
      }
    };

    fetchPlayers();
  }, []);

  const handleSelectPlayer = (player) => {
    setSelectedPlayer(player);
    setUpdatedData(player);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPlayer) {
      alert("Valitse ensin pelaaja!");
      return;
    }

    try {
      // const response = await fetch(`${process.env.REACT_APP_API_URL}/api/players/${selectedPlayer.id}`, {
        const response = await fetch(`/api/players/${selectedPlayer.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        alert("Pelaajan tiedot päivitetty onnistuneesti!");
        setSelectedPlayer(null);
        navigate("/");
      } else {
        alert("Virhe pelaajan tietojen päivittämisessä!");
        console.log(updatedData)
      }
    } catch (error) {
      console.error("Virhe PUT-pyynnössä:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedPlayer) {
      alert("Valitse ensin pelaaja!");
      return;
    }

    // Varmistetaan poisto käyttäjältä
    const isConfirmed = window.confirm(
      `Haluatko varmasti poistaa pelaajan ${selectedPlayer.firstname} ${selectedPlayer.lastname}?`
    );

    if (!isConfirmed) {
      return;
    }

    try {
      const response = await fetch(
        // `http://localhost:3001/api/players/${selectedPlayer.id}`,
        `/api/players/${selectedPlayer.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        alert("Pelaaja poistettu onnistuneesti!");
        navigate("/");
      } else {
        alert("Virhe pelaajan poistamisessa!");
      }
    } catch (error) {
      console.error("Virhe DELETE-pyynnössä:", error);
    }
  };

  return (
    <div className="edit-player">
      <Link to="/" className="back-button">
        <LuArrowLeft />
      </Link>
      <div className="player-top">
        <img src={StanleyCup} className="trophy" alt="Stanley Cup" />
        <p className="league-title">NHL-cup</p>
        <p className="league-year">2025</p>
      </div>

      {!selectedPlayer && (
        <div>
          <h2>Valitse pelaaja:</h2>
          <div className="player-buttons">
            {players.map((player) => (
              <button
                key={player.id}
                onClick={() => handleSelectPlayer(player)}
                className="player-button"
              >
                {player.firstname} {player.lastname}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedPlayer && (
        <form onSubmit={handleSubmit}>
          <div className="add-player-row">
          <label>
            Etunimi:
            <input
              type="text"
              name="firstname"
              value={updatedData.firstname || ""}
              onChange={handleChange}
            />
          </label>
          <label>
            Sukunimi:
            <input
              type="text"
              name="lastname"
              value={updatedData.lastname || ""}
              onChange={handleChange}
            />
          </label>
          </div>
          <div className="add-player-row">
          <label>
            Joukkue:
            <input
              type="text"
              name="team"
              value={updatedData.team || ""}
              onChange={handleChange}
            />
          </label>
          <label>
            Ikä:
            <input
              type="number"
              name="age"
              value={updatedData.age || ""}
              onChange={handleChange}
            />
          </label>
          </div>
          <div className="add-player-row">  
          <label>
            Pituus:
            <input
              type="text"
              name="height"
              value={updatedData.height || ""}
              onChange={handleChange}
            />
          </label>
          <label>
            Paino:
            <input
              type="text"
              name="weight"
              value={updatedData.weight || ""}
              onChange={handleChange}
            />
          </label>
          </div>
          <div className="add-player-row">
          <label>
            Kaupunki:
            <input
              type="text"
              name="city"
              value={updatedData.city || ""}
              onChange={handleChange}
            />
          </label>
          <label>
            Väri
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                type="color"
                name="color"
                value={updatedData.color}
                onChange={handleChange}
                style={{ width: "50px", height: "30px", border: "none", padding: "0" }}
                />
                {/* Näytetään värin koodi */}
                <span style={{ fontSize: "16px", fontFamily: "monospace" }}>
                {updatedData.color || "#000000"}
                </span>
            </div>
          </label>
          </div>
          <button style={{ fontWeight: "bold" }} type="submit">Tallenna muutokset</button>
          <button type="button" onClick={() => setSelectedPlayer(null)}>
            Vaihda pelaajaa
          </button>
          <button 
            type="button" 
            onClick={handleDelete}
            style={{ backgroundColor: "#dc3545" }}
          >
            Poista pelaaja
          </button>
      </form>
      )}
    </div>
  );
};

export default EditPlayer;
