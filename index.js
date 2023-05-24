const express = require('express');
const cors = require('cors');
const jwt = require("jsonwebtoken")
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
const MakupServiceCollection = client.db('EventHiveDb').collection('Makeupservices');
const usersCollection = client.db('EventHiveDb').collection('users');
const bookingsCollection = client.db('EventHiveDb').collection('bookings');




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


/*  --------------------put operation ----------------- */
// Save user email & generate JWT
app.put('/user/:email', async (req, res) => {
    try {
        const email = req.params.email
        const user = req.body

        const filter = { email: email }
        const options = { upsert: true }
        const updateDoc = {
            $set: user,
        }
        const result = await usersCollection.updateOne(filter, updateDoc, options)

        // const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        //     expiresIn: '1d',
        // })
        // console.log(result, token)
        res.send(result)
    } catch (error) {
        console.log(error.message)
    }
})







/*_---------------  GET OPEration _____________*/


// generate jwt token
app.get("/jwt", (req, res) => {
    try {
        const { email } = req.query;
        console.log(email);

        const token = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1d',
        })
        if (token) {
            console.log(token)
            res.send({ token })
        }
        else {
            res.send({ message: "Failed to get token from server" })
        }

    } catch (error) {
        console.log(error)

    }

})
// get a single user by email

app.get("/user/:email", async (req, res) => {

    try {
        const { email } = req.params;
        console.log(email)
        const query = {
            email: email
        }
        const result = await usersCollection.findOne(query);
        res.send(result)
    } catch (error) {
        console.log(error.message)
    }
})



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
app.get("/makeup-artists", async (req, res) => {
    try {
        // const query = {};
        // const cursor = costumesCollection.find(query);
        const result = await MakupServiceCollection.find({}).toArray();
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
app.get("/makeup-artists/:id", async (req, res) => {
    try {
        const id = req.params.id
        const result = await MakupServiceCollection.findOne({ _id: new ObjectId(id) });
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


// get all users 

app.get("/users", async (req, res) => {
    try {
        const result = await usersCollection.find({}).toArray()
        res.send(result)
    } catch (error) {
        console.log(error.message)
    }
})










/*_---------------  GET OPEration _____________*/







/*_---------------  Patch OPEration _____________*/
// set role and change them
app.patch('/user/:email', async (req, res) => {
    try {
        const newData = req.body;
        const email = req.params.email;
        // console.log(email, newData.role)
        const filter = { email: email };
        const updateDoc = {
            $set: { role: newData?.role }
        };

        // Update the user in the collection
        const result = await usersCollection.updateOne(filter, updateDoc);

        if (result.acknowledged) {
            res.send({
                message: "Request has send admin to become a merchant ",
                data: result
            });
        } else {
            res.status(404).send({
                message: "Request to become a merchant is failed",
                data: null
            });
        }
    } catch (error) {
        console.log(error.message)
    }
});



/*_---------------  Patch OPEration _____________*/





/*_---------------  POST OPEration _____________*/

// Save bookings
app.post('/bookings', async (req, res) => {
    try {
        const booking = req.body
        console.log(booking)
        const result = await bookingsCollection.insertOne(booking)

        console.log('result----->', result)
        // sendMail(
        //     {
        //         subject: 'Booking Successful!',
        //         message: `Booking Id: ${result?.insertedId}, TransactionId: ${booking.transactionId}`,
        //     },
        //     booking?.guestEmail
        // )
        if (result.acknowledged) {
            res.send({
                message: "Request has send admin to become a merchant ",
                data: result
            });

        }
        else {
            res.status(404).send({
                message: "Booking failed! for some issue!",
                data: null
            });
        }
    } catch (error) {
        console.log(error.message)
    }

})



/*_---------------  Post OPEration _____________*/