import React from 'react'
import { useSelector } from 'react-redux'
import { useRouteMatch } from 'react-router-dom' 


const BlogDetails = ({ updateBlog }) => {
    const blogs = useSelector(state => state.blogs)
    const match = useRouteMatch("/blogs/:id")
    const blog = match ? blogs.find(blog => blog.id === match.params.id) : null
    if (!blog){
        return null
    }
    return (
        <div>
            <h1>{blog.title} {blog.author}</h1>
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
        <div>added by {blog.user.name}</div>
        </div>
    )
}

export default BlogDetails