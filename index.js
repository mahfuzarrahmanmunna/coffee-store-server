const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// pass : aFuhFSxMfWV6aOsc


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hzu9wpj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(process.env.DB_USER);

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const coffeesCollection = client.db('coffeeDB').collection('coffees');
    const usersCollection = client.db('coffeeDB').collection("users")

    // Get Method
    app.get("/coffees", async(req, res) => {
      const cursor = coffeesCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    // Post method
    app.post('/coffees', async(req, res) => {
      const newCoffee = req.body;
      const result = await coffeesCollection.insertOne(newCoffee)
      res.send(result)
      console.log(newCoffee);
    })

    // const get single coffee to find
    app.get('/coffees/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeesCollection.findOne(query);
      res.send(result)
    })

    // Updated Method (update method its mean put method. i forget that. so bad)
    app.put('/coffees/:id', async (req, res) => {
      const id = req.params.id
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedCoffee = req.body;
      const updatedDoc = {
        $set: updatedCoffee
      }
      const result = await coffeesCollection.updateOne(filter, updatedDoc, options)
      res.send(result)
    })
    

    // Delete method
    app.delete('/coffees/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id)}
      const result = await coffeesCollection.deleteOne(query);
      res.send(result)
    })
    



    // Here Users related DB
    // users api creation
    app.get("/users", async(req, res) => {
      const cursor = usersCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    // single user api creation
    app.get('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.findOne(query);
      res.send(result)
    })

    // user post method
    app.post('/users', async(req, res) => {
      const userProfile = req.body;
      const result = await usersCollection.insertOne(userProfile)
      res.send(result)
      console.log(userProfile);
    })

    // patch method in user
    app.patch('/users', async (req, res) => {
      const { email, lastSignInTime } = req.body;
      const filter = { email };
      const updatedDoc = {
        $set:{
          lastSignInTime: lastSignInTime
        }
      }
      const result = await usersCollection.updateOne(filter, updatedDoc);
      res.send(result)
    })


    // user delete method
    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("Coffee Server is getting hotter")
})

app.listen(port, () => {
    console.log(`Coffee server is running port ${port}`);
})