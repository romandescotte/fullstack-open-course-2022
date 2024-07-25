// Load the full build.
const _ = require('lodash')

const dummy = (blogs) => {
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

const blogs = [

  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },  
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },   
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  },  
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  }
]

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
  const getMaxAuthor = _.forEach(likesPerAuthor, (value, key) => {
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


