const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  
  return blogs.length === 1 
  ? blogs[0].likes 
  : blogs.reduce((sum, blog) => sum + blog.likes,0)
}


module.exports = {
  dummy,
  totalLikes
}
