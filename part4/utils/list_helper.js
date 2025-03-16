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

module.exports = { dummy, totalLikes, favoriteBlog }