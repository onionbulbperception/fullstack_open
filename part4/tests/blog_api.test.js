const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())

  await Promise.all(promiseArray)
})

describe('blog list test', () => {
    test('blogs are returned as json', async () => {
        await api
          .get('/api/blogs')
          .expect(200)
          .expect('Content-Type', /application\/json/)
      })

      test('there are two blogs', async () => {
        const response = await api.get('/api/blogs')
      
        assert.strictEqual(response.body.length, helper.initialBlogs.length)
      })

      test('the first blog is made by Tester Von Testeroff', async () => {
        const response = await api.get('/api/blogs')
      
        const authors = response.body.map(e => e.author)
        assert(authors.includes('Tester Von Testeroff'))
      })

      test('the unique identifier property of the blog posts is named id', async () => {
        const response = await api.get('/api/blogs')
      
        assert(Object.keys(response.body[0]).includes('id'))
        assert(!Object.keys(response.body[0]).includes('_id'))
      })

      test('a valid blog can be added', async () => {
        const newBlog = {
          title: 'When Testing Hurts',
          author: 'Testeressa Von Testeroff',
          url: 'www.exampleURLThatIHopeDoesntWorkPart3.com',
          likes: 100,
        }

        await api
          .post('/api/blogs')
          .send(newBlog)
          .expect(201)
          .expect('Content-Type', /application\/json/)

        const response = await helper.blogsInDb()
        assert.strictEqual(response.length, helper.initialBlogs.length + 1)

        const title = response.map(r => r.title)
        assert(title.includes(newBlog.title))
      })

      after(async () => {
        await mongoose.connection.close()
      })
})