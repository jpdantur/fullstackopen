import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

test('<BlogForm /> calls the received handler with correct values when submitted', () => {
  const createBlog = jest.fn()

  const component = render(
    <BlogForm createBlog={createBlog} />
  )

  const titleInput = component.container.querySelector('#title')
  const authorInput = component.container.querySelector('#author')
  const urlInput = component.container.querySelector('#url')
  const form = component.container.querySelector('form')

  fireEvent.change(titleInput, { target: { value: 'Blog title' } })
  fireEvent.change(authorInput, { target: { value: 'Blog author' } })
  fireEvent.change(urlInput, { target: { value: 'Blog url' } })

  fireEvent.submit(form)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Blog title')
  expect(createBlog.mock.calls[0][0].author).toBe('Blog author')
  expect(createBlog.mock.calls[0][0].url).toBe('Blog url')

})