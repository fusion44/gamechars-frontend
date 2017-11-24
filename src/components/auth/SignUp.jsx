import React, { Component } from "react"
import { connect } from "react-redux"
import { withRouter } from "react-router"
import { signUpUser } from "../../actions"
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

class SignUp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: "",
      email: "",
      pw1: "",
      pw2: "",
      nameError: false,
      emailError: false,
      pwError: false
    }
  }

  validateEmail(email) {
    var re = /\S+@\S+\.\S+/
    return re.test(email)
  }

  validatePasswords() {
    let theyMatch = this.state.pw1 === this.state.pw2
    if (!theyMatch) return false

    // if they match, check length
    return this.state.pw1.length > 5 ? true : false
  }

  handleSubmit() {
    const { name, email, pw1 } = this.state

    let anyError = false
    if (name.length < 2) {
      this.setState({ nameError: true })
      anyError = true
    }
    if (!this.validateEmail(this.state.email)) {
      this.setState({ emailError: true })
      anyError = true
    }
    if (!this.validatePasswords()) {
      this.setState({ pwError: true })
      anyError = true
    }

    if (!anyError) {
      this.props.dispatch(signUpUser({ username: name, email, password: pw1 }))
    }
  }

  render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <Typography type="display3" gutterBottom>
          Sign Up
        </Typography>
        <Typography type="caption" gutterBottom align="center">
          You know you want it.
        </Typography>
        <TextField
          error={this.state.nameError}
          className={classes.tf}
          label="Username"
          minLength={2}
          value={this.state.name}
          onChange={({ target: { value: name } }) => this.setState({ name })}
          helperText="Must be more than one character"
        />
        <TextField
          error={this.state.emailError}
          className={classes.tf}
          label="Email"
          value={this.state.email}
          onChange={({ target: { value: email } }) => this.setState({ email })}
          helperText="Must be a valid email address"
        />
        <TextField
          error={this.state.pwError}
          className={classes.tf}
          label="Password"
          type="password"
          helperText="Your password must be at least 6 characters"
          value={this.state.pw1}
          onChange={({ target: { value: pw1 } }) => this.setState({ pw1 })}
        />
        <TextField
          error={this.state.pwError}
          className={classes.tf}
          label="Repeat Password"
          helperText="Your password must be at least 6 characters"
          type="password"
          value={this.state.pw2}
          onChange={({ target: { value: pw2 } }) => this.setState({ pw2 })}
        />
        <div>
          <Button onClick={this.handleSubmit.bind(this)}>Sign Up</Button>
          <Button
            onClick={() => {
              this.props.history.push("/")
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ auth }, ownProps) {
  return {}
}

export default withStyles(styles)(withRouter(connect(mapStateToProps)(SignUp)))
