const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const bodyParser = require("body-parser");

const app = express();
const dbPath = path.join(__dirname, "player.db");

let db = null;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(4001, () => {
      console.log("Server Running at http://localhost:4001/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

app.get("/", async (req, res) => {
  try {
    const getQuery = `SELECT * FROM PLAYER`;
    const playersArray = await db.all(getQuery);
    res.send(playersArray);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

app.post("/player", async (req, res) => {
  try {
    const playerDetails = req.body;
    console.log(playerDetails.length);
    if(playerDetails.length>1){
      for (const eachPlayer of playerDetails) {
        const { name, age } = eachPlayer;
        const addPlayerQuery = `INSERT INTO PLAYER (name, age) VALUES (?, ?)`;
        await db.run(addPlayerQuery, [name, age]);
      }
      res.send("Players added successfully");
    }else if(playerDetails.length===1){
      const { name, age } = playerDetails[0];
      const addPlayerQuery = `INSERT INTO PLAYER (name, age) VALUES (?, ?)`;
      await db.run(addPlayerQuery, [name, age]);
      res.send("Players added successfully");
    }
   
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});


app.put("/player/:playerId", async (req, res) => {  // corrected the route to use :playerId
  try {
    const { playerId } = req.params;  // extracting playerId from req.params
    const { name, age } = req.body;  // assuming name and age are sent in the request body

    // Validate input
    if (!name || !age) {
      return res.status(400).send({ error: "Name and age are required" });
    }

    const updateQuery = `UPDATE player SET name = ?, age = ? WHERE id = ?`;  // parameterized query
    await db.run(updateQuery, [name, age, playerId]);  // using parameterized query values

    res.send("Player updated successfully");
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

app.delete("/player/:playerId", async (req, res) => {
  try {
    const { playerId } = req.params;  // Extract playerId from req.params

    const deleteQuery = `DELETE FROM player WHERE id = ?`;  // Parameterized query
    await db.run(deleteQuery, [playerId]);  // Execute the query with the playerId parameter

    res.send("Player deleted successfully");
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

