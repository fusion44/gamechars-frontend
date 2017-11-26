import {
  SIGN_UP_USER_SUCCESS,
  SIGN_UP_USER_ERROR,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
  LOGOUT_USER_SUCCESS,
  AUTH_API_ENDPOINT
} from "../constants"

export const signUpUserSuccess = userData => ({
  type: SIGN_UP_USER_SUCCESS,
  userData
})

export const signUpUserError = errorData => ({
  type: SIGN_UP_USER_ERROR,
  errorData
})

export const loginUserSuccess = userData => ({
  type: LOGIN_USER_SUCCESS,
  userData
})

export const loginUserError = errorData => ({
  type: LOGIN_USER_ERROR,
  errorData
})

export const logoutUserSuccess = () => ({
  type: LOGOUT_USER_SUCCESS
})

export const signUpUser = userData => dispatch => {
  return fetch(`${AUTH_API_ENDPOINT}/signup`, {
    method: "POST",
    body: JSON.stringify(userData),
    credentials: "include"
  }).then(response => {
    return checkResponse(response, dispatch)
  })
}

export const loginUser = userData => dispatch => {
  return fetch(`${AUTH_API_ENDPOINT}/login`, {
    method: "POST",
    body: JSON.stringify(userData),
    credentials: "include"
  }).then(response => {
    return checkResponse(response, dispatch)
  })
}

export const logoutUser = userData => dispatch => {
  fetch(`${AUTH_API_ENDPOINT}/logout`, {
    method: "POST",
    credentials: "include"
  }).then(response => {
    if (response.status === 200) {
      dispatch(logoutUserSuccess())
    } else {
      console.log(
        "Error while trying to logout user, please try again",
        response
      )
    }
  })
}

const checkResponse = (response, dispatch) => {
  return new Promise((resolve, reject) => {
    switch (response.status) {
      case 200:
        // all OK, user was logged in
        var dec = new TextDecoder()
        response.body
          .getReader()
          .read()
          .then(res => {
            return dispatch(
              loginUserSuccess({
                status: "logged_in",
                userData: JSON.parse(dec.decode(res.value))
              })
            )
          })
          .then(res => resolve(res))
        break
      case 400:
        // 400 Sent by server when signup data is invalid
        dec = new TextDecoder()
        response.body
          .getReader()
          .read()
          .then(res => {
            return dispatch(
              signUpUserError({
                status: "error",
                errorMessages: JSON.parse(dec.decode(res.value))
              })
            )
          })
          .then(res => reject(res))
        break
      case 401:
      case 500:
        // 401 Sent by the server if username and/or password is wrong
        // 500 Sent by the server if a server error occurred
        dec = new TextDecoder()
        response.body
          .getReader()
          .read()
          .then(res => {
            return dispatch(
              loginUserError({
                status: "error",
                errorMessage: JSON.parse(dec.decode(res.value)).message
              })
            )
          })
          .then(res => reject(res))
        break
      default:
        break
    }
  })
}
