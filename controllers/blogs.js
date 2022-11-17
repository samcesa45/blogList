const jwt = require('jsonwebtoken')
const express = require('express')
const Blog =require('../models/blog.js')
const User = require('../models/user.js')

const blogRouter = express.Router()

blogRouter.get('/', async (req, res, next) => {
 try {
    const blogs = await Blog.find({}).populate('user',{username:1,name:1})
    res.json(blogs)
 } catch (exception) {
    next(exception)
 }
  
})

blogRouter.get('/:id', async (req,res,next) => {
    const id = req.params.id
   try {
    const blog = await Blog.findById(id)
   
    if(blog){
        res.json(blog)
    }else{
        res.status(404).end()
    }
   } catch (exception) {
     next(exception)
   }
   
})

const getTokenFrom = req => {
    const authorization = req.get('authorization')
    if(authorization && authorization.toLowerCase().startsWith('bearer ')){
        return authorization.substring(7)
    }
    return null
}

blogRouter.post('/', async (req,res,next) => {
    const body = req.body 
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if(!decodedToken.id){
        return res.status(401).json({error:'token missing or invalid'})
    }

    const user = await User.findById(decodedToken.id)
    const blog = new Blog ({
        title:body.title,
        author:body.author,
        url:body.url,
        likes:body.likes || 0,
        user:user._id
    })

    try {
        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        res.status(201).json(savedBlog)
    } catch (exception) {
        next(exception)
    }
})

blogRouter.delete('/:id', (req,res,next) => {
    Blog.findByIdAndRemove(req.params.id)
    .then(() => {
        res.status(204).end()
    })
    .catch(error => next(error))
})

blogRouter.put('/:id', async (req,res,next) => {
    const id = req.params.id 
    const body = req.body 

    const blog = {
      title:body.title,
      author:body.author,
      url:body.url,
      likes:body.likes
    }

 try {
    const updatedBlog = await Blog.findByIdAndUpdate(id, blog, {new:true, runValidators:true, context:'query'})
    res.json(updatedBlog)
 } catch (exception) {
    next(exception)
 }
   
    
})


module.exports = blogRouter