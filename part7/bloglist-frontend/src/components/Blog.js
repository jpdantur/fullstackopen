import React, { useState } from 'react'
const Blog = ({ blog, updateBlog, removeBlog, username }) => {
  const [visible, setVisible] = useState(false)
  const showWhenVisible = { display: visible ? '' : 'none' }
  const showWhenUserIsLogged = {
    display: username === blog.user.username ? '' : 'none',
  }
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div style={blogStyle} className='blog'>
      <div className='blogTitle'>
        {blog.title} {blog.author}
        <button onClick={() => setVisible(!visible)}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      <div style={showWhenVisible} className='blogDetails'>
        <div>{blog.url}</div>
        <div>
          likes {blog.likes}{' '}
          <button
            onClick={() => {
              updateBlog(blog.id, {
                likes: blog.likes + 1,
              })
            }}
          >
            like
          </button>
        </div>
        <div>{blog.user.name}</div>
        <div>
          <button
            style={showWhenUserIsLogged}
            onClick={() => {
              if (
                window.confirm(`Remove blog ${blog.title} by ${blog.author}`)
              ) {
                removeBlog(blog.id)
              }
            }}
          >
            remove
          </button>
        </div>
      </div>
    </div>
  )
}

export default Blog
