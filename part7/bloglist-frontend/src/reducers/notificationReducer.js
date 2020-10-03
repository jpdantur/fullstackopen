let timeoutID = 0

const initialState = {
    message: null,
    status: null
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_NOTIFICATION':
            return {message: action.message, status: action.status }
        case 'CLEAR_NOTIFICATION':
            return initialState
        default:
            return state
    }
}

export const setSuccessNotification = (message, seconds) => {
    return dispatch => {
        dispatch({
            type: 'SET_NOTIFICATION',
            message,
            status: 'success'
        })
        clearTimeout(timeoutID)
        timeoutID = setTimeout(() => {
            dispatch({
                type: 'CLEAR_NOTIFICATION'
            })
        }, seconds*1000)
    }
}

export const setErrorNotification = (message, seconds) => {
    return dispatch => {
        dispatch({
            type: 'SET_NOTIFICATION',
            message,
            status: 'error'
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