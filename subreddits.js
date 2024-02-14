const { MongoClient, ObjectID } = require('mongodb');
const router = require('express').Router();
const { start } = require('./db');


router.post('/posts', async (req, res) => {
  const db = await start();
  const { name, description } = req.body;

  try {
    const result = await db.collection('subreddits').insertOne({ name, description });
    res.status(201).json(result.ops[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/subreddits/:id/posts', async (req, res) => {
  const db = await start();
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const subreddit = await db.collection('subreddits').findOne({ _id: new ObjectID(id) });
    if (!subreddit) {
      return res.status(404).json({ error: 'Subreddit not found' });
    }

    const result = await db.collection('posts').insertOne({ title, content, subredditId: id });
    res.status(201).json(result.ops[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/subreddits/:id/posts', async (req, res) => {
  const db = await start();
  const { id } = req.params;

  try {
    const result = await db.collection('posts').find({ subredditId: id }).toArray();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/posts/:id/comments', async (req, res) => {
  const db = await start();
  const { id } = req.params;

  try {
    const post = await db.collection('posts').findOne({ _id: new ObjectID(id) });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const result = await db.collection('comments').find({ postId: id }).toArray();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put('/posts/:id', async (req, res) => {
  try {
    const db = await start();
    const { id } = req.params;
    const { title, content } = req.body;

    const post = await db.collection('posts').findOne({ _id: new ObjectID(id) });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const result = await db.collection('posts').updateOne(
      { _id: new ObjectID(id) },
      { $set: { title, content } }
    );

    res.status(200).json(result.modifiedCount);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;