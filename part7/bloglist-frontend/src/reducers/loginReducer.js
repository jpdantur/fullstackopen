import blogService from '../services/blogs'

const reducer = (state = null, action) => {
    switch (action.type) {
        case 'LOGIN':
            return action.user
        case 'LOGOUT':
            return null
        default:
            return state
    }
}

export const login = (user) => {
    return dispatch => {
          window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
          dispatch({
              type: 'LOGIN',
              user
          })
          blogService.setToken(user.token)
    }
}

export const logout = () => {
    return dispatch => {
        window.localStorage.clear()
        dispatch({
            type: 'LOGOUT'
        })
    }
}

export default reducer