const express = require('express');
const Post = require('../models/Post.model');
const Fn = require('../functions/index');
const verifyToken = require('../middleware/auth');

const router = express.Router();

// GET api/post
router.get('/', verifyToken, async (req, res) => {
  try {
    const listPost = await Post.find({ user: req.userId }).populate('user', [
      'username',
      'createdAt',
    ]);
    res.json({
      success: true,
      message: 'get list post success',
      posts: listPost,
    });
  } catch (err) {
    return Fn.handleError(500, res, 'GET List Post Failed');
  }
});

// @route POST api/posts
// @desc Create post
// @access Private
router.post('/', verifyToken, async (req, res) => {
  const { title, description, url, createdAt, status, user } = req.body;

  if (!title) {
    return Fn.handleError(400, res, 'lack title');
  }

  try {
    const newPost = new Post({
      title,
      description,
      url: (url || '').startsWith('https://') ? url : `https://${url}`,
      createdAt,
      status: 'DOING',
      user: '629dcc317328c13d3ad83761',
    });

    await newPost.save();
    res.json({ success: true, message: 'create Post successful' });
  } catch (err) {
    console.log('router.post ~ err', err);
    return Fn.handleError(500, res, 'create Post failed');
  }
});

// @route PUT api/auth/login
// @desc update post
// @access Private
router.put('/:id', verifyToken, async (req, res) => {
  const { title, description, url, createdAt, status, user } = req.body;

  if (!title) {
    return Fn.handleError(400, res, 'lack title');
  }

  try {
    let updatePost = {
      title,
      description: description || '',
      url: (url || '').startsWith('https://') ? url : `https://${url}`,
      status,
    };

    const postUpdateCondition = { _id: req.params.id, user: req.userId };

    updatePost = await Post.findOneAndUpdate(postUpdateCondition, updatePost, {
      new: true,
    });
    console.log('router.put ~ updatePost', updatePost);

    if (!updatePost) {
      return Fn.handleError(401, res, 'dont allow update post');
    }

    res.json({
      success: true,
      message: 'Excellent progress!',
      post: updatePost,
    });
  } catch (err) {
    console.log('router.post ~ err', err);
    return Fn.handleError(500, res, 'update Post failed');
  }
});

// DELETE api/post
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const postDeleteCondition = { _id: req.params.id, user: req.userId };
    const deletedPost = await Post.findOneAndDelete(postDeleteCondition);
    console.log('router.delete ~ deletedPost', deletedPost);
    if (!deletedPost) {
      return Fn.handleError(401, res, 'Not Found');
    }
    res.json({
      success: true,
      message: 'delete success',
      deletedPost,
    });
  } catch (err) {
    return Fn.handleError(500, res, 'DELETE failed');
  }
});

module.exports = router;
