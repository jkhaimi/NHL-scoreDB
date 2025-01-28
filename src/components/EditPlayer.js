import React, { useState, useEffect } from "react";
import "./EditPlayer.css";

const EditPlayer = () => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [updatedData, setUpdatedData] = useState({});

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/players");
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
    setUpdatedData(player); // Alustetaan muokattavat tiedot valitun pelaajan tiedoilla
    console.log(player)
    console.log(selectedPlayer)
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
      const response = await fetch(`http://localhost:3001/api/players/${selectedPlayer.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        alert("Pelaajan tiedot päivitetty onnistuneesti!");
        setSelectedPlayer(null);
      } else {
        alert("Virhe pelaajan tietojen päivittämisessä!");
        console.log(updatedData)
      }
    } catch (error) {
      console.error("Virhe PUT-pyynnössä:", error);
    }
  };

  return (
    <div className="edit-player">
      <h1>Muokkaa pelaajaa</h1>

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
          <h2>Muokkaa pelaajan tietoja</h2>
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
          <label>
            Kaupunki:
            <input
              type="text"
              name="city"
              value={updatedData.city || ""}
              onChange={handleChange}
            />
          </label>
          <button type="submit">Tallenna muutokset</button>
          <button type="button" onClick={() => setSelectedPlayer(null)}>
            Peruuta
          </button>
        </form>
      )}
    </div>
  );
};

export default EditPlayer;
