import React from "react"
import PropTypes from "prop-types"
import Button from "material-ui/Button"

const AppToolbarAvatar = props => {
  const { userName } = props.signedInUser
  return (
    <div>
      {props.isLoggedIn ? (
        <div>
          Welcome, {userName}
          <Button onClick={props.onLogoutClick}>Logout</Button>
        </div>
      ) : (
        <div>
          <Button onClick={props.onSignUpClick}>SignUp</Button>
          <Button onClick={props.onLoginClick}>Login</Button>
        </div>
      )}
    </div>
  )
}

AppToolbarAvatar.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  signedInUser: PropTypes.shape({
    userName: PropTypes.string.isRequired
  }),
  onSignUpClick: PropTypes.func.isRequired,
  onLoginClick: PropTypes.func.isRequired,
  onLogoutClick: PropTypes.func.isRequired
}

export default AppToolbarAvatar
