import React, { Component } from "react";
import Canvas from "./components/Canvas";
import Video from "./components/Video";
import Form from "./components/Form";
import HelpButton from "./components/HelpButton";
import "./App.css";

class App extends Component {

  state = {
    isHelpBtnActive: false,
    isFormSubmitted: false,
    photoCanvasElem: null,
    textCanvasElem: null
  }
  //If true cmponents will reset and trigger animations in the Canvas component
  setFormStatus = (status) => {
    this.setState({
      isFormSubmitted: status
    }, () => this.state.formSubmitted);
  }
  //Gets canvas elements from the Canvas component for the Form component to combine and convert to image
  setCanvasElems = (textCanvas, photoCanvas, stampImg, postMarkImg) => {
    this.setState({
      textCanvasElem: textCanvas,
      photoCanvasElem: photoCanvas
    });
    this.stampImgElem = stampImg;
    this.postMarkImgElem = postMarkImg;
  }
  //If true it trigger help spans to appear
  setHelpBtnState = (status) => {
    this.setState({
      isHelpBtnActive: status
    });
  }

  render() {
    const { photoCanvasElem, videoElem, textCanvasElem, isFormSubmitted, isHelpBtnActive } = this.state;
    return (
      <div className="App">
        <Form
          photoCanvasElem={photoCanvasElem}
          textCanvasElem={textCanvasElem}
          stampImgElem={this.stampImgElem}
          postMarkImgElem={this.postMarkImgElem}
          isHelpBtnActive={isHelpBtnActive}
          isFormSubmitted={this.setFormStatus}
        />
        <HelpButton
          btnElems={this.state.helpBtnOpen}
          getHelpBtnState={this.setHelpBtnState}
          isFormSubmitted={isFormSubmitted}
        />
        <Video
          photoCanvasElem={photoCanvasElem}
          isHelpBtnActive={isHelpBtnActive}
          isFormSubmitted={isFormSubmitted}
        />
        <Canvas
          videoElem={videoElem}
          canvasElem={this.setCanvasElems}
          imageElem={this.getImageElem}
          isHelpBtnActive={isHelpBtnActive}
          isFormSubmitted={isFormSubmitted}
        />

      </div>
    );
  }
}

export default App;

