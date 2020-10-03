import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import { useDispatch, useSelector } from 'react-redux'
import { setSuccessNotification, setErrorNotification } from './reducers/notificationReducer'
import { createBlog, updateBlog, removeBlog, getAllBlogs} from './reducers/blogReducer'

const App = () => {
  const blogs = useSelector(state => state.blogs)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getAllBlogs())
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const blogFormRef = useRef()

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password,
      })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setUsername('')
      setPassword('')
      dispatch(setErrorNotification('wrong username or password', 5))
    }
  }

  const handleCreateBlog = async (blog) => {
    try {
      blogFormRef.current.toggleVisibility()
      dispatch(createBlog(blog))
      dispatch(setSuccessNotification(`a new blog added`, 5))
    } catch (exception) {
      dispatch(setErrorNotification('error adding blog',5))
    }
  }

  const handleRemoveBlog = async (id) => {
    try {
      dispatch(removeBlog(id))
      dispatch(setSuccessNotification('blog removed', 5))
    } catch (exception) {
      dispatch(setErrorNotification('error removing blog', 5))
    }
  }
  const handleUpdateBlog = async (id, blog) => {
    try {
      dispatch(updateBlog(id, blog))
      dispatch(setSuccessNotification(`blog updated`, 5))
    } catch (exception) {
      dispatch(setErrorNotification('error updating blog'))
    }
  }

  if (user === null) {
    return (
      <div>
        <Notification />
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              id="username"
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              id="password"
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button id="login-button" type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <Notification />
      <h2>blogs</h2>
      <p>
        {user.name} logged in
        <button
          onClick={() => {
            window.localStorage.clear()
            setUser(null)
          }}
        >
          logout
        </button>
      </p>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={handleCreateBlog} />
      </Togglable>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          updateBlog={handleUpdateBlog}
          removeBlog={handleRemoveBlog}
          username={user.username}
        />
      ))}
    </div>
  )
}

export default App
