const express = require("express");
require("dotenv").config();
var cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const port = 3000;

// Import the required MongoDB classes
const {MongoClient, ServerApiVersion, ObjectId} = require("mongodb");
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
            const countryName = [
                "bangladesh",
                "thailand",
                "indonesia",
                "malaysia",
                "vietnam",
                "cambodia",
            ];
            const isCountryExist = countryName.some(
                (country) => country.toLowerCase() === parameter.toLowerCase()
            );
            const postCollectionData = await collectionPost.find().toArray();
            const allUsers = await collectionUser.find().toArray();
            const isUserExistID = allUsers.some(
                (user) => user.userId === parameter
            );

            if (parameter === "all") {
                res.header("status", "200");
                res.send(postCollectionData);
            } else if (isUserExistID) {
                const filteredUserData = postCollectionData.filter(
                    (user) => user.userId === parameter
                );
                res.header("status", "200");
                res.send(filteredUserData);
            } else if (ObjectId.isValid(parameter)) {
                const result = await collectionPost.findOne({
                    _id: new ObjectId(parameter),
                });
                res.header("status", "200");
                res.send(result);
            } else if (isCountryExist) {
                const result = await collectionPost.find().toArray();
                const filteredCountryData = result.filter(
                    (post) =>
                        post.country_name.toLowerCase() ===
                        parameter.toLowerCase()
                );
                res.header("status", "200");
                res.send(filteredCountryData);
            }
        });

        app.get("/api/v1/get/search=:parameter", async (req, res) => {
            const parameter = req.params.parameter;
            const postCollectionData = await collectionPost
                .find({tourists_spot_name: {$regex: parameter, $options: "i"}})
                .toArray();
            res.header("status", "200");
            res.send(postCollectionData);
        });

        app.put("/api/v1/update/data=:parameter", async (req, res) => {
            const parameter = req.params.parameter;
            const doc = req.body;
            const allUsers = await collectionUser.find().toArray();
            const isUserExistID = allUsers.some(
                (user) => user.userId === doc.userId
            );
            const isUserExistEmail = allUsers.some(
                (user) => user.userEmail === doc.userEmail
            );
            const isUserExist = isUserExistID && isUserExistEmail;

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
                const result = await collectionPost.updateOne(
                    {_id: new ObjectId(parameter)},
                    {$set: doc}
                );
                console.log(
                    `${result.matchedCount} document(s) matched the query criteria.`
                );
                res.header("status", "200");
                res.send({status: 200, message: "Data updated successfully"});
            }
        });

        app.delete("/api/v1/delete/data=:id", async (req, res) => {
            const id = req.params.id;
            const result = await collectionPost.deleteOne({
                _id: new ObjectId(id),
            });

            if (result.deletedCount === 1) {
                console.log("Successfully deleted one document.");
                res.header("status", "200");
                res.send({status: 200, message: "Successfully deleted post."});
            } else {
                console.log(
                    "No documents matched the query. Deleted 0 documents."
                );
                res.header("status", "400");
                res.send({
                    status: 400,
                    message: "No Post matched the query. Deleted 0 Post.",
                });
            }
        });
    } finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Running...");
    console.log("From Root this is working fine");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
