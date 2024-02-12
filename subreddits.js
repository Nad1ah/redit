const router = require('express').Router();
const connect = require('./db');


router.post('/posts', async (req, res) => {
  const db = await connect();
  const { name, description } = req.body;

  try {
    const result = await db.collection('subreddits').insertOne({ name, description });
    res.status(201).json(result.ops[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/posts', async (req, res) => {
  const db = await connect();

  try {
    const result = await db.collection('posts').find().toArray();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/:id', async (req, res) => {
  const db = await connect();
  const { id } = req.params;

  try {
    const result = await db.collection('subreddits').findOne({ _id: new MongoClient.ObjectID(id) });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put('/:id', async (req, res) => {
  const db = await connect();
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const result = await db.collection('subreddits').updateOne(
      { id: new MongoClient.ObjectID(id) },
      { $set: { name, description } }
    );
    res.status(200).json(result.modifiedCount);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete('/:id', async (req, res) => {
  const db = await connect();
  const { id } = req.params;

  try {
    const result = await db.collection('subreddits').deleteOne({ _id: new MongoClient.ObjectID(id) });
    res.status(200).json(result.deletedCount);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;