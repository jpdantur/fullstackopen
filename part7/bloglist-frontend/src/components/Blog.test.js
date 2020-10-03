import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {

  const blog = {
    title: 'The test blog',
    author: 'Juan',
    likes: 0,
    url: 'www.blog.com',
    user: {
      username: 'jpdantur'
    }
  }
  const mockUpdate = jest.fn()
  let component

  beforeEach(() => {
    component = render(
      <Blog blog={blog} username='jpdantur' updateBlog={mockUpdate}/>
    )
  })

  test('Renders title and author but not details on default', () => {
    expect(component.container.querySelector('.blog')).toHaveTextContent('The test blog Juan')
    expect(component.container.querySelector('.blogTitle')).not.toHaveStyle('display: none')
    expect(component.container.querySelector('.blogDetails')).toHaveStyle('display: none')
  })

  test('Renders title, author and details when "view" button is clicked', () => {
    const button = component.getByText('view')
    fireEvent.click(button)

    expect(component.container.querySelector('.blogTitle')).not.toHaveStyle('display: none')
    expect(component.container.querySelector('.blogDetails')).not.toHaveStyle('display: none')
  })

  test('Calls update button twice if like button is clicked twice', () => {
    const button = component.getByText('like')
    fireEvent.click(button)
    fireEvent.click(button)

    expect(mockUpdate.mock.calls).toHaveLength(2)
  })
})