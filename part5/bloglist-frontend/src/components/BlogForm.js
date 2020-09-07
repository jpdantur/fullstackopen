import React, { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setURL] = useState('')
  const handleCreate = (event) => {
    event.preventDefault()
    createBlog({
      title,
      author,
      url,
    })
    setTitle('')
    setAuthor('')
    setURL('')
  }
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleCreate}>
        <div>
          title:
          <input
            id="title"
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => {
              setTitle(target.value)
            }}
          />
        </div>
        <div>
          author:
          <input
            id="author"
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => {
              setAuthor(target.value)
            }}
          />
        </div>
        <div>
          url:
          <input
            id="url"
            type="text"
            value={url}
            name="URL"
            onChange={({ target }) => {
              setURL(target.value)
            }}
          />
        </div>
        <button id="create-blog" type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm
