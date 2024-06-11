const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
const { MongoClient, ObjectId } = require("mongodb");

// Replace the uri string with your connection string.
const uri = "mongodb://localhost:27017/";

let userDetailsCollection;

(async () => {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db('netflix_user_details');
    userDetailsCollection = database.collection('userDetails');
    console.log("Connected to MongoDB");
  } catch (e) {
    console.error("Error connecting to MongoDB:", e);
  }
})();

app.get("/", async (req, res) => {
  try {
    const contacts = await userDetailsCollection.find().toArray();
    res.json(contacts);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

app.post("/user", async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).send({ error: "Name and password are required" });
    }

    const newUser = { name, password };
    await userDetailsCollection.insertOne(newUser);

    res.status(201).send("User added successfully");
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

app.put("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).send({ error: "Name and password are required" });
    }

    const updatedUser = { name, password };
    await userDetailsCollection.updateOne({ _id: new ObjectId(id) }, { $set: updatedUser });

    res.send("User updated successfully");
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

app.delete("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await userDetailsCollection.deleteOne({ _id: new ObjectId(id) });

    res.send("User deleted successfully");
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

app.listen(4001, () => {
  console.log("Server running on port 4001");
});
