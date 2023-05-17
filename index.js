const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port = process.env.port || 5000
const app = express();





// middleware
app.use(cors());
app.use(express.json());



const uri = process.env.DB_URI
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
})



const DBConnect = async () => {
    try {
        await client.connect();
        console.log("success connection");
    } catch (error) {
        console.log(error.message);
    }
}

DBConnect();


const costumesCollection = client.db('EventHiveDb').collection('costumes');




// test server
app.get("/", (req, res) => {
    res.send({
        success: true,
        message: "Task manager app server is running.."
    })
})



app.listen(port, () => {
    console.log("server is running in ", port || 5000);
})




/*_---------------  GET OPEration _____________*/
// get specific costumes
app.get("/costumes", async (req, res) => {
    try {
        // const query = {};
        // const cursor = costumesCollection.find(query);
        const result = await costumesCollection.find({}).toArray();
        res.send({
            success: true,
            message: `successfully got the data `,
            data: result
        });
        // console.log(result);
    } catch (error) {
        res.send({
            success: false,
            error: error.message
        })
    }
})
app.get("/costumes/:id", async (req, res) => {
    try {
        const id = req.params.id
        const result = await costumesCollection.findOne({ _id: new ObjectId(id) });
        res.send({
            success: true,
            message: `successfully got the data `,
            data: result
        });
        // console.log(result);
    } catch (error) {
        res.send({
            success: false,
            error: error.message
        })
    }
})












/*_---------------  GET OPEration _____________*/














