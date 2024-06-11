const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mysql = require('mysql2');

app.use(bodyParser.json());

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Venkatesh7975.",
  database: "player"
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

app.get("/", (req, res) => {
  const getQuery = `SELECT * FROM player`;
  con.query(getQuery, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.json(result);
  });
});

app.post("/player", (req, res) => {
  try {
    const playerDetails = req.body;
    const { name, age } = playerDetails;
    const addPlayerQuery = `INSERT INTO player (name, age) VALUES (?, ?)`;
    con.query(addPlayerQuery, [name, age], (err, result) => {
      if (err) {
        res.status(500).send({ error: err.message });
        return;
      }
      console.log("Player added");
      res.send("Player added successfully");
    });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

app.put("/player/:id", (req, res) => {
  try {
    const playerId = req.params.id;
    const { name, age } = req.body;
    const updateQuery = `UPDATE player SET name = ?, age = ? WHERE id = ?`;
    con.query(updateQuery, [name, age, playerId], (err, result) => {
      if (err) {
        res.status(500).send({ error: err.message });
        return;
      }
      console.log("Player updated");
      res.send("Player updated successfully");
    });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

app.delete("/player/:id", (req, res) => {
  try {
    const playerId = req.params.id;
    const deleteQuery = `DELETE FROM player WHERE id = ?`;
    con.query(deleteQuery, [playerId], (err, result) => {
      if (err) {
        res.status(500).send({ error: err.message });
        return;
      }
      console.log("Player deleted");
      res.send("Player deleted successfully");
    });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

app.listen(4001, () => {
  console.log("server running");
});
