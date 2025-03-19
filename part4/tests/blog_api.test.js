const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
    {
        title: 'When We Test.',
        author: 'Tester Von Testeroff',
        url: 'www.exampleURLThatIHopeDoesntWork.com',
        likes: 5,
    },
    {
        title: 'Test We Must.',
        author: 'Testeressa Von Testeroff',
        url: 'www.exampleURLThatIHopeDoesntWorkPart2.com',
        likes: 10,
    },
  ]

describe('blog list test', () => {

    test('blogs are returned as json', async () => {
        await api
          .get('/api/blogs')
          .expect(200)
          .expect('Content-Type', /application\/json/)
      })
      
      beforeEach(async () => {
        await Blog.deleteMany({})
        let blogObject = new Blog(initialBlogs[0])
        await blogObject.save()
        blogObject = new Blog(initialBlogs[1])
        await blogObject.save()
      })

      test('there are two blogs', async () => {
        const response = await api.get('/api/blogs')
      
        assert.strictEqual(response.body.length, initialBlogs.length)
      })

      test('the first blog is made by Tester Von Testeroff', async () => {
        const response = await api.get('/api/blogs')
      
        const authors = response.body.map(e => e.author)
        assert(authors.includes('Tester Von Testeroff'))
      })

      after(async () => {
        await mongoose.connection.close()
      })
})