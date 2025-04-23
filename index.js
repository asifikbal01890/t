require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// Create an Express application
const app = express();
const port = process.env.PORT || 4000;

// Middleware setup
app.use(cors()); 
app.use(express.json()); 

// MongoDB connection URI using credentials from environment variables
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rjpks.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x5lfl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a new MongoDB client
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Async function to connect to MongoDB and define routes
async function run() {
    try {
        // Connect to the database and collections
        // const JobsCollections = client.db("jobApply").collection("allJobs");

        const db = client.db("jobApply");
        const JobsCollection = db.collection("allJobs");
        const ApplicationsCollection = db.collection("applications");

        // ------------------- JOBS API -------------------

        // Get all jobs
        app.get("/jobs", async (req, res) => {
            const result = await JobsCollection.find().toArray();
            res.send(result);
        });

        // Get a specific job by ID
        app.get("/jobs/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await JobsCollection.findOne(query);
            res.send(result);
        });


        // Add a new job
        app.post("/jobs", async (req, res) => {
            const data = req.body;
            const result = await JobsCollection.insertOne(data);
            res.send(result);
        });

        // Update a job by ID
        app.put("/jobs/:id", async (req, res) => {
            const id = req.params.id;
            const updatedJob = req.body;
            const result = await JobsCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: updatedJob }
            );
            res.send(result);
        });

        // Delete a job by ID
        app.delete("/jobs/:id", async (req, res) => {
            const id = req.params.id;
            const result = await JobsCollection.deleteOne({ _id: new ObjectId(id) });
            res.send(result);
        });

        // ------------------- APPLICATIONS API -------------------

        // Submit a job application
        app.post("/applications", async (req, res) => {
            const application = req.body;
            const result = await ApplicationsCollection.insertOne(application);
            res.send(result);
        });

        // Get all job applications
        app.get("/applications", async (req, res) => {
            const result = await ApplicationsCollection.find().toArray();
            res.send(result);
        });
        app.get("/applications/:id", async (req, res) => {
            const id = req.params.id;
            const query = {job_id: id}
            const result = await ApplicationsCollection.find(query).toArray();
            res.send(result);
        });
        app.put("/applications/update/:id", async (req, res) => {
            const id = req.params.id;
            const status = req.body;
            const filter = { _id: new ObjectId(id) };
            const updateDoc = { $set: {status: status.status} }
            const result = await ApplicationsCollection.updateOne(filter, updateDoc);
            res.send(result);
        });

        // Delete an application by ID
        app.delete("/applications/:id", async (req, res) => {
            const id = req.params.id;
            const result = await ApplicationsCollection.deleteOne({ _id: new ObjectId(id) });
            res.send(result);
        });

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

// Call the run function and handle any errors
run().catch(console.dir);

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
