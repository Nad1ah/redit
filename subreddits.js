const router = require('express').Router()
const { start } = require('./db')

router.post('/posts', async (req, res) => {
  const db = await start()
  const { name, description } = req.body

  try {
    const result = await db.collection('posts').insertOne({ name, description })
    res.status(201).json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/subreddits/:id/posts', async (req, res) => {
  const db = await start()
  const { id } = req.params
  const { title, content } = req.body

  try {
    const subreddit = await db.collection('subreddits').findOne({ _id: id })
    if (!subreddit) {
      return res.status(404).json({ error: 'Subreddit not found' })
    }

    const result = await db
      .collection('posts')
      .insertOne({ title, content, subredditId: id, likes: 0 })
    res.status(201).json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/subreddits/:id/posts', async (req, res) => {
  const db = await start()
  const { id } = req.params

  try {
    const result = await db
      .collection('posts')
      .find({ subredditId: id })
      .sort({ likes: 1 })
      .toArray()
    res.status(200).json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/posts/:id/comments', async (req, res) => {
  const db = await start()
  const { id } = req.params

  try {
    const post = await db.collection('posts').findOne({ _id: id })
    if (!post) {
      return res.status(404).json({ error: 'Post not found' })
    }

    const result = await db
      .collection('comments')
      .find({ postId: id })
      .toArray()
    res.status(200).json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/subreddits/:id/posts/:postId/average-likes', async (req, res) => {
  const db = await start()
  const { id, postId } = req.params

  try {
    const subreddit = await db.collection('subreddits').findOne({ _id: id })
    if (!subreddit) {
      return res.status(404).json({ error: 'Subreddit not Found' })
    }

    const post = await db.collection('posts').findOne({ _id: postId })
    if (!post) {
      return res.status(404).json({ error: 'Post Not Found in this Subreddit' })
    }

    if (post.subredditId !== id) {
      return res
        .status(400)
        .json({ error: 'Post does not belong to this Subreddit' })
    }

    const averageLikes = await db
      .collection('posts')
      .aggregate([
        { $match: { subredditId: id } },
        { $group: { _id: null, averageLikes: { $avg: '$likes' } } },
      ])
      .toArray()

    res.status(200).json({ averageLikes: averageLikes[0].averageLikes })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server Error' })
  }
})

router.put('/posts/:id', async (req, res) => {
  try {
    const db = await start()
    const { id } = req.params
    const { title, content } = req.body

    const post = await db.collection('posts').findOne({ _id: id })

    if (!post) {
      return res.status(404).json({ error: 'Post not found' })
    }

    const result = await db
      .collection('posts')
      .updateOne({ _id: id }, { $set: { title, content } })

    res.status(200).json(result.modifiedCount)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/posts/:id/like', async (req, res) => {
  try {
    const db = await start()
    const { id } = req.params
    const post = await db.collection('posts').findOne({ _id: id })
    if (!post) {
      return res.status(404).json({ error: 'Post not Found!' })
    }

    const result = await db
      .collection('posts')
      .updateOne({ _id: id }, { $inc: { likes: 1 } })
    res.status(200).json(result.modifiedCount)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
