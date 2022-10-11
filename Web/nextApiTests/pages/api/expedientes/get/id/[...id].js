// Based on this tutorial: https://www.mongodb.com/developer/languages/javascript/nextjs-with-mongodb/#getting-started-with-mongodb

import { ObjectId } from "mongodb";
import clientPromise from "../../../../../lib/mongodb" // Within this file we cache the instance of our connection so that subsequent requests do not have to reconnect to the cluster. 

export default async (req, res) => { //This function gets executed when the localhost:3000/api/documentos route is called. We capture the request via req and return the response via the res object.
    try {
        const client = await clientPromise; // Our handler function implementation calls the clientPromise function to get the instance of our MongoDB database. 
        const db = client.db("baseAO");
        const { id } = req.query;

        const documentos = await db
            .collection("documentos")
            .find({"_id": ObjectId( id[1])})
            .project({ "_id": 1, "numExp": 1, "tituloExpediente": 1, "apertura": 1, "documentos": 1}) // Only return the indicated fields
            .toArray();

        res.json(documentos);
    }
    catch (e) {
        console.error(e);
    }
};