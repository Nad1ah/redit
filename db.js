const { MongoClient } = require('mongodb');


const uri = process.env.DB_URL; 
const client = new MongoClient(uri);

async function connect() {
  if (!client.isConnected()) await client.connect();
  return client.db('EditDataBase'); 
}

module.exports = connect;