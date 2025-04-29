import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState({ message: null, type: ''})

  // Sets the notification message and type
  // The message will be displayed for 5 seconds and then cleared
  const displayNotification = (message, type = 'success') => {
    setNotificationMessage({ message, type })
    setTimeout(() => {
      setNotificationMessage({ message: null, type: '' })
    } , 5000)
  }

  // Checks if user is logged in
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  // Handles blog fetching after user login
  useEffect(() => {
    if (user) {
      const fetchBlogs = async () => {
        try {
          const blogs = await blogService.getAll()
          setBlogs(blogs)
        } catch (error) {
          displayNotification('Failed to fetch blogs', 'error')
          //console.error('Error fetching blogs:', error)
        }
      }
      fetchBlogs()
    }
  }, [user])

  // Handles user login
  // If login is successful, the user is set and the blogs are fetched
  // If login fails, an error message is displayed
  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })

      // Storing user (token) in local storage
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))
      blogService.setToken(user.token)

      setUser(user)
      setUsername('')
      setPassword('')

      
      displayNotification('Login successful')
    } catch (error) {
      displayNotification('Wrong credentials', 'error')
    }

    //console.log('logging in with', username, password)
  }

  // Handles user logout
  // The user is removed from local storage and the user state is set to null
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogUser')
    setUser(null)
  }

  // Handles blog creation
  // If creation is successful, the new blog is added to the blogs state
  // If creation fails, an error message is displayed
  const hangleCreateBlog = async (event) => {
    event.preventDefault()
    try {
      const blogObject = await blogService.create(newBlog)
      setBlogs(blogs.concat(blogObject))
      setNewBlog({ title: '', author: '', url: '' })

      displayNotification(`A new blog ${blogObject.title} by ${blogObject.author} added`)
    } catch (error) {
      displayNotification('Failed to create blog', 'error')
      console.error('Error creating blog:', error)
    }
  }

  const loginForm = () => (
    <div>
      <h2>log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>      
  )

  const blogCreate = () => (
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={hangleCreateBlog}>
        <div>
          Title: <input type="text" value={newBlog.title} onChange={ ({target}) => setNewBlog({ ...newBlog, title: target.value})} />
        </div>
        <div>
        Author: <input type="text" value={newBlog.author} onChange={ ({target}) => setNewBlog({ ...newBlog, author: target.value})} />
        </div>
        <div>
        URL: <input type="text" value={newBlog.url} onChange={ ({target}) => setNewBlog({ ...newBlog, url: target.value})} />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  )

  const blogForm = () => (
    <div>
      {blogs && blogs.length > 0 ? (
        blogs.map(blog => <Blog key={blog.id} blog={blog} />)
      ) : (
        <p>No blogs available</p>
      )}
    </div>
  )

  return (
    <div>
      <h2>blogs</h2>

      <Notification message={notificationMessage.message} type={notificationMessage.type}/>

      { user === null ?
      loginForm() :
      <div>
        <p>{user.name} logged-in <button onClick={handleLogout}>logout</button></p>
        {blogCreate()}
        {blogForm()}
      </div>
    }
    </div>
  )
}

export default App