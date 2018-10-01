import React, { Component } from "react";
import PropTypes from "prop-types";
import stamp from "../sounds/stamp.mp3";
import sent from "../sounds/sent.mp3";
import postmark from "../images/post-mark.png";
import postagestamp from "../images/postage-stamp.png";
import "./Canvas.css";

class Canvas extends Component {

    state = {
      addedText: {
        text: '',
        x: 0,
        y:0
      },
      fontColor: "black",
      fontSize: "22",
      fontFamily: "New Times",
      stamped: false
    }

    static propTypes = {
      canvasElem: PropTypes.func,
      imageElem: PropTypes.func,
      isHelpBtnActive: PropTypes.bool,
      isFormSubmitted: PropTypes.bool
    }

    componentDidMount = () => {
      this.sendCanvasElems();
      this.canvasOffset = this.textCanvas.getBoundingClientRect();
      this.offsetX = this.canvasOffset.left;
      this.offsetY = this.canvasOffset.top;
      this.isTextSelected = false;
      this.startX = 0;
      this.startY = 0;
      this.text = {};
    }

    handleSentAnimation = () => {
      //Get canvases
      const textCanvas = this.textCanvas;
      const imageCanvas = this.photoCanvas;
      const stampImg = this.stampImg;
      //Add animation class to canvases
      textCanvas.classList.add("animate");
      imageCanvas.classList.add("animate");
      stampImg.classList.remove("stamped");
      //If post was stamped make visible and add animation class
      if(this.state.stamped) {
        stampImg.classList.add("stamp-visible");
        stampImg.classList.add("animate");
      }
      //Play sent sound and clear canvases and textarea
      this.playSentSound();
      setTimeout(() => {
        this.clearCanvas();
      }, 500);
      //Remove animation classes from canvases
      setTimeout(() => {
        textCanvas.classList.remove("animate");
        imageCanvas.classList.remove("animate");
      }, 2000);
    }

    componentWillReceiveProps(nextProps) {
      if(nextProps.isFormSubmitted === true) {
        this.handleSentAnimation();
      }
    }
    //Play sound during post sent animation
    playSentSound = () => {
      const audio = this.sentAudio;
      audio.play();
    }
    // Get and clear the canvases, textarea and remove class that shows the stamp image and reset stamped state
    clearCanvas = () => {
      const textCanvas = this.textCanvas;
      const photoCanvas = this.photoCanvas;
      const ctxPhoto = photoCanvas.getContext("2d");
      const ctxText = textCanvas.getContext("2d");
      const stamp = this.stampImg;
      stamp.classList.remove("stamped");
      this.setState({
        stamped: false,
        addedText: { text: "" }
      });
      ctxPhoto.clearRect(0, 0, photoCanvas.width, photoCanvas.height);
      ctxText.clearRect(0, 0, textCanvas.width, textCanvas.height);
    }
    //Set addedText state to user input
    handleOnTextChange = (e) => {
      this.setState({
        addedText: { text: e.target.value }
      });
    }
    //Changes canvas font color
    handleColorChange = (e) => {
      const color = e.target.value;
      this.setState({
        fontColor: color
      });
    }
    //Changes canvas font size
    handleFontSizeChange = (e) => {
      const size = e.target.value;
      this.setState({
        fontSize: size
      });
    }
    //Changes canvas font family
    handleFontFamilyChange = (e) => {
      const fontFamily = e.target.value;
      this.setState({
        fontFamily: fontFamily
      });
    }
    //Clears user added text from canvas
    handleOndeleteText = () => {
      const canvas = this.textCanvas;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.setState({
        addedText: { text: '' }
      });
    }
    //Stop dragging if moused out of canvas
    handleCanvasMouseOut = (e) => {
      e.preventDefault();
      this.isTextSelected = false;
    }
    //Get mouse coordinates and see if there is text present
    handleCanvasMouseDown = (e) => {
      this.startX = parseInt(e.clientX - this.offsetX, 10);
      this.startY = parseInt(e.clientY - this.offsetY, 10);
      e.preventDefault();
      if (this.isTextThere(this.startX, this.startY, this.text)) {
        this.textCanvas.classList.add("hover");
        this.isTextSelected = true;
      }
    }
    //Stop redrawing dragged text
    handleCanvasMouseUp = (e) => {
      e.preventDefault();
      this.isTextSelected = false;
    }
    //Get mouse coordinates and if text is being dragged redraw current postion on canvas
    handleCanvasMouseMove = (e) => {
      if (!this.isTextSelected) {
        this.textCanvas.classList.remove("hover");
        return;
      }
      e.preventDefault();
      const mouseX = parseInt(e.clientX - this.offsetX, 10);
      const mouseY = parseInt(e.clientY - this.offsetY, 10);
      const dx = mouseX - this.startX;
      const dy = mouseY - this.startY;
      this.startX = mouseX;
      this.startY = mouseY;
      this.text.x += dx;
      this.text.y += dy;
      this.handleDrawingText();
    }
    handleDrawingText = () => {
      const textCanvas = this.textCanvas;
      const ctx = textCanvas.getContext("2d");
      //Create text object with the user added text and the current postion of the mouse
      const text = {
        ...this.text,
        text: this.state.addedText.text,
        x: typeof this.text.x ==='number' ? this.text.x : 20,
        y: typeof this.text.y ==='number' ? this.text.y : 60,
      };
      //Set up font attributes
      ctx.font = `${this.state.fontSize}px ${this.state.fontFamily}`;
      ctx.fillStyle = this.state.fontColor;
      text.width = ctx.measureText(text.text).width;
      text.height = this.state.fontSize;
      //Clear canvas
      ctx.clearRect(0, 0, textCanvas.width, textCanvas.height);
      //Redraw text on canvas
      ctx.fillText(text.text, text.x, text.y);
      this.text = text;
    }
    //See if mouse is on added text
    isTextThere = (x, y, text) => {
      const textTest = text;
      return (x >= textTest.x && x <= textTest.x + textTest.width &&
                y >= textTest.y - textTest.height && y <= textTest.y);
    }
    //Sends up the canvases and images
    sendCanvasElems = () => {
      const textCanvasElem = this.textCanvas;
      const photoCanvasElem = this.photoCanvas;
      const stampImgElem = this.stampImg;
      const postMarkImgElem = this.postMarkImg;
      this.props.canvasElem(textCanvasElem, photoCanvasElem, stampImgElem, postMarkImgElem);
    }
    //Plays stamp sound when stamp animation occurs
    handleStampSound = () => {
      const audio = this.stampAudio;
      audio.play();
    }
    //Checks if postcard is stamped, if true wait and then play the stamp sound
    handleStampToggle = () => {
      const currentState = this.state.stamped;
      this.setState({ stamped: !currentState });
      if(!this.state.stamped) {
        setTimeout(()=>{
          this.handleStampSound();
        }, 1500);
      }
    };

