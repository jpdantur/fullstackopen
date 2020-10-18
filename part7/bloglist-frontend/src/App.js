import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import BlogDetails from './components/BlogDetails'
import UserList from './components/UserList'
import User from './components/User'
import { useDispatch, useSelector } from 'react-redux'
import { setSuccessNotification, setErrorNotification } from './reducers/notificationReducer'
import { createBlog, updateBlog, removeBlog, getAllBlogs, commentBlog} from './reducers/blogReducer'
import { login, logout } from './reducers/loginReducer'
import { Switch, Route, Link } from 'react-router-dom'

const App = () => {
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.login)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getAllBlogs())
  }, [dispatch])

  const padding = {
    paddingRight: 5
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(login(user))
    }
  }, [dispatch])

  const blogFormRef = useRef()

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password,
      })
      dispatch(login(user))
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
  const handleCommentBlog = async (id, comment) => {
    try {
      dispatch(commentBlog(id, comment))
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
      <div>
        <Link style={padding} to="/">blogs</Link>
        <Link style={padding} to="/users">users</Link>
        {user.name} logged in
        <button
          onClick={() => {
            dispatch(logout())
          }}
        >
          logout
        </button>
      </div>
      <h2>blogs</h2>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={handleCreateBlog} />
      </Togglable>
      <Switch>
        <Route path="/blogs/:id">
          <BlogDetails updateBlog={handleUpdateBlog} commentBlog={handleCommentBlog}/>
        </Route>
        <Route path="/users/:id">
          <User />
        </Route>
        <Route path="/users">
          <UserList />
        </Route>
        <Route path="/">
          {blogs.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              updateBlog={handleUpdateBlog}
              removeBlog={handleRemoveBlog}
              username={user.username}
            />
          ))}
        </Route>
      </Switch>
    </div>
  )
}

export default App
