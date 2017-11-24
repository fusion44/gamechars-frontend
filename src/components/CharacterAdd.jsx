import React, { Component } from "react"
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
import { GAME_CHARS_QUERY } from "./CharacterList"

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
  ) {
    addCharacter(
      char: {
        name: $name
        debutGame: $debutGame
        releaseYear: $releaseYear
        img: $img
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
      img: "http://via.placeholder.com/500x500"
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
    const { name, debutGame, releaseYear, img } = this.state
    this.props
      .addCharacter(name, debutGame, parseInt(releaseYear, 10), img)
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
    addCharacter: (name, debutGame, releaseYear, img) =>
      mutate({
        variables: { name, debutGame, releaseYear, img },
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

export default withStyles(styles)(withRouter(withMutation(CharacterAdd)))
