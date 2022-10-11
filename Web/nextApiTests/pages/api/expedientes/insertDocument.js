// Based on this tutorial: https://www.mongodb.com/developer/languages/javascript/nextjs-with-mongodb/#getting-started-with-mongodb

import clientPromise from "../../../lib/mongodb" // Within this file we cache the instance of our connection so that subsequent requests do not have to reconnect to the cluster. 

export default async (req, res) => { //This function gets executed when the localhost:3000/api/documentos route is called. We capture the request via req and return the response via the res object.
    try {
        const client = await clientPromise; // Our handler function implementation calls the clientPromise function to get the instance of our MongoDB database. 
        const db = client.db("baseAO");

        const documentos = await db
            .collection("documentos")
            .insertOne({"name": "test", "number": 1, "date": new Date(2020, 10, 17)});

        res.json(documentos);
    }
    catch (e) {
        console.error(e);
    }
};