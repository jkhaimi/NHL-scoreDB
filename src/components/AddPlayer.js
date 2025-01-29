import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./AddPlayer.css";
import { LuArrowLeft } from "react-icons/lu";
import StanleyCup from "../Images/Stanley_Cup.png";
import { useNavigate } from "react-router-dom";

const AddPlayer = () => {
  const navigate = useNavigate(); // Ota käyttöön navigointitoiminto
  const [playerData, setPlayerData] = useState({
    firstname: "",
    lastname: "",
    team: "",
    age: 0,
    height: "",
    weight: "",
    city: "",
    color: "",
  });
//   const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlayerData({ ...playerData, [name]: value });
  };

//   const handleFileChange = (e) => {
//     setImageFile(e.target.files[0]);
//   };

const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!playerData.firstname || !playerData.lastname || !playerData.team || !playerData.age || !playerData.height || !playerData.weight || !playerData.city || !playerData.color) {
      alert("Kaikki kentät täytyy täyttää!");
      return;
    }
  
    try {
      // const response = await fetch(`${process.env.REACT_APP_API_URL}/api/players`, {
        const response = await fetch('/api/games', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(playerData), // Lähetetään JSON-muotoisena
      });
  
      if (response.ok) {
        alert("Pelaaja lisätty onnistuneesti!");
        setPlayerData({
          firstname: "",
          lastname: "",
          team: "",
          age: 0,
          height: "",
          weight: "",
          city: "",
          color: "#000000",
        });
        navigate("/"); 
      } else {
        alert("Virhe pelaajan lisäämisessä!");
      }
    } catch (error) {
      console.error("Virhe POST-pyynnössä:", error);
      alert("Yhteys epäonnistui.");
    }
  };  

  return (
    <div className="add-player-container">
      <Link to="/" className="back-button">
        <LuArrowLeft />
      </Link>
      <div className="player-top">
        <img src={StanleyCup} className="trophy" alt="Stanley Cup" />
        <p className="league-title">NHL-cup</p>
        <p className="league-year">2025</p>
      </div>

      <form onSubmit={handleSubmit} className="add-player-form">
        <div className="add-player-row">
        <label>
          Etunimi
          <input
            type="text"
            name="firstname"
            value={playerData.firstname}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Sukunimi
          <input
            type="text"
            name="lastname"
            value={playerData.lastname}
            onChange={handleChange}
            required
          />
        </label>
        </div>
        <div className="add-player-row">
        <label>
          Pituus (cm)
          <input
            type="text"
            name="height"
            value={playerData.height}
            onChange={handleChange}
          />
        </label>
        <label>
          Paino (kg)
          <input
            type="text"
            name="weight"
            value={playerData.weight}
            onChange={handleChange}
          />
        </label>
        </div>
        <div className="add-player-row">
        <label>
          Joukkue
          <input
            type="text"
            name="team"
            value={playerData.team}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Kaupunki
          <input
            type="text"
            name="city"
            value={playerData.city}
            onChange={handleChange}
          />
        </label>
        </div>
        <div className="add-player-row">
        <label>
          Ikä
          <input
            className="add-player-age"
            type="number"
            name="age"
            value={playerData.age}
            onChange={handleChange}
            required
          />
        </label>
        <label>
            Väri
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                type="color"
                name="color"
                value={playerData.color}
                onChange={handleChange}
                style={{ width: "50px", height: "30px", border: "none", padding: "0" }}
                />
                {/* Näytetään värin koodi */}
                <span style={{ fontSize: "16px", fontFamily: "monospace" }}>
                {playerData.color || "#000000"}
                </span>
            </div>
          </label>

        </div>
        {/* <label>
          Lataa kuva:
          <input type="file" accept="image/png" onChange={handleFileChange} required />
        </label> */}
      </form>
      <button className="add-player-button" onClick={handleSubmit}>Lisää pelaaja</button>
    </div>
  );
};

export default AddPlayer;
