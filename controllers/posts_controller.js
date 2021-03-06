const Post = require('../models/Post');
const Profile = require('../models/Profile');
const validateProfileInput = require('../validation/profile');
const validatePostInput = require('../validation/post');

module.exports= {

// @route  GET api/posts || @desc  Get Posts || Public  
  getAllPosts(req, res) {
    Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ error: 'No Post Found' }))
  },
// @route GET api/posts/:id || @desc Get Post by id || Public  
  getPost(req, res) {
    Post.findById(req.params.id)
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ error: 'No post found for that ID' }))
  },
  // @route POST api/posts|| @desc Create Post|| Secured
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
  // @route DELETE api/posts/:id || @desc Delete Post || Secured 
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
// @route POST api/posts/like/:id || @descLike a Post ||Secured
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
// @route POST api/posts/:id || @desc Unlike a post || Secured 
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
// @route POST api/posts/comment/:post_id || @desc Add comment to post || Secured
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
        user: req.user.id
      };
      post.comments.unshift(newComment);
      post.save()
      .then(post => res.json(post))
      .catch(err => res.status(404).json(err))
    })
    .catch(err => res.status(404).json(err))
  },
  // @route DELETE api/posts/comment/:post_id/:comment_id || @desc Remove comment || Secured
  deleteComment(req, res) {
    console.log('delete comment -->', req.params)
    Post.findById(req.params.post_id)
    .then(post => {
      if(
        post.comments.filter(
          comment => comment._id.toString() === req.params.comment_id
        ).length === 0
      ) {
        return res.status(404).json({msg: 'Comment not found'});
      }
      const removeIndex = post.comments
      .map(el => el.id.toString())
      .indexOf(req.params.comment_id)
      post.comments.splice(removeIndex, 1)
      post.save()
      .then(post => res.json(post))
      .catch(err => res.status(404).json(err))
    })
    .catch(err =>res.status(404).json({
      msg: 'wtf',
      err: err
    }))
  }

}