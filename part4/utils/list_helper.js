// Load the full build.
const _ = require('lodash')

const dummy = () => {
  return 1
}


const totalLikes = (blogs) => {

  return blogs.length === 1
    ? blogs[0].likes
    : blogs.reduce((sum, blog) => sum + blog.likes,0)
}

const favoriteBlog = (blogs) => {

  const maxLikes = Math.max(...blogs.map(blog => blog.likes))
  return blogs.length >= 1
    ? blogs.find(blog => blog.likes === maxLikes)
    : undefined
}

/*
otra forma de hacerlo con reduce:
const maxLikes = blogs.reduce((accumulator, current) => {
  return accumulator.id > current.id ? accumulator : current;
});
*/



const mostBlogs = blogs => {
  const blogsByAuthor = _.countBy(blogs, blog => {
    return blog.author
  })

  const maxBlog = _.reduce(blogsByAuthor, (result, value, key) => {
    return value > blogsByAuthor[result] ? key : result
  }, _.keys(blogsByAuthor)[0] )

  return {
    author: maxBlog,
    blogs: blogsByAuthor[maxBlog]
  }
}

const mostLikes = blogs => {
  const blogsByAuthor = _.groupBy(blogs, 'author')
  const likesPerAuthor = _.mapValues(blogsByAuthor, author => {
    const likesSum = _.sumBy(author, i => {
      return i.likes
    })
    return likesSum
  })

  let maxAuthor = ''
  let maxLikes = 0
  //getMaxAuthor
  _.forEach(likesPerAuthor, (value, key) => {
    if(value > maxLikes) {
      maxLikes = value
      maxAuthor = key
    }
  })
  return {
    author: maxAuthor,
    likes: maxLikes
  }
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}


