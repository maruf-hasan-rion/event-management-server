const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config();
const port = process.env.PORT || 8080;

const app = express()
app.use(express.json());
const corsOptions = {
    origin: ['http://localhost:5173'],
    credentials: true,
    optionalSuccessStatus: 200,
}
app.use(cors(corsOptions));

app.use('/login', (req, res) => {
  res.send({
      token: 'test123'
  })
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b4zor.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
     console.log("db-connect");
    const db = client.db("event-management");
    const userCollection = db.collection("users");
    const eventCollection = db.collection("event");

    app.post("/user", async (req, res) => {
      const newUser = req.body;
      console.log(newUser);
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });
    app.post('/event', async (req, res) => {
        const item = req.body;
        console.log(item);
        const result = await eventCollection.insertOne(item);
        res.send(result);
      });
    app.get('/event', async (req, res) => {
        const result = await eventCollection.find().toArray();
        res.send(result);
      });
      
      app.get('/allEvents', async (req, res) => {
        const { search} = req.query;
        console.log(search);
      
        let option = {};
        if (search) {
          option = { title: { $regex: search, $options: "i" } };
        }
        const result = await eventCollection.find(option).toArray();
        res.send(result);
      });  
      
      
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




// app.listen(port, () => console.log('API is running on localhost:8080/login '))

app.get("/", (req, res) => {
    res.send("Hello from Event Management server....");
  });
  
  app.listen(port, () => console.log(`Server running on port ${port}`));