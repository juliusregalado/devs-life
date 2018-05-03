const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const posts_controller = require('../../controllers/posts_controller');

// @route   GET api/test
// @desc    Test posts route
// @access  Public
router.get('/test', (req, res) => res.json({
  msg: "posts works"
}));

// @route   GET api/posts
// @desc    Get Posts
// @access  Public
router.get('/', posts_controller.getAllPosts);

// @route   GET api/posts/:id
// @desc    Get Post by id
// @access  Public
router.get('/:id', posts_controller.getPost);

// @route   POST api/posts
// @desc    Create Post
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), posts_controller.createPost);

// @route   DELETE api/posts/:id
// @desc    Delete Post
// @access  Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), posts_controller.deletePost);

// @route   POST api/posts/like/:id
// @desc    Like a post
// @access  Private
router.post('/like/:id', passport.authenticate('jwt', { session: false }), posts_controller.likeAPost)

// @route   POST api/posts/unlike/:id
// @desc    Unlike a post
// @access  Private
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), posts_controller.unLikeAPost)

// @route   POST api/posts/comment/:post_id
// @desc    Add comment to post
// @access  Private
router.post('/comment/:post_id', passport.authenticate('jwt', { session: false }), posts_controller.addComment);

// @route   DELETE api/posts/comment/:comment_id
// @desc    Remove comment to post
// @access  Private
router.delete('/comment/:post_id/:comment_id', passport.authenticate('jwt', { session: false }), posts_controller.deleteComment)

module.exports = router;