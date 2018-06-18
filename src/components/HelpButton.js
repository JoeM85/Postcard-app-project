import React, { Component } from "react";
import PropTypes from "prop-types";
import "./HelpButton.css";

class HelpButton extends Component {

    state = {
      active: false
    }

    static propTypes = {
      getHelpBtnState: PropTypes.func,
      isFormSubmitted: PropTypes.bool
    }
    //Sending the help button's state to the App for other components to render their respective help spans if true
    sendHelpState = () => {
      const helpBtnActive = this.state.active;
      this.props.getHelpBtnState(helpBtnActive);
    }
    //Setting state then calling a function to set a state of the App
    handleBtnAnimation = () => {
      const currentStateOpen = this.state.active;
      this.setState({
        active: !currentStateOpen
      }, ()=> this.sendHelpState());
    }

    render() {
      const { active } = this.state;
      return (
        <div className="help-btn-container">
          <button
            id="help-btn"
            onClick={this.handleBtnAnimation}
            disabled={this.props.isFormSubmitted ? true: false}>
            {active ? "X": "Help"}
          </button>
          <div
            id="help-btn-active"
            className={active ? "btn-open" : "btn-closed"}
          />
        </div>
      );
    }
}
export default HelpButton;
