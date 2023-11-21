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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
