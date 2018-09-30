import React, { Component } from "react";
import PropTypes from "prop-types";
import Message from "./Message";
import "./Form.css";
import axios from "axios";

class Form extends Component {

    state = {
      email: "",
      image: "",
      isSubmitted: false,
      message: ""
    }

    static propTypes = {
      photoCanvasElem: PropTypes.object,
      textCanvasElem: PropTypes.object,
      isHelpBtnActive: PropTypes.bool,
      stampImgElem: PropTypes.object,
      postMarkImgElem: PropTypes.object,
      isFormSubmitted: PropTypes.func
    }
    //Gets users inputed email address
    handleInputChange = (e) => {
      this.setState({
        email: e.target.value
      });
    }
    //Make axios call with email and image data. Set message apon response
    handleSendPostCard = () => {
      const email = this.state.email;
      const image = this.state.image;
      axios.post('/send', {
        email,
        image
      })
        .then((res) => {
          if(!res.error){
            this.setState({
              message: res.data.message
            });
          } else {
            this.setState({
              message: res.data.error
            });
          }
        })
        .catch(() => {
          this.setState({
            message: "Server error, please try again"
          });
        });
      this.handleFormStateReset();
    }
    //Call functions to first combine canvases, then send the isSubmitted true state up for
    //other components to reset.
    handleSubmit = (e) => {
      e.preventDefault();
      this.handleCreateImage();
      this.setState({
        isSubmitted: true
      }, ()=>{
        const status = this.state.isSubmitted;
        this.props.isFormSubmitted(status);
      });
    };

    handleCreateImage = () => {
      //Get all the canvas elements
      const photoCanvas = this.props.photoCanvasElem;
      const textCanvas = this.props.textCanvasElem;
      const stampImg = this.props.stampImgElem;
      const postMarkImg = this.props.postMarkImgElem;
      //Make post mark image visible
      postMarkImg.style.display = "inline";
      //Create new canvas element and set height and width
      const finalCanvas = document.createElement('canvas');
      const ctx = finalCanvas.getContext("2d");
      const width = 640;
      const height = 480;
      finalCanvas.width = width;
      finalCanvas.height = height;
      //Draw each canvas on to the final canvas
      ctx.drawImage(photoCanvas, 0, 0, width, height);
      ctx.drawImage(textCanvas, 0, 0, width, height);
      //Add stamp image to stack if user added it
      if (stampImg.classList.contains("stamped")) {
        ctx.drawImage(stampImg, 580, 20);
      };
      ctx.drawImage(postMarkImg, 450, 20);
      this.handleCurrentDate(finalCanvas);
      //Convert final canvas into a image
      const data = finalCanvas.toDataURL("image/jpeg");
      //Hide post mark image again after the final canvas is converted
      postMarkImg.style.display = "none";
      //Create a new image and set the img's src to be the converted final canvas
      const image = new Image();
      image.src = data;
      this.setState({
        image: data
      }, () => this.handleSendPostCard());
    }
    //Resets the state after the form has been submitted
    handleFormStateReset = () => {
      setTimeout((status) => {
        this.setState({
          image: "",
          email: "",
          isSubmitted: false
        });
        this.props.isFormSubmitted(status);
      }, 4000);
    }
    //Gets current day and month and paints to the final canvas before the it's converted into a image
    handleCurrentDate = (canvas) => {
      const dateCanvas = canvas;
      const ctx = dateCanvas.getContext('2d');
      ctx.font = "Bold 15px Arial";
      ctx.fillStyle = "black";
      let today = new Date();
      let day = today.getDate();
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "August", "Sep", "Oct", "Nov", "Dec"];
      let month = today.getMonth() + 1;
      monthNames.forEach(function(name, index) {
        if(index + 1 === month) month = name;
      });
      /*switch(month) {
        case 1:
          month = "Jan";
          break;
        case 2:
          month = "Feb";
          break;
        case 3:
          month = 'Mar';
          break;
        case 4:
          month = "Apr";
          break;
        case 5:
          month = "May";
          break;
        case 6:
          month = "June";
          break;
        case 7:
          month = "July";
          break;
        case 8:
          month = "Aug";
          break;
        case 9:
          month = "Sep";
          break;
        case 10:
          month = "Oct";
          break;
        case 11:
          month = "Nov";
          break;
        case 12:
          month = "Dec";
          break;
        default:
          month = "Jan";
      }
      */
      if (day < 10) day = `0${day}`;
      today = `${month} ${day}`;
      ctx.fillText(today, 458, 60);
    }

    render() {
      const { isSubmitted, message, email } = this.state;
      return (
        <div className="form-container">
          <form onSubmit={this.handleSubmit}>
            <input
              placeholder="Enter Email Address"
              type="email"
              id="email-input"
              value={email}
              onChange={this.handleInputChange}
              required={true}
            />
            <button
              id="email-btn"
              type="submit"
              disabled={isSubmitted}
            >
              Send Post Card
            </button>
            <span className={this.props.isHelpBtnActive ? "help-show-bottom": ""}>
              Enter a email address then click the button. You post card will be sent.
            </span>
          </form>
          <div className="message">
            {isSubmitted ? <Message message={message} /> : " "}
          </div>
        </div>
      );
    }
}

export default Form;