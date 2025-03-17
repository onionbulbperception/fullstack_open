// Load the full build.
// https://lodash.com/docs/4.17.15
var _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (!blogs.length) return null

    const favorite = blogs.reduce((max, blog) =>
        blog.likes > max.likes ? blog : max
    )

    return {
        title: favorite.title,
        author: favorite.author,
        likes: favorite.likes
    }
}

const mostLikes = (blogs) => {
    if (!blogs.length) return null

    // https://lodash.com/docs/4.17.15#groupBy
    // https://lodash.com/docs/4.17.15#sumBy
    const groupBlogsByAuthor = _.groupBy(blogs, 'author')
    const likes = _.map(groupBlogsByAuthor, (blogs, author) => ({
        author,
        likes: _.sumBy(blogs, 'likes')
    }))

    // https://lodash.com/docs/4.17.15#maxBy
    return _.maxBy(likes, 'likes')
}

const mostBlogs = (blogs) => {
    if (!blogs.length) return null

    // https://lodash.com/docs/4.17.15#countBy
    const countAuthorsBlogs = _.countBy(blogs, 'author')
    const authorWithMostBlogs = _.maxBy(Object.keys(countAuthorsBlogs), author => countAuthorsBlogs[author])

    return {
        author: authorWithMostBlogs,
        blogs: countAuthorsBlogs[authorWithMostBlogs]
    }
}

module.exports = { 
    dummy, 
    totalLikes, 
    favoriteBlog, 
    mostLikes, 
    mostBlogs,
}