const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')

const helper = require('./test_helper')

const Blog = require('../models/blog')
const User = require('../models/user')



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

      test('if the likes property is missing, it will default to the value 0', async () => {
        const blogNoLikes = {
          title: 'When Likes are missing',
          author: 'Tester Von Testeroff',
          url: 'www.exampleURLThatIHopeDoesntWorkPart4.com',
        }

        await api
          .post('/api/blogs')
          .send(blogNoLikes)
          .expect(201)
          .expect('Content-Type', /application\/json/)

        const response = await helper.blogsInDb()
        const result = response.find((blog =>
          blog.title === 'When Likes are missing'
        ))

        assert.strictEqual(result.likes, 0)
      })

      test('if the title property is missing, it will return 400', async () => {
        const blogNoTitle = {
          author: 'Tester Von Testeroff',
          url: 'www.exampleURLThatIHopeDoesntWorkPart4.com',
          likes: 10,
        }

        await api
          .post("/api/blogs")
          .send(blogNoTitle)
          .expect(400)

        const result = await helper.blogsInDb()

        assert.strictEqual(result.length, helper.initialBlogs.length)
      })

      test('if the url property is missing, it will return 400', async () => {
        const blogNoURL = {
          title: 'When URL missing',
          author: 'Tester Von Testeroff',
          likes: 10,
        }

        await api
          .post("/api/blogs")
          .send(blogNoURL)
          .expect(400)

        const result = await helper.blogsInDb()

        assert.strictEqual(result.length, helper.initialBlogs.length)
      })

})

describe('deletion of a blog', () => {
  test('succeeds with code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

    const contents = blogsAtEnd.map(r => r.title)
    assert(!contents.includes(blogToDelete.title))
  })
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
          username: 'tester007',
          name: 'Tester Von Testeroff',
          password: 'verysekret',
        }
    
        await api
          .post('/api/users')
          .send(newUser)
          .expect(201)
          .expect('Content-Type', /application\/json/)
    
        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
    
        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
      })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()
    
        const newUser = {
          username: 'root',
          name: 'Superuser',
          password: 'salainen',
        }
    
        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)
    
        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('expected `username` to be unique'))
    
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
      })
})