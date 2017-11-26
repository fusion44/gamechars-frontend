import {
  SIGN_UP_USER_SUCCESS,
  SIGN_UP_USER_ERROR,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
  LOGOUT_USER_SUCCESS
} from "../constants"

export function authReducer(
  state = { auth: { status: "logged_out", userData: { userName: "" } } },
  action
) {
  switch (action.type) {
    case LOGIN_USER_SUCCESS:
    case SIGN_UP_USER_SUCCESS:
      return {
        ...state,
        auth: action.userData
      }

    case SIGN_UP_USER_ERROR:
      return {
        ...state,
        auth: action.errorData
      }
    case LOGIN_USER_ERROR:
      return {
        ...state,
        auth: action.errorData.errorMessage
      }
    case LOGOUT_USER_SUCCESS:
      return {
        ...state,
        auth: { status: "logged_out", userData: { userName: "" } }
      }
    default:
      return state
  }
}
