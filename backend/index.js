const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Tiedosto, johon tulokset tallennetaan
const filePath = "./games.json";

// API: Hae kaikki tulokset
app.get("/api/games", (req, res) => {
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Tiedoston lukeminen epäonnistui" });
    }
    const games = JSON.parse(data || "[]");
    res.json(games);
  });
});

// API: Lisää uusi tulos
app.post("/api/games", (req, res) => {
  const newGame = req.body;
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Tiedoston lukeminen epäonnistui" });
    }
    const games = JSON.parse(data || "[]");
    games.push(newGame);

    fs.writeFile(filePath, JSON.stringify(games, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "Tiedoston tallentaminen epäonnistui" });
      }
      res.status(201).json(newGame);
    });
  });
});

// Käynnistä palvelin
app.listen(PORT, () => {
  console.log(`Palvelin käynnissä osoitteessa http://localhost:${PORT}`);
});
