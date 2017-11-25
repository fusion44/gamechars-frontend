import React, { Component } from "react"
import { connect } from "react-redux"
import { withRouter } from "react-router"
import gql from "graphql-tag"
import { graphql } from "react-apollo"
import { withStyles } from "material-ui/styles"
import Typography from "material-ui/Typography"
import Button from "material-ui/Button"
import TextField from "material-ui/TextField"
import Input, { InputLabel } from "material-ui/Input"
import { MenuItem } from "material-ui/Menu"
import { FormControl } from "material-ui/Form"
import Select from "material-ui/Select"
import Switch from "material-ui/Switch"
import { GAME_CHARS_QUERY } from "./CharacterList"
import { FormControlLabel } from "material-ui/Form"

const styles = theme => ({
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
})

export const ADD_GAME_CHAR_MUTATION = gql`
  mutation addGameCharacter(
    $name: String!
    $debutGame: String!
    $releaseYear: Int!
    $img: String!
    $desc: String!
    $wiki: String!
    $isPublic: Boolean!
    $owner: String!
  ) {
    addCharacter(
      char: {
        name: $name
        debutGame: $debutGame
        releaseYear: $releaseYear
        img: $img
        desc: $desc
        wiki: $wiki
        public: $isPublic
        owner: $owner
      }
    ) {
      id
      name
      img
    }
  }
`

class CharacterAdd extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: "",
      debutGame: "",
      releaseYear: 2017,
      img: "http://via.placeholder.com/500x500",
      desc: "",
      wiki: "",
      isPublic: true
    }
  }

  getYearItems() {
    let items = []
    for (let i = 2020; i > 1970; i--) {
      items.push(
        <MenuItem key={i} value={i}>
          {i}
        </MenuItem>
      )
    }
    return items
  }

  handleSubmit() {
    const {
      name,
      debutGame,
      releaseYear,
      img,
      desc,
      wiki,
      isPublic
    } = this.state
    const { userName } = this.props.auth.userData

    this.props
      .addCharacter(
      name,
      debutGame,
      parseInt(releaseYear, 10),
      img,
      desc,
      wiki,
      isPublic,
      userName
      )
      .then(({ data }) => {
        this.props.history.push("/")
      })
      .catch(error => {
        console.log("there was an error submitting the character: ", error)
      })
  }

  render() {
    const { classes } = this.props
    return (
      <form className={classes.root}>
        <Typography type="display3" gutterBottom>
          Add a character
        </Typography>

        <TextField
          className={classes.tf}
          label="Name"
          value={this.state.name}
          onChange={({ target: { value: name } }) => this.setState({ name })}
        />
        <TextField
          className={classes.tf}
          label="Debut Game"
          value={this.state.debutGame}
          onChange={({ target: { value: debutGame } }) =>
            this.setState({ debutGame })}
        />

        <FormControl className={classes.tf}>
          <InputLabel htmlFor="release-select">Age</InputLabel>
          <Select
            value={this.state.releaseYear}
            onChange={event =>
              this.setState({ releaseYear: event.target.value })}
            input={<Input id="release-select" />}
          >
            {this.getYearItems()}
          </Select>
        </FormControl>

        <TextField
          className={classes.tf}
          label="Image URL"
          value={this.state.img}
          onChange={({ target: { value: img } }) => this.setState({ img })}
        />

        <TextField
          className={classes.tf}
          label="Character Description"
          multiline
          value={this.state.desc}
          onChange={event => {
            this.setState({ desc: event.target.value })
          }}
          margin="normal"
        />

        <TextField
          className={classes.tf}
          label="Wiki URL"
          value={this.state.wiki}
          onChange={({ target: { value: wiki } }) => this.setState({ wiki })}
        />

        <FormControlLabel
          control={
            <Switch
              checked={this.state.isPublic}
              onChange={event => {
                this.setState({ isPublic: event.target.checked })
              }}
              aria-label="Public"
            />
          }
          label="Public"
        />

        <div>
          <Button onClick={this.handleSubmit.bind(this)}>Add</Button>
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

export const withMutation = graphql(ADD_GAME_CHAR_MUTATION, {
  props: ({ mutate }) => ({
    addCharacter: (
      name,
      debutGame,
      releaseYear,
      img,
      desc,
      wiki,
      isPublic,
      owner
    ) =>
      mutate({
        variables: {
          name,
          debutGame,
          releaseYear,
          img,
          desc,
          wiki,
          isPublic,
          owner
        },
        update: (store, { data: { addCharacter } }) => {
          /* 
            { data: { addCharacter } } unpacks "data.data.addCharacter"
            addCharacter holds the results from addCharacter mutation defined here
          */

          // Read the query object from the store which holds all data fetched until now
          const gcQuery = store.readQuery({ query: GAME_CHARS_QUERY })
          // Insert the new data
          gcQuery.gameCharacters.push(addCharacter)
          // Write the query back to the store
          store.writeQuery({ query: GAME_CHARS_QUERY, data: gcQuery })
        }
      })
  })
})

const mapStateToProps = ({ auth }) => {
  return { auth: auth.auth }
}

export default withStyles(styles)(
  withRouter(withMutation(connect(mapStateToProps)(CharacterAdd)))
)
