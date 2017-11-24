import React, { Component } from "react"
import { createStore, combineReducers, applyMiddleware, compose } from "redux"
import { authReducer } from "./reducers"
import thunk from "redux-thunk"
import persistState from "redux-localstorage"
import "./App.css"
import Home from "./components/Home"
import AppToolbar from "./components/AppToolbar"
import Login from "./components/auth/Login"
import SignUp from "./components/auth/SignUp"
import CharacterAdd from "./components/CharacterAdd"
import CharacterDetail from "./components/CharacterDetail"
import { ApolloProvider } from "react-apollo"
import ApolloClient, { createNetworkInterface } from "apollo-client"
import { Route } from "react-router"
import { BrowserRouter } from "react-router-dom"

import withRoot from "./components/withRoot"

const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: "http://localhost:8080/graphql",
    opts: {
      credentials: "include"
    }
  })
})

// clear apollos store when a user logged in or out
function logoutHelperMiddleware(store) {
  return function(next) {
    return function(action) {
      if (
        action.type === "LOGOUT_USER_SUCCESS" ||
        action.type === "LOGIN_USER_SUCCESS"
      ) {
        client.resetStore().then(res => console.log(res))
      }
      return next(action)
    }
  }
}

const store = createStore(
  combineReducers({
    auth: authReducer,
    apollo: client.reducer()
  }),
  {}, // initial state
  compose(
    applyMiddleware(client.middleware(), thunk, logoutHelperMiddleware),
    persistState("auth", { key: "auth" }),
    // If you are using the devToolsExtension, you can add it here also
    typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== "undefined"
      ? window.__REDUX_DEVTOOLS_EXTENSION__()
      : f => f
  )
)

class App extends Component {
  render() {
    return (
      <ApolloProvider store={store} client={client}>
        <BrowserRouter>
          <div>
            <AppToolbar />
            <div className="Spacer" />
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/character/add">
              <CharacterAdd />
            </Route>
            <Route
              path="/character/view/:characterId"
              component={CharacterDetail}
            />
            <Route exact path="/auth/login">
              <Login />
            </Route>
            <Route exact path="/auth/signup">
              <SignUp />
            </Route>
          </div>
        </BrowserRouter>
      </ApolloProvider>
    )
  }
}

export default withRoot(App)