    render() {
      const { addedText, fontColor, fontSize, fontFamily, stamped } = this.state;

      return (
        <div className="canvas-container">
          <audio
            ref={audio => this.stampAudio = audio}>
            <source
              src={stamp}
              type="audio/mp3">
            </source>
          </audio>
          <audio
            ref={audio => this.sentAudio = audio}>
            <source
              src={sent}
              type="audio/mp3">
            </source>
          </audio>
          <div
            className="canvas-stack">
            <span className={this.props.isHelpBtnActive ? "help-show-left" : ""}>
              Feel free to move your text, just click on it
            </span>
            <canvas
              className="text-canvas"
              ref={canvas => this.textCanvas = canvas}
              onMouseDown={this.handleCanvasMouseDown}
              onMouseMove={this.handleCanvasMouseMove}
              onMouseUp={this.handleCanvasMouseUp}
              onMouseOut={this.handleCanvasMouseOut}
              width={500}
              height={375}
            />
            <canvas
              className="photo-canvas"
              ref={canvas => this.photoCanvas = canvas}
              width={500}
              height={375}
            />
            <img
              id="postage-stamp"
              ref={img => this.stampImg = img}
              className={`postage-stamp ${stamped ? "stamped": ""}`}
              src={postagestamp}
              alt='Postage stamp'
            />
            <img
              ref={img => this.postMarkImg = img}
              className="post-mark"
              src={postmark}
              alt='Post mark'
            />
          </div>
          <div className="btn-container">
            <div>
              <h4 className="message-label">Message</h4>
            </div>
            <select
              className="font-family"
              value={fontFamily}
              onChange={this.handleFontFamilyChange}>
              <option defaultValue className="hide-default-option">Font Style</option>
              <option value="Lobster">Lobster</option>
              <option value="Indie Flower">Indie Flower</option>
              <option value="Permanent Marker">Permanent Marker</option>
              <option value="Satisfy">Satisfy</option>
              <option value="Tangerine">Tangerine</option>
            </select>
            <select
              className="font-color"
              value={fontColor}
              onChange={this.handleColorChange}>
              <option defaultValue className="hide-default-option">Color</option>
              <option value="#070707">Black</option>
              <option value="#dd4444">Red</option>
              <option value="#FFA500">Orange</option>
              <option value="#ba81d3">Purple</option>
              <option value="#3bbb4d">Green</option>
              <option value="#fcfcfc">White</option>
              <option value="#4c70ba">Blue</option>
              <option value="#f4e76e">Yellow</option>
            </select>
            <select
              className="font-size"
              value={fontSize}
              onChange={this.handleFontSizeChange}>
              <option defaultValue className="hide-default-option">Size</option>
              <option value="16">Small</option>
              <option value="32">Medium</option>
              <option value="42">Large</option>
              <option value="52">Xtra-Large</option>
            </select>
            <textarea
              rows="9"
              cols="20"
              placeholder="Type your text here"
              id="added-text"
              resize="none"
              onChange={this.handleOnTextChange}
              value={addedText.text} />
            <button
              id="delete-text-btn"
              onClick={this.handleOndeleteText}
            >
              Erase
            </button>
            <button
              id="add-text-btn"
              onClick={this.handleDrawingText}
            >
              Add
            </button>
            <button
              id="add-stamp-btn"
              disabled={stamped}
              onClick={this.handleStampToggle}>
              {stamped ? "Stamped": "Stamp"}
            </button>
            <span
              className={this.props.isHelpBtnActive ? "help-show-right" : ""}>
                First Style then add your message here. Dont forget to add a stamp
            </span>
          </div>
        </div>
      );
    }
}

export default Canvas;