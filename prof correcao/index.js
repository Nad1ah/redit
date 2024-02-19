require("dotenv").config();
const Joi =  require("joi");
const express = require("express")
const { MongoClient } = require("mongodb");


let db;
const dbClient = new MongoClient(process.env.DB_URL);
const subreditsCollection = "subredits"
const app = express()
app.arguments(express.json());

const newSubredit = Joi.object({
    name: Joi.string().min(5).max(20).required(),
    description: Joi.string().min(10).max(100)
}).unknown()

const nwePost = Joi.object({
    title: Joi.string.min(3),
    content: Joi.string.min(10),
})

app.post("/suredits",async (req, res)=>{
 const {error, value} =  newSubredit.validate(req.body)
if ( error ) {
    return res.status(400).json(error.details);
}

const insertRes = await db.collection(subreditsCollection).insertOne(value);

const result = await db.collection(subreditsCollection).findOne({_id: insertRes.insertedId});


res.status(201).json(result);
})

app.post("/suredits/:id/posts", (req, res)=>{
    const {error, value} =  nwePost.validate(req.body)
    if ( error ) {
        return res.status(400).json(error.details);
    }
    const result = db.collection(subreditsCollection)
    .findOne({_id: req.params.id })
})  
app.get("/suredits/:id/posts", (req, res)=>{
    
})  
app.post("/suredits/:id/posts/:pid/comments", (req, res)=>{
    
})  
app.put("/suredits/:id/posts", (req, res)=>{
    
})  


async function start() {
    if (db) {
      return db;
    }

    const connection = await dbClient.connect();
    db = connection.db("EditDataBase");
    
    app.listen(3000,()=>{
    console.log("ok")
})
}  

start()
.then(() => console.log("server is running"))
.catch((err)=> console.log(err))