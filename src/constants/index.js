// User was registered successfully, set state accordingly
export const SIGN_UP_USER_SUCCESS = "SIGN_UP_USER_SUCCESS"
// Error while registering user, set state accordingly
export const SIGN_UP_USER_ERROR = "SIGN_UP_USER_ERROR"

// User was logged in successfully
export const LOGIN_USER_SUCCESS = "LOGIN_USER_SUCCESS"
// Error while logging in user
export const LOGIN_USER_ERROR = "LOGIN_USER_ERROR"

// User was logged out successfully
export const LOGOUT_USER_SUCCESS = "LOGOUT_USER_SUCCESS"

// Auth API endpoint. Authorization is not part of the GraphQL API
// Authors of GraphQL advise against it.
// https://github.com/graphql/express-graphql/issues/71#issuecomment-257688693
export const AUTH_API_ENDPOINT = "http://localhost:8080/auth"
