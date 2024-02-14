const { MongoClient } = require('mongodb');

let  db;

async function start() {
  if (db) {
    return db;
  }
  
  const uri = process.env.DB_URL; 
  const client = new MongoClient(uri);
  const connection = await client.connect()
  db = connection.db("EditDataBase")

  // await db.createCollection('subreddits');
  // await db.createCollection('posts');
  // await db.createCollection('comments');
  
  return  db;
}

module.exports = { 
  start,
};
