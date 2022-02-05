import React, { useState, useEffect, useRef  } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

import LoginForm from './components/Forms/LoginForm'
import BlogForm from './components/Forms/BlogForm'
import Togglable from './components/Togglable'

import './App.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [infoMessage, setInfoMessage] = useState(null)

  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)

    try {
      const userSend = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBloglistAppUser', JSON.stringify(userSend)
      ) 
      setUser(userSend)
      setUsername('')
      setPassword('')

    } catch (exception) {
        setErrorMessage('Wrong credentials')
        setTimeout(() => {
          setErrorMessage(null)
      }, 5000)
    }

  }

  const loginForm = () => (
    //<Togglable buttonLabel="log in">
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />
    //</Togglable>
  )

  const setLogout = () => {
    window.localStorage.removeItem('loggedBloglistAppUser')
    setUser(null)
    setUsername('')
    setPassword('')
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()

    try { 
      await blogService
        .create(blogObject)
          .then(returnedBlog => {
            console.log(returnedBlog)
            setBlogs(blogs.concat(returnedBlog.data))

            setInfoMessage("Added the new blog " + returnedBlog.data.title + " - " + returnedBlog.data.author)
              setTimeout(() => {
                setInfoMessage(null)
            }, 5000)

        })
    } catch (exception) {
        setErrorMessage(exception.message)
        setTimeout(() => {
          setErrorMessage(null)
      }, 5000)
    }
  }

  const blogForm = () => (
    <Togglable buttonLabel="create new blog" ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  const toggleLikesOf = async id => {
    const blog = blogs.find(n => n.id === id)
    const changedBlog = { ...blog, likes: blog.likes + 1 }
  
    await blogService
      .update(id, changedBlog)
      .then(returnedBlog => {
        setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))

        setInfoMessage(
          `Blog '${blog.title}' - you like it !!!`
        )
        setTimeout(() => {
          setInfoMessage(null)
        }, 5000)

      })
      .catch(error => {
        setErrorMessage(
          `Blog '${blog.title}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })    
  }
  
  const toggleRemoveOf = async (id) => {
    const blog = blogs.find(n => n.id === id)

    if (window.confirm(`Remove blog ${blog.title} by ${blog.author} ?`)){
      await blogService
        .remove(id)
        .then(response => {
          setBlogs(blogs.filter((blog) => blog.id !== id))
          setInfoMessage(
            `Blog '${blog.title}' removed!!`
          )
          setTimeout(() => {
            setInfoMessage(null)
          }, 5000)
        })
        .catch(error => {
          console.log(error)
          setErrorMessage(
            //`Blog '${blog.title}' was already removed from server`
            error.message
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }
  }

  return (
    <div>
      <h1>blogs</h1>
      {errorMessage !== null ?
        <Notification message={errorMessage} typeError="1" /> :
        <Notification message={infoMessage} typeError="0" />
      }

      {user === null ?
        loginForm() :
        <div>
          <div><b>{user.name}</b> logged-in <button id='logout' onClick={() => setLogout()}>log out</button></div>
          <p></p>
          {blogForm()}
          <p></p>
          <div>
            {blogs
              .sort((min, max) => max.likes - min.likes)
              .map((blog) =>
                <Blog 
                  key={blog.id} 
                  blog={blog} 
                  userid={user.id} 
                  toggleLikes={() => toggleLikesOf(blog.id)}
                  toggleRemove={() => toggleRemoveOf(blog.id)}
                />
            )}
          </div>
          <p></p>
        </div>
      }

    </div>
  )
}

export default App