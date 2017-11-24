import React from "react"
import { connect } from "react-redux"
import { withRouter } from "react-router"
import { withStyles } from "material-ui/styles"
import { logoutUser } from "../actions"
import AppBar from "material-ui/AppBar"
import Toolbar from "material-ui/Toolbar"
import Typography from "material-ui/Typography"
import AppToolbarAvatar from "./AppToolbarAvatar"

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

  handleLogoutClick = () => {
    this.props.dispatch(logoutUser())
  }

  render() {
    const { status, userData } = this.props.auth.auth
    const { classes } = this.props
    return (
      <AppBar className={classes.root} position="fixed">
        <Toolbar>
          <Typography type="title" color="inherit" className={classes.flex}>
            Game Character Info
          </Typography>
          <AppToolbarAvatar
            isLoggedIn={status === "logged_in"}
            signedInUser={{ userName: userData.userName }}
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
