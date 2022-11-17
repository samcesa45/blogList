const dummy = (blogs) => {
  return blogs.length = 1
}

const totalLikes =(blogs) => {
  return blogs.length && blogs.reduce((acc,curr) => {
  if(curr.likes){
   return acc + curr.likes
  }else{
    return 0
  }
  },0)
}

const favoriteBlogs = (blogs) => {
  return blogs.reduce((prev,curr) =>{
    return prev.likes > curr.likes ? prev : curr
  })
}

const authorWithMostBlogs = (blogs) => {
  const result =blogs.length && blogs.reduce((prevBlog,currBlog) => {
    const knownBlog = prevBlog.find((found) => {
      return found.author === currBlog.author
    })

    if(!knownBlog){
      return prevBlog.concat({author:currBlog.author,blogs:1})
    }

    knownBlog.blogs++
    return prevBlog
  },[])
  
  return result.reduce((a,b) => a.blogs > b.blogs ? a : b)
}

const authorWithMostLikes = (blogs) => {
  const result = blogs.reduce((prevBlog,currBlog) => {
    const knownBlog = prevBlog.length &&  prevBlog.find((found) => {
     return found.author === currBlog.author
    })
  
    if(!knownBlog){
      return prevBlog.concat({author:currBlog.author,likes:currBlog.likes})
    }

    knownBlog.likes += currBlog.likes
    return prevBlog
  },[])

  return result.reduce((a,b) => a.likes > b.likes ? a : b)
}




  
module.exports = {
  dummy,
  totalLikes,
  favoriteBlogs,
  authorWithMostBlogs,
  authorWithMostLikes
}