const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

console.log(process.env.USER);
console.log(process.env.PASSWORD);

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.gxsfvvy.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        const coffeeCollection = client.db("coffeeDB").collection("coffees");

        app.get('/coffees',async(req,res)=>{
            const cursor = coffeeCollection.find();
            const result = await cursor.toArray();
            console.log(result);
            res.send(result);
        })

        app.get('/coffees/:id',async(req,res)=>{
            const id = req.params.id;
            const query = new ObjectId(id);
            const result = await coffeeCollection.findOne(query);
            res.send(result);
        })

        app.post('/coffees',async(req,res)=>{
            const coffee = req.body;
            const result = await coffeeCollection.insertOne(coffee);
            res.send(result);
        })

        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.log);

app.get('/', (req, res) => {
    res.send('testing espresso emporium');
})

app.listen(port, () => {
    console.log(`expresso emporium server is running at ${port}`);
})