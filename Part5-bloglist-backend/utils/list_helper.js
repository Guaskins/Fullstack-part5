const dummy = (blogs) => {
  return blogs.length
}

const totalLikes = (blogs) => {
  if (blogs.length === 0){
    return 0
  }
  else if (blogs.length === 1){
    return blogs[0].likes
  }
  else {
    return Math.max.apply(Math, blogs.map(function(o) { return o.likes }))
  }
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0){
    return 0
  }
  else {
    const favoriteBlog = blogs.reduce(
      (prev, current) => {
        return prev.likes >= current.likes ? prev : current
      }
    )
    const returnBlog = {
      title: favoriteBlog.title,
      author: favoriteBlog.author,
      likes: favoriteBlog.likes
    }
    return returnBlog
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}