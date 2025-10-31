const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

const uri =
  "mongodb+srv://SmartDealsdb:smartdealsdb@cluster0.6jar5hr.mongodb.net/?appName=Cluster0";

app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/", (req, res) => {
  res.send("Smart Deals Server in running");
});

async function run() {
  try {
    await client.connect();

    const db = client.db("smart_db");
    const productCollection = db.collection("products");
    const bidcollection = db.collection("bidData");
    const userCollection = db.collection("users");

    //userdataCollection
    app.post('/users',async(req,res)=>{
       const newUser=req.body;
       const result =await userCollection.insertOne(newUser);
       res.send(result);
    })

    //Get/find All
    app.get("/products", async (req, res) => {
      const cursor = productCollection.find(); //.sort({price_min:-1}).limit(5);-> for sorting  and set limit
      //.skip(2)
      //query
      const result = await cursor.toArray();
      res.send(result);
    });

    //Get/find specific
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });

    //post
    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    });

    //update
    app.patch("/products/:id", async (req, res) => {
      const id = req.params.id;
      const updateInfo = req.body;
      const query = { _id: new ObjectId(id) };
      const update = {
        $set: updateInfo,
        //  name:updateInfo.name,
        //  price:updateInfo.price,
      };
      const result = await productCollection.updateOne(query, update);
      res.send(result);
    });

    //delete
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      res.send(result);
    });

    //bids related APIS--------------------------->

    //get all or using an email->
    app.get("/bids", async (req, res) => {
      const email = req.query.email;
      const query = {};
      if (email) {
        query.buyer_email = email;
      }
       const cursor = bidcollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    //bid post
    app.post("/products", async (req, res) => {
      const newBid = req.body;
      const result = await bidcollection.insertOne(newBid);
      res.send(result);
    });





    await client.db("admin").command({ ping: 1 });
    console.log("You Succesfully connected to MongoDB!");
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Smart Deals sever is runnit on port: ${port}`);
});
