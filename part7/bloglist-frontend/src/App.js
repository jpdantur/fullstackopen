import React, { useState, useEffect, useRef } from 'react'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import BlogDetails from './components/BlogDetails'
import UserList from './components/UserList'
import User from './components/User'
import { useDispatch, useSelector } from 'react-redux'
import { setSuccessNotification, setErrorNotification } from './reducers/notificationReducer'
import { createBlog, updateBlog, getAllBlogs, commentBlog} from './reducers/blogReducer'
import { login, logout } from './reducers/loginReducer'
import { Switch, Route, Link } from 'react-router-dom'
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Button,
  TextField,
  Toolbar,
  AppBar
} from '@material-ui/core'

const App = () => {
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.login)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getAllBlogs())
  }, [dispatch])

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
      <Container>
        <div>
          <Notification />
          <h2>Log in to application</h2>
          <form onSubmit={handleLogin}>
            <div>
              <TextField
                id="username"
                type="text"
                value={username}
                name="Username"
                label="username"
                onChange={({ target }) => setUsername(target.value)}
              />
            </div>
            <div>
              <TextField
                id="password"
                type="password"
                value={password}
                name="Password"
                label="password"
                onChange={({ target }) => setPassword(target.value)}
              />
            </div>
            <Button variant="contained" color="primary" type="submit">login</Button>
          </form>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <div>
        <Notification />
        <div>
        <AppBar position="static">
          <Toolbar>
          <Button color="inherit" component={Link} to="/">blogs</Button>
          <Button color="inherit" component={Link}to="/users">users</Button>
          <em>{user.name} logged in</em>
          <Button color="inherit"
            onClick={() => {
              dispatch(logout())
            }}
          >
            logout
          </Button>
          </Toolbar>
        </AppBar>
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
            <TableContainer component={Paper}>
              <Table>
                <TableBody>
            {blogs.map((blog) => (
            <TableRow key={blog.id}>
            <TableCell>
            <Link to={`/blogs/${blog.id}`}>{blog.title} {blog.author}</Link>
            </TableCell>
          </TableRow>
            ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Route>
        </Switch>
      </div>
    </Container>
  )
}

export default App
