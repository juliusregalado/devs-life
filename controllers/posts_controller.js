const Post = require('../models/Post');
const Profile = require('../models/Profile');
const validateProfileInput = require('../validation/profile');
const validatePostInput = require('../validation/post');

module.exports= {

  getAllPosts(req, res) {
    Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ error: 'No Post Found' }))
  },

  getPost(req, res) {
    Post.findById(req.params.id)
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ error: 'No post found for that ID' }))
  },

  createPost(req, res) {
    const { errors, isValid } = validatePostInput(req.body);
    if(!isValid) {
      return res.status(400).json(errors);
    }
    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });
    newPost.save()
    .then(post => res.json(post))
    .catch(err => res.status(404).json(err))
  },

  deletePost(req, res) {
    Profile.findOne({user: req.user.id})
    .then(profile => {
      Post.findById(req.params.id)
      .then(post => {
        if(post.user.toString() !== req.user.id) {
          return res.status(401).json({
            message: 'User not authorized'
          });
        }
        post.remove()
        .then(() => res.json({success: true}))
        .catch(err => res.status(404).json({msg: 'Post not found'}))
      })
      .catch(err => res.status(404).json(err))
    })
    .catch(err => res.status(404).json(err))
  },

  likeAPost(req, res) {
    Profile.findOne({user: req.user.id})
    .then(profile => {
      Post.findById(req.params.id)
      .then(post => {
        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
          return res.status(400).json({msg: 'User already liked this post'});
        }
        post.likes.unshift({ user: req.user.id });
        post.save()
        .then(post => res.json(post))
        .catch(err => res.status(404).json(err))
      })
      .catch(err => res.status(404).json(err))
    })
    .catch(err => res.status(404).json(err))
  },

  unLikeAPost(req, res) {
    Profile.findOne({user: req.user.id})
    .then(profile => {
      Post.findById(req.params.id)
      .then(post => {
        if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
          return res.status(400).json({msg: 'User have not yet liked this post'});
        }
        const removeIndex = post.likes.map(el => el.user.toString()).indexOf(req.user.id);
        post.likes.splice(removeIndex, 1);
        post.save()
        .then(post => res.json(post))
        .catch(err => res.status(404).json(err))
      })
      .catch(err => res.status(404).json(err))
    })
    .catch(err => res.status(404).json(err))
  },

  addComment(req, res) {
    console.log('addComment -->', req.params, req.body)
    const { errors, isValid } = validatePostInput(req.body);
    if(!isValid) {
      return res.status(400).json(errors);
    }
    Post.findById(req.params.post_id)
    .then(post => {
      const newComment = {
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.body.id
      };
      post.comments.unshift(newComment);
      post.save()
      .then(post => res.json({
        msg: 'ok',
        saved: post
      }))
      .catch(err => res.status(404).json(err))
    })
    .catch(err => res.status(404).json(err))
  },

  deleteComment(req, res) {
    console.log('delete comment -->', req.params)
    Post.findById(req.params.post_id)
    .then(post => {
      const removeIndex = post.comments.map(el => el.id.toString()).indexOf(req.params.comment_id)
      post.comments.splice(removeIndex, 1)
      post.save()
      .then(post => res.json(post))
      .catch(err => res.status(404).json(err))
    })
    .catch()
  }

}