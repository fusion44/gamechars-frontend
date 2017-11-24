import React, { Component } from "react"
import CharacterList from "./CharacterList"
import { withRouter } from "react-router"
import { withStyles } from "material-ui/styles"
import Button from "material-ui/Button"
import AddIcon from "material-ui-icons/Add"

const styles = {
  fab: {
    position: "fixed",
    right: 45,
    bottom: 45,
    zIndex: 9999
  }
}

class Home extends Component {
  render() {
    const { classes } = this.props
    return (
      <div>
        <CharacterList />
        <div className={classes.fab}>
          <Button
            fab
            color="primary"
            aria-label="add"
            onClick={() => this.props.history.push("/character/add")}
          >
            <AddIcon />
          </Button>
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(withRouter(Home))
