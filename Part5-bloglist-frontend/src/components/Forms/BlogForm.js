import React, {useState} from 'react' 

const BlogForm = ({ createBlog }) => {
  const [newtitle, setTitle] = useState('') 
  const [newauthor, setAuthor] = useState('')
  const [newurl, setUrl] = useState('')

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setUrl(event.target.value)
  }

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newtitle,
      author: newauthor,
      url: newurl,
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>Create a new blog</h2>

      <form onSubmit={addBlog}>
        <div>
          Title: <input id='title' value={newtitle} onChange={handleTitleChange}/>
        </div>
        <div>
          Author: <input id='author' value={newauthor} onChange={handleAuthorChange}/>
        </div>
        <div>
          URL: <input id='url' value={newurl} onChange={handleUrlChange}/>
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm