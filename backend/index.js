const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

const gamesFilePath = "./games.json";
const playersFilePath = "./players.json";

// API: Hae kaikki tulokset
app.get("/api/games", (req, res) => {
  fs.readFile(gamesFilePath, "utf-8", (err, data) => {
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

// API: Hae kaikki pelaajat
app.get("/api/players", (req, res) => {
  fs.readFile(playersFilePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Tiedoston lukeminen epäonnistui" });
    }
    const players = JSON.parse(data || "[]");
    res.json(players);
  });
});

app.post("/api/players", (req, res) => {
  const newPlayer = req.body;

  fs.readFile(playersFilePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Tiedoston lukeminen epäonnistui" });
    }

    const players = JSON.parse(data || "[]");

    players.push(newPlayer);

    fs.writeFile(playersFilePath, JSON.stringify(players, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "Tiedoston tallentaminen epäonnistui" });
      }
      res.status(201).json(newPlayer);
    })
  })
})


// Käynnistä palvelin
app.listen(PORT, () => {
  console.log(`Palvelin käynnissä osoitteessa http://localhost:${PORT}`);
});
