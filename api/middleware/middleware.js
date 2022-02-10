const { getById, insert } = require('../users/users-model')

const yup = require('yup')

function logger(req, res, next) {
  console.log(`[${req.method}] ${req.url}`)
  next()
}

function validateUserId(req, res, next) {
  // DO YOUR MAGIC
  getById(req.params.id)
  .then(user => {
    if(user){
      req.user = user
      next()
    } else {
      next({status: 404, message: `user ${req.params.id} not found`})
    }
  })
  .catch(next)
}

const userSchema = yup.object({
  name: yup.string().trim().min(3).required('missing required name')
})

const validateUser = async (req, res, next) => {
  // DO YOUR MAGIC
  try{
    const validatedUser = await userSchema.validate(req.body)
    req.body = validatedUser
    next()
  } catch(err) {
    next({status: 400, message: err.message})
  }
}

const postSchema = yup.object({
  text: yup.string().trim().min(4).required('missing required text')
})

const validatePost = async (req, res, next) => {
  // DO YOUR MAGIC
  try{
    const validPost = await postSchema.validate(req.body)
    req.body = validPost
    next()
  } catch(err) {
    next({status: 400, message: err.message})
  }
}

// do not forget to expose these functions to other modules

module.exports = {
  logger,
  validatePost,
  validateUser,
  validateUserId
}