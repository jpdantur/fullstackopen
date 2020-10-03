import blogService from '../services/blogs'

const reducer = (state = [], action) => {
    switch (action.type) {
        case 'CREATE_BLOG':
            return state.concat(action.blog)
        case 'UPDATE_BLOG':
            return state
            .map(blog => blog.id === action.id ? {...action.blog, user: blog.user } : blog)
            .sort((blog1, blog2) => blog2.likes - blog1.likes)
        case 'REMOVE_BLOG':
            return state.filter(blog => blog.id !== action.id)
        case 'INITIALIZE_BLOGS':
            return action.blogs
        default:
            return state
    }
}

export const createBlog = blog => {
    return async dispatch => {
        const createdBlog = await blogService.create(blog)
        dispatch({
            type: 'CREATE_BLOG',
            blog: createdBlog
        })
    }
}

export const updateBlog = (id, blog) => {
    return async dispatch => {
        const updatedBlog = await blogService.update(id, blog)
        dispatch({
            type: 'UPDATE_BLOG',
            id,
            blog: updatedBlog
        })
    }
}

export const removeBlog = id => {
    return async dispatch => {
        await blogService.remove(id)
        dispatch({
            type: 'REMOVE_BLOG',
            id
        })
    }
}

export const getAllBlogs = () => {
    return async dispatch => {
        const blogs = await blogService.getAll()
        dispatch({
            type: 'INITIALIZE_BLOGS',
            blogs
        })
    }
}

export default reducer