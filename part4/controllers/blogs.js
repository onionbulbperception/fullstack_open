const blogsRouter = require('express').Router()
const { request, response } = require('express')
const Blog = require('../models/blog')

// Get all
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

// Get by id
blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

// Post
blogsRouter.post('/', async (request, response) => {
    const body = request.body

    const blog = new Blog({
      title: body.title,
      url: body.url,
      likes: body.likes,
      user: body.user
    })

    const savedBlod = await blog.save()
    response.status(201).json(savedBlod)
})

// Put


// Delete
blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

module.exports = blogsRouter