import React from "react"
import { connect } from "react-redux"
import { withRouter } from "react-router"
import { withStyles } from "material-ui/styles"
import { logoutUser } from "../actions"
import AppBar from "material-ui/AppBar"
import Toolbar from "material-ui/Toolbar"
import Typography from "material-ui/Typography"
import AppToolbarAvatar from "./AppToolbarAvatar"
import IconButton from "material-ui/IconButton"
import ArrowBack from "material-ui-icons/ArrowBack"

const styles = theme => ({
  root: {
    width: "100%"
  },
  flex: {
    flex: 1
  }
})

class AppToolbar extends React.Component {
  handleLoginClick = () => {
    this.props.history.push("/auth/login")
  }

  handleSignUpClick = () => {
    this.props.history.push("/auth/signup")
  }

  handleBackClick = () => {
    this.props.history.push("/")
  }

  handleLogoutClick = () => {
    this.props.dispatch(logoutUser())
  }

  render() {
    const { status, userData } = this.props.auth.auth
    const { classes } = this.props
    const { pathname } = this.props.history.location

    return (
      <AppBar className={classes.root} position="fixed">
        <Toolbar>
          {pathname === "/" ? (
            undefined
          ) : (
            <IconButton
              className={classes.menuButton}
              color="contrast"
              aria-label="Back"
              onClick={this.handleBackClick.bind(this)}
            >
              <ArrowBack />
            </IconButton>
          )}

          <Typography type="title" color="inherit" className={classes.flex}>
            Game Character Info
          </Typography>
          <AppToolbarAvatar
            isLoggedIn={status === "logged_in"}
            signedInUser={userData ? { userName: userData.userName } : {}}
            onSignUpClick={this.handleSignUpClick.bind(this)}
            onLoginClick={this.handleLoginClick.bind(this)}
            onLogoutClick={this.handleLogoutClick.bind(this)}
          />
        </Toolbar>
      </AppBar>
    )
  }
}

const mapStateToProps = ({ auth }) => {
  return { auth }
}

export default withStyles(styles)(
  withRouter(connect(mapStateToProps)(AppToolbar))
)
