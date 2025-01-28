import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./GameTable.css";

function GameTable({ players, games}) {

  const calculateStats = () => {
    const stats = players.map((player) => ({
      name: player.firstname,
      wins: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      winRatio: 0,
    }));

    games.forEach((game) => {
      const homePlayerStats = stats.find((stat) => stat.name === game.homePlayer);
      const awayPlayerStats = stats.find((stat) => stat.name === game.awayPlayer);

    if (homePlayerStats && awayPlayerStats) {
      if (game.homeScore > game.awayScore) {
        homePlayerStats.wins++;
        awayPlayerStats.losses++;
      } else if (game.awayScore > game.homeScore) {
        awayPlayerStats.wins++;
        homePlayerStats.losses++;
      }

      homePlayerStats.goalsFor += game.homeScore;
      homePlayerStats.goalsAgainst += game.awayScore;
      homePlayerStats.goalDifference = homePlayerStats.goalsFor - homePlayerStats.goalsAgainst;

      homePlayerStats.winRatio = (
        (homePlayerStats.wins / (homePlayerStats.wins + homePlayerStats.losses)) *
        100
      ).toFixed(1);

      awayPlayerStats.goalsFor += game.awayScore;
      awayPlayerStats.goalsAgainst += game.homeScore;
      awayPlayerStats.goalDifference = awayPlayerStats.goalsFor - awayPlayerStats.goalsAgainst;

      awayPlayerStats.winRatio = (
        (awayPlayerStats.wins / (awayPlayerStats.wins + awayPlayerStats.losses)) *
        100
      ).toFixed(1);
      }
    });

    return stats;
  };

  const stats = calculateStats();

  return (
    <div className="game-table">

      {/* Desktop-näkymä */}
      <div className="desktop-table">
        <table className="table">
          <thead>
            <tr style={{color: "black"}}>
              <th>Sijoitus</th>
              <th>Pelaaja</th>
              <th>Voitot</th>
              <th>Häviöt</th>
              <th>Tehdyt maalit</th>
              <th>Päästetyt maalit</th>
              <th>Maaliero</th>
              <th>Voittoprosentti</th>
            </tr>
          </thead>
          <tbody>
            {stats
            .sort((a, b) => Number(b.winRatio) - Number(a.winRatio))
            .map((stat, index) => (
        <tr key={stat.name}>
        <td>{index + 1}.</td>
        <td>
          <Link style={{color: "white", textDecoration: "none"}} to={`/player/${stat.name}`}> 
            <strong>{stat.name}</strong>
          </Link>
        </td>
        <td>{stat.wins}</td>
        <td>{stat.losses}</td>
        <td>{stat.goalsFor}</td>
        <td>{stat.goalsAgainst}</td>
        <td>{stat.goalDifference}</td>
        <td><strong>{stat.winRatio}%</strong></td>
      </tr>
    ))}
</tbody>
        </table>
      </div>

      {/* Mobiili-näkymä */}
      <div className="mobile-table">
  <table>
    <thead>
      <tr>
        <th>•</th>
        <th>Pelaaja</th>
        <th>W</th>
        <th>L</th>
        <th>GD</th>
        <th>W%</th>
      </tr>
    </thead>
    <tbody>
        {stats
            .sort((a, b) => Number(b.winRatio) - Number(a.winRatio))
            .map((stat, index) => (
        <tr className="mobile-row" key={stat.name}>
        <td>{index + 1}.</td>
        <td>
          <Link style={{color: "white", textDecoration: "none"}} to={`/player/${stat.name}`}> 
            <strong>{stat.name}</strong>
          </Link>
        </td>
            <td>{stat.wins}</td>
            <td>{stat.losses}</td>
            <td>{stat.goalDifference}</td>
            <td><strong>{stat.winRatio}%</strong></td>
          </tr>
        ))}
    </tbody>
  </table>
</div>

    </div>
  );
}

export default GameTable;