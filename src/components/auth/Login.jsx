import React, { Component } from "react"
import { connect } from "react-redux"
import { withRouter } from "react-router"
import { loginUser } from "../../actions"
import { withStyles } from "material-ui/styles"
import Typography from "material-ui/Typography"
import Button from "material-ui/Button"
import TextField from "material-ui/TextField"

const styles = {
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxWidth: "100%"
  },
  tf: {
    width: 350,
    marginBottom: 10
  }
}

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: "",
      password: "",
      error: false
    }
  }

  handleSubmit(event) {
    const { username, password } = this.state
    event.preventDefault()

    this.props
      .dispatch(loginUser({ username, password }))
      .then(res => this.props.history.push("/"))
      .catch(err => this.setState({ error: true }))
  }

  render() {
    const { classes } = this.props
    return (
      <form className={classes.root} onSubmit={this.handleSubmit.bind(this)}>
        <Typography type="display3" gutterBottom>
          Login
        </Typography>
        <Typography type="caption" gutterBottom align="center">
          You've started it, now follow through
        </Typography>
        <TextField
          className={classes.tf}
          label="Username"
          value={this.state.username}
          onChange={({ target: { value: username } }) =>
            this.setState({ username })
          }
          error={this.state.error}
        />
        <TextField
          className={classes.tf}
          label="Password"
          value={this.state.password}
          onChange={({ target: { value: password } }) =>
            this.setState({ password })
          }
          type="password"
          error={this.state.error}
        />

        <div>
          <Button type="submit">Login</Button>
          <Button
            onClick={() => {
              this.props.history.push("/")
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    )
  }
}

function mapStateToProps({ auth }, ownProps) {
  return {}
}

export default withStyles(styles)(withRouter(connect(mapStateToProps)(Login)))
