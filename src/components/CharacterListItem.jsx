import React from "react"
import { Link } from "react-router-dom"
import PropTypes from "prop-types"

import "./CharacterListItem.css"

const CharacterListItem = props => {
  let imageURL = props.character.img.startsWith("http")
    ? props.character.img
    : process.env.PUBLIC_URL + "/images/" + props.character.img

  return (
    <div className="CharacterListItem">
      <Link
        to={`/character/view/${props.character.id}`}
        style={{ textDecoration: "none" }}
      >
        <div className="AvatarHeaderText">{props.character.name}</div>
        <img
          className="AvatarImage"
          src={imageURL}
          alt="Avatar of the game character"
        />
      </Link>
    </div>
  )
}

CharacterListItem.propTypes = {
  character: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    img: PropTypes.string.isRequired
  }).isRequired
}

export default CharacterListItem
