const express = require('express');

const userModel = require('./users-model')
const postModel = require('../posts/posts-model')

const {
  validatePost,
  validateUser,
  validateUserId,  
} = require('../middleware/middleware')

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get('/', (req, res, next) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  userModel.get(req.query)
  .then(users => {
    res.status(200).json(users)
  }).catch(next)
});

router.get('/:id', validateUserId ,(req, res, next) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.json(req.user)
});

router.post('/', validateUser, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  userModel.insert(req.body)
  .then(newUser => {
    res.status(201).json(newUser)
  }).catch(next)
});

router.put('/:id', validateUserId , validateUser, (req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  userModel.update( req.params.id , req.body)
  .then(updated => {
    res.status(200).json(updated)
  }).catch(next)

});

router.delete('/:id', validateUserId, (req, res, next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  userModel.getById(req.params.id)
  .then(user => {
    let userInfo = {
      id: user.id,
      name: user.name
    }
   userModel.remove(req.params.id)
  .then(removed => {
    res.status(200).json({id: userInfo.id, name:userInfo.name, message: `User has been removed` })
  }).catch(next)
  }).catch(next)

});

router.get('/:id/posts', validateUserId, (req, res, next) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  userModel.getUserPosts(req.params.id)
  .then(posts => {
    res.status(200).json(posts)
  }).catch(next)
});

router.post('/:id/posts', validateUserId, validatePost, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid

  const post = {...req.body, user_id: req.params.id}

    postModel.insert(post)
    .then(newPost => {
      res.status(210).json(newPost)
    }).catch(next)

});



router.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    custom: 'Something went wrong in the users router',
    message: err.message,
    stack: err.stack
  })
})

// do not forget to export the router

module.exports = router