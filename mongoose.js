const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/netflix_user_details")
  .then(() => {
    console.log("Database connected");
    app.listen(4001, () => {
      console.log("Server running at port 4001");
    });
    global.userDetailsCollection = mongoose.connection.db.collection("userDetails");
  })
  .catch((error) => {
    console.error(error);
  });

// GET endpoint to fetch all user details
app.get("/", async (req, res) => {
  try {
    const getQuery = await userDetailsCollection.find().toArray();
    res.json(getQuery);
  } catch (error) {
    res.status(500).send(error);
  }
});

// POST endpoint to add new user details
app.post("/user", async (req, res) => {
  try {
    const { name, password } = req.body;

    // Validate the required fields
    if (!name || !password) {
      return res.status(400).send({ error: "Name and password are required" });
    }

    // Create a new user details document
    const newUser = { name, password };
    await userDetailsCollection.insertOne(newUser);

    res.status(201).send("User added successfully");
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// PUT endpoint to update user details
// PUT endpoint to update user details
app.put("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { name,password } = req.body;

    const result = await userDetailsCollection.updateOne({ _id: new mongoose.Types.ObjectId(userId) }, { $set: { name,password } });

    if (result.modifiedCount === 1) {
      res.send("User updated successfully");
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


// DELETE endpoint to delete user details
app.delete("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await userDetailsCollection.deleteOne({ _id: new mongoose.Types.ObjectId(userId) });

    if (result.deletedCount === 1) {
      res.send("User deleted successfully");
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

