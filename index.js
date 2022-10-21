const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const { response } = require("express");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//connect mongo
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nrqlb.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const database = client.db("atgWorld");
    const postCollection = database.collection("postCollection");
    const usersCollection = database.collection("usersCollection");

    // user route
    app.post("/register", async (req, res) => {
      const newUser = req.body;
      console.log(JSON.stringify(newUser));
      const result = await usersCollection.insertOne(newUser);
      console.log(
        `User is Registered inserted with the _id: ${result.insertedId}`
      );
      res.json(result);
    });

    app.post("/login", async (req, res) => {
      const { email, password } = req.body;
      console.log(email);
      const cursor = await usersCollection.findOne({ email: email });

      console.log(password, cursor?.password);
      if (email === cursor?.email) {
        if (password === cursor?.password) {
          res.json(cursor?.email);
        } else {
          res.json(false);
        }
      } else {
        res.json("mail not found");
      }
    });

    app.put("/forget", async (req, res) => {
      const { email, password } = req.body;
      console.log(email);
      const cursor = await usersCollection.findOne({ email: email });

      const updatedPas = {
        $set: {
          password: password,
        },
      };
      const result = await usersCollection.updateMany(cursor, updatedPas);
      console.log(result);
      res.json(result);
    });

    //post router
    //get api
    /* app.get("/task", async (req, res) => {
      const page = req.query.page;
      const size = parseInt(req.query.size);
      const cursor = postCollection.find().sort({ $natural: -1 });
      let task;
      const count = await cursor.count();
      // pagination Selection
      if (page) {
        task = await cursor
          .skip(page * size)
          .limit(size)
          .toArray();
      } else {
        task = await cursor.limit(6).toArray();
      }
      res.send({
        count,
        task,
      });
    });

    // add a task
    app.post("/task", async (req, res) => {
      const newTask = req.body;
      console.log(newTask);
      const result = await postCollection.insertOne(newTask);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.json(result);
    });

    //update a task data
    app.put("/task/update/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const updateData = {
        $set: {
          title: req.body.title,
          description: req.body.description,
          time: req.body.time,
          date: req.body.date,
        },
      };
      const result = await postCollection.updateMany(query, updateData);
      console.log(result);
      res.json(result);
    });
    //pin a task route
    app.put("/pin/task/:id", async (req, res) => {
      console.log(req.path);
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const updatePin = {
        $set: {
          pin: true,
        },
      };
      const result = await postCollection.updateOne(query, updatePin);
      res.json(result);
    });
    //unpin task route
    app.put("/unpin/task/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const updatePin = {
        $set: {
          pin: false,
        },
      };
      const result = await postCollection.updateOne(query, updatePin);
      res.json(result);
    });

    //complete task route
    app.put("/complete/task/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const completeTask = {
        $set: {
          complete: true,
          pin: false,
        },
      };
      const result = await postCollection.updateMany(query, completeTask);
      console.log(result);
      res.json(result);
    });

    //delete task api
    app.delete("/task/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await postCollection.deleteOne(query);
      res.json(result);
    }); */
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("<h1>Social server is running</h1>");
});

app.listen(port, () => {
  console.log("Social app is listening on port", port);
});
