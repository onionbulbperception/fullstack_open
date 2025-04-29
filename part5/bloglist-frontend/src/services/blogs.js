import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.get('/api/blogs', config)
  return response.data
}

const create = async newBlog => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post('/api/blogs', newBlog, config)
  return response.data
}

export default { setToken, getAll, create }