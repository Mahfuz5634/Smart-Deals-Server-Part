const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
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

    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    });
    app.delte("/products/:id", async (req, res) => {
      const id = req.params.id;
     
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
