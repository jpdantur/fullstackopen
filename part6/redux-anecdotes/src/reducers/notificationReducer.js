let timeoutID = 0

const reducer = (state = '', action) => {
    switch (action.type) {
        case 'SET_NOTIFICATION':
            return action.message
        case 'CLEAR_NOTIFICATION':
            return ''
        default:
            return state
    }
}

export const setNotification = (message, seconds) => {
    return dispatch => {
        dispatch({
            type: 'SET_NOTIFICATION',
            message
        })
        clearTimeout(timeoutID)
        timeoutID = setTimeout(() => {
            dispatch({
                type: 'CLEAR_NOTIFICATION'
            })
        }, seconds*1000)
    }
}

export default reducer