const Blog = require('../models/blog')

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

const nonExistingId = async () => {
    const blog = new Blog({ title: 'Temp Title', author: 'Temp Author', url: 'www.temp-url.com' })
    await blog.save()
    await blog.deleteOne()

    return blog._id.toString()
}
  
const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = { initialBlogs, nonExistingId, blogsInDb }