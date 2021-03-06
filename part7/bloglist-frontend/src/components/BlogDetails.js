import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouteMatch } from 'react-router-dom' 
import {
  Button
} from '@material-ui/core'


const BlogDetails = ({ updateBlog, commentBlog }) => {
    const blogs = useSelector(state => state.blogs)
    const match = useRouteMatch("/blogs/:id")
    const [comment, setComment] = useState('')
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
                <Button
                onClick={() => {
                updateBlog(blog.id, {
                likes: blog.likes + 1,
              })
            }}
          >
            like
          </Button>
        </div>
        <div>added by {blog.user.name}</div>
        <div>
          <h2>comments</h2>
          <form onSubmit={(event) => {
            event.preventDefault()
            commentBlog(blog.id, comment)
            setComment('')
          }}>
            <input id="comment"
            type="text"
            value={comment}
            name="Comment"
            onChange={({target}) => {
              setComment(target.value)
            }}/>
            <Button id="add-comment" type="submit">add comment</Button>
          </form>
          <ul>
          {blog.comments.map((comment, ix) => (
            <li key={ix}>{comment}</li>
          ))}
          </ul>
        </div>
        </div>
    )
}

export default BlogDetails