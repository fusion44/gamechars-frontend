import React, { Component } from "react"
import gql from "graphql-tag"
import { graphql } from "react-apollo"
import CharacterListItem from "./CharacterListItem"

import "./CharacterList.css"

export const GAME_CHARS_QUERY = gql`
  query getGameCharacters {
    gameCharacters {
      id
      name
      img
    }
  }
`

class CharacterList extends Component {
  getCharacterListItems() {
    const { gameCharacters } = this.props.data
    let charItems = []

    if (gameCharacters === undefined) return charItems

    charItems.push(
      gameCharacters.map((ch, index) => (
        <CharacterListItem key={index + 1} character={ch} />
      ))
    )
    return charItems
  }

  render() {
    const { loading } = this.props.data
    if (loading) return <div>Loading ...</div>
    else return <div className="CharacterList">{this.getCharacterListItems()}</div>
  }
}

export const withCharacters = graphql(GAME_CHARS_QUERY, {})
export default withCharacters(CharacterList)
