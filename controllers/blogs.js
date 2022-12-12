
const express = require('express')
const Blog =require('../models/blog.js')
const User = require('../models/user.js')
const auth = require('../middleware/auth.js')

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


blogRouter.post('/',auth, async (req,res,next) => {
    try {
    const body = req.body 
    const user = await User.findById(req.user.id)


    if(body.title === 'undefined'){
        return res.status(400).json({error:'title missing'})
    }
    const blog = new Blog ({
        title:body.title,
        author:body.author,
        url:body.url,
        likes:body.likes || 0,
        user:user._id
    })

 
        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        res.status(201).json(savedBlog)
    } catch (exception) {
        next(exception)
    }
})

blogRouter.delete('/:id',auth, async (req,res,next) => {
 try {
    
    const userid = req.user.id 
    const blog = await Blog.findById(req.params.id)

    if(blog.user.toString() === userid.toString()) {
        await Blog.findByIdAndRemove(req.params.id)
        res.status(204).end()
    }else{
        res.status(404).end()
    }
 } catch (exception) {
    next(exception)
 }
  
   
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