const express = require("express");
require("dotenv").config();
var cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const port = 3000;

const {MongoClient, ServerApiVersion} = require("mongodb");
const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        await client.connect();

        const database = client.db("Travelism");
        const collectionUser = database.collection("users");
        const collectionPost = database.collection("posts");

        app.post("/api/v1/insert/user", async (req, res) => {
            console.log(req.body.userID);
            const doc = req.body;
            const allUsers = await collectionUser.find({}).toArray();
            const isUserExist = allUsers.some(
                (user) => user.userID === doc.userID
            );
            const numberOfElements = Object.keys(doc).length;

            if (!doc) {
                res.header("status", "400");
                console.log("Invalid input 1");
                res.send({status: 400, message: "Invalid input"});
            } else if (!doc.userID) {
                res.header("status", "400");
                console.log("Invalid input 2");
                res.send({status: 400, message: "Invalid input"});
            } else if (!doc.userEmail) {
                res.header("status", "400");
                console.log("Invalid input 3");
                res.send({status: 400, message: "Invalid input"});
            } else if (isUserExist) {
                res.header("status", "400");
                console.log("User already exists");
                res.send({status: 400, message: "User already exists"});
            } else {
                if (numberOfElements === 5) {
                    const result = await collectionUser.insertOne(doc);
                    res.header("status", "200");
                    res.send(result);
                    console.log(
                        `A document was inserted with the _id: ${result.insertedId}`
                    );
                } else {
                    res.header("status", "400");
                    console.log("Invalid input 4");
                    res.send({status: 400, message: "Invalid input"});
                }
            }
        });

        app.post("/api/v1/insert/post", async (req, res) => {
            console.log(req.body.userID);
            const doc = req.body;
            const allUsers = await collectionUser.find({}).toArray();

            const isUserExistID = allUsers.some(
                (user) => user.userID === doc.userID
            );
            const isUserExistEmail = allUsers.some(
                (user) => user.userEmail === doc.userEmail
            );
            const isUserExist = isUserExistID && isUserExistEmail;

            if (!doc) {
                res.header("status", "400");
                console.log("Invalid input 1");
                res.send({status: 400, message: "Invalid input"});
            } else if (!doc.userID) {
                res.header("status", "400");
                console.log("Invalid input 2");
                res.send({status: 400, message: "Invalid input"});
            } else if (!doc.userEmail) {
                res.header("status", "400");
                console.log("Invalid input 3");
                res.send({status: 400, message: "Invalid input"});
            } else if (!isUserExist) {
                res.header("status", "400");
                console.log("Invalid input 4");
                res.send({status: 400, message: "User does not exist"});
            } else {
                const result = await collectionPost.insertOne(doc);
                res.header("status", "200");
                res.send(result);
                console.log(
                    `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
                );
            }
        });

        app.get("/api/v1/get/data=:userID", async (req, res) => {
            const userID = req.params.userID;
            console.log(userID);
            const allUserData = await collectionUser.find().toArray();
            res.header("status", "200");
            res.send(allUserData);
        });
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Hello World!");
    console.log("Hello World!");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
