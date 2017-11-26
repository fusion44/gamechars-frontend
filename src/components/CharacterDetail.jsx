import React, { Component } from "react"
import { withRouter } from "react-router"
import { connect } from "react-redux"
import gql from "graphql-tag"
import { graphql } from "react-apollo"
import { withStyles } from "material-ui/styles"
import Card, {
  CardHeader,
  CardMedia,
  CardContent,
  CardActions
} from "material-ui/Card"
import IconButton from "material-ui/IconButton"
import Typography from "material-ui/Typography"
import FavoriteIcon from "material-ui-icons/Favorite"
import ShareIcon from "material-ui-icons/Share"
import CloseIcon from "material-ui-icons/Close"
import Link from "material-ui-icons/Link"
import DeleteForever from "material-ui-icons/DeleteForever"
import { GAME_CHARS_QUERY } from "./CharacterList"
import Snackbar from "material-ui/Snackbar"

const styles = theme => ({
  root: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    marginTop: 8
  },
  card: {
    maxWidth: 700
  },
  media: {
    height: 500
  },
  flexGrow: {
    flex: "1 1 auto"
  }
})

export const GAME_CHAR_QUERY = gql`
  query getGameCharacters($charID: ID!) {
    gameCharacter(id: $charID) {
      id
      name
      debutGame
      releaseYear
      img
      desc
      wiki
      public
      owner
    }
  }
`

export const DELETE_GAME_CHAR_QUERY = gql`
  mutation deleteGameCharacter($charID: ID!) {
    removeCharacter(id: $charID) {
      op
      count
    }
  }
`

class CharacterDetail extends Component {
  state = {
    snackBarOpen: false
  }

  onDeleteCharacter(event) {
    const { characterId } = this.props.match.params
    this.props
      .deleteGameCharacter({
        variables: { charID: characterId },
        update: (store, { data }) => {
          // Remove character from store, if the server deleted one
          if (data.removeCharacter.count > 0) {
            const gcQuery = store.readQuery({ query: GAME_CHARS_QUERY })
            gcQuery.gameCharacters = gcQuery.gameCharacters.filter(char => {
              return characterId === char.id ? null : char
            })
            store.writeQuery({ query: GAME_CHARS_QUERY, data: gcQuery })
          }
        }
      })
      .then(({ data }) => {
        data.removeCharacter.count > 0
          ? this.props.history.push("/")
          : this.setState({ snackBarOpen: true })
      })
      .catch(err => console.log("Error: ", err)) // Show a error message to the user
  }

  handleRequestClose(event, reason) {
    if (reason === "clickaway") {
      return
    }

    this.setState({ snackBarOpen: false })
  }

  render() {
    const { classes } = this.props
    const { loading } = this.props.data

    if (loading) return <div>Loading ...</div>
    else
      return (
        <div className={classes.root}>
          <Card className={classes.card}>
            <CardHeader
              title={this.props.charName}
              subheader={`First seen in ${this.props
                .charDebutGame}, released in ${this.props.charReleaseYear}`}
            />
            <CardMedia
              className={classes.media}
              image={this.props.charImg}
              title={this.props.charName}
            />
            <CardContent>
              <Typography component="p">{this.props.charDesc}</Typography>
            </CardContent>
            <CardActions disableActionSpacing>
              <IconButton aria-label="Add to favorites">
                <FavoriteIcon />
              </IconButton>
              <IconButton aria-label="Share">
                <ShareIcon />
              </IconButton>
              <IconButton
                onClick={this.onDeleteCharacter.bind(this)}
                aria-label="Delete Forever"
              >
                <DeleteForever />
              </IconButton>
              <div className={classes.flexGrow} />
              <IconButton
                href={this.props.charWiki}
                target="blank"
                aria-label="More Info"
              >
                <Link />
              </IconButton>
            </CardActions>
          </Card>
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left"
            }}
            open={this.state.snackBarOpen}
            autoHideDuration={6000}
            onRequestClose={this.handleRequestClose.bind(this)}
            SnackbarContentProps={{
              "aria-describedby": "message-id"
            }}
            message={<span id="message-id">Error during delete</span>}
            action={[
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                className={classes.close}
                onClick={this.handleRequestClose.bind(this)}
              >
                <CloseIcon />
              </IconButton>
            ]}
          />
        </div>
      )
  }
}

const mapStateToProps = ({ auth }, ownProps) => {
  if (ownProps.data.gameCharacter) {
    let charImg = ownProps.data.gameCharacter.img.startsWith("http")
      ? ownProps.data.gameCharacter.img
      : process.env.PUBLIC_URL + "/images/" + ownProps.data.gameCharacter.img

    return {
      auth,
      charName: ownProps.data.gameCharacter.name,
      charDebutGame: ownProps.data.gameCharacter.debutGame,
      charReleaseYear: ownProps.data.gameCharacter.releaseYear,
      charImg,
      charDesc: ownProps.data.gameCharacter.desc,
      charWiki: ownProps.data.gameCharacter.wiki,
      charIsPublic: ownProps.data.gameCharacter.public,
      charOwner: ownProps.data.gameCharacter.owner
    }
  } else {
    return {}
  }
}

let withPrevious = connect(mapStateToProps)(CharacterDetail)

withPrevious = graphql(GAME_CHAR_QUERY, {
  options: props => ({
    variables: { charID: props.match.params.characterId }
  })
})(withPrevious)

withPrevious = graphql(DELETE_GAME_CHAR_QUERY, {
  name: "deleteGameCharacter"
})(withPrevious)

withPrevious = withStyles(styles)(withPrevious)
export default withRouter(withPrevious)
