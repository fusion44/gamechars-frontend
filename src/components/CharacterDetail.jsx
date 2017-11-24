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
import Link from "material-ui-icons/Link"

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

class CharacterDetail extends Component {
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
        </div>
      )
  }
}

let withQuery = graphql(GAME_CHAR_QUERY, {
  options: props => ({
    variables: { charID: props.match.params.characterId }
  })
})

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

export default withRouter(
  withStyles(styles)(withQuery(connect(mapStateToProps)(CharacterDetail)))
)
