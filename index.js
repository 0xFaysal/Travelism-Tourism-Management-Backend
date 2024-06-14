const express = require("express");
require("dotenv").config();
var cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const port = 3000;

// Import the required MongoDB classes
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

// Define the POST method route
async function run() {
    try {
        await client.connect();
        const database = client.db("Travelism");
        const collectionUser = database.collection("users");
        const collectionPost = database.collection("posts");

        app.post("/api/v1/insert/user", async (req, res) => {
            console.log(req.body.userId);
            const doc = req.body;

            const allUsers = await collectionUser.find({}).toArray();
            const isUserExist = allUsers.some(
                (user) => user.userId === doc.userId
            );

            const numberOfElements = Object.keys(doc).length;

            if (!doc) {
                res.header("status", "400");
                console.log("Invalid input: doc is empty");
                res.send({status: 400, message: "Invalid input"});
            } else if (!doc.userId) {
                res.header("status", "400");
                console.log("Invalid input: user id not found");
                res.send({status: 400, message: "Invalid input"});
            } else if (!doc.userEmail) {
                res.header("status", "400");
                console.log("Invalid input: user email not found");
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
                    console.log(
                        "Invalid input: number of elements not equal as expected"
                    );
                    res.send({status: 400, message: "Invalid input"});
                }
            }
        });

        app.post("/api/v1/insert/post", async (req, res) => {
            console.log(req.body.userId);
            const doc = req.body;
            const allUsers = await collectionUser.find({}).toArray();

            const isUserExistID = allUsers.some(
                (user) => user.userId === doc.userId
            );
            const isUserExistEmail = allUsers.some(
                (user) => user.userEmail === doc.userEmail
            );

            const isUserExist = isUserExistID && isUserExistEmail;

            console.log("Is the user exist:" + isUserExist);

            const numberOfElements = Object.keys(doc).length;

            if (!doc) {
                res.header("status", "400");
                console.log("Invalid input: doc is empty");
                res.send({status: 400, message: "Invalid input"});
            } else if (!doc.userId) {
                res.header("status", "400");
                console.log("Invalid input: user id not found");
                res.send({status: 400, message: "Invalid input"});
            } else if (!doc.userEmail) {
                res.header("status", "400");
                console.log("Invalid input: user email not found");
                res.send({status: 400, message: "Invalid input"});
            } else if (!isUserExist) {
                res.header("status", "400");
                console.log("Invalid input: User does not exist");
                res.status(400).send({message: "User does not exist"});
            } else {
                if (numberOfElements === 13) {
                    const result = await collectionPost.insertOne(doc);
                    res.header("status", "200");
                    res.send({status: 200, message: "Post inserted"});
                    console.log(
                        `A document was inserted with the _id: ${result.insertedId}`
                    );
                } else {
                    res.header("status", "400");
                    console.log(
                        "Invalid input: number of elements not equal as expected"
                    );
                    res.send({status: 400, message: "Invalid input"});
                }
            }
        });

        app.get("/api/v1/get/data=:parameter", async (req, res) => {
            const parameter = req.params.parameter;
            console.log(parameter);
            const allUserData = await collectionPost.find().toArray();

            if (parameter === "all") {
                res.header("status", "200");
                res.send(allUserData);
            } else {
                const filteredUserData = allUserData.filter(
                    (user) => user.userId === parameter
                );
                console.log(filteredUserData);
                res.header("status", "200");
                res.send(filteredUserData);
            }
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
