import React, { Component } from "react";
import Icon from "../components/Icon";
import PropTypes from "prop-types";
import "./Video.css";
import cameraclick from "../sounds/cameraclick.mp3";

class Video extends Component {

    state = {
      stream: null,
      curtainAnimation: {
        curtainOpen: false,
        curtainClose: false
      }
    }

    static propTypes = {
      photoCanvasElem: PropTypes.object,
      isHelpBtnActive: PropTypes.bool,
      isFormSubmitted: PropTypes.bool
    }

    componentWillReceiveProps(nextProps) {
      if(nextProps.isFormSubmitted === true)
        this.handleCameraOff();
    }

    handleCameraOn = () => {
      //If stream is true then set up video and start playing
      if(!this.state.stream) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
          .then((stream) => {
            this.setState({ stream });
            this.video.srcObject = stream;
            this.video.play();
          });
      } else {
        return;
      }
      //Call curtain open animation
      this.setState({
        curtainAnimation: {
          curtainOpen: true,
          curtainClose: false
        }
      });
    };
    //Plays click sound and paints the current video frame to the photo canvas
    handleTakingPhoto = () => {
      this.handlePlaySound();
      const canvas = this.props.photoCanvasElem;
      const context = canvas.getContext("2d");
      context.drawImage(this.video, 0, 0, canvas.width, canvas.height);
    }
    //Checks if video is streaming (on), if so then set stream to false to turn off video
    handleCameraOff = () => {
      const stream = this.state.stream;
      if(stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
        this.setState({
          stream: null
        });
      } else {
        return;
      }
      //Call cutain close animation
      this.setState({
        curtainAnimation: {
          curtainOpen: false,
          curtainClose: true
        }
      });
    }
    //Plays camera click sound
    handlePlaySound = () => {
      const audio = this.cameraClick;
      audio.play();
    }

    render() {

      const { curtainAnimation, stream } = this.state;

      return(
        <div className="video-container">
          <audio
            ref={audio => this.cameraClick = audio}>
            <source
              src={cameraclick}
              type="audio/mp3">
            </source>
          </audio>
          <div className="video">
            <div className="curtain-container">
              <div id="left-curtain"
                className={curtainAnimation.curtainOpen ? "slide-left" : " " ||
                            curtainAnimation.curtainClose ? "slide-left-close" : " " }>
              </div>
              <div id="right-curtain"
                className={curtainAnimation.curtainOpen ? "slide-right" : " " ||
                            curtainAnimation.curtainClose ? "slide-right-close" : " " }>
              </div>
              <video
                id="video"
                ref={video => this.video = video}
              />
            </div>
            <div className="video-btns-container">
              <button
                className="video-stop-btn"
                onClick={this.handleCameraOff}>
                <Icon
                  name="stop"
                  color={`004f7c`}
                  size={30}
                />
              </button>
              <button
                className="take-photo-btn"
                onClick={this.handleTakingPhoto}
                disabled={stream ? false : true}>
                <Icon
                  name="take-photo"
                  color={`004f7c`}
                  size={30}
                />
              </button>
              <button
                id="play-btn"
                className="video-play-btn"
                onClick={this.handleCameraOn}>
                <Icon
                  name="play"
                  color={`004f7c`}
                  size={30}
                />
              </button>
            </div>
          </div>
          <span id="span-left"
            className={this.props.isHelpBtnActive ? "help-show-left" : ""}>
              Turns off the web camera
          </span>
          <span id="span-top"
            className={this.props.isHelpBtnActive ? "help-show-top" : ""}>
              Say cheese! Take that perfect picture here
          </span>
          <span id="span-right"
            className={this.props.isHelpBtnActive ? "help-show-right" : ""}>
              Turns on your web camera
          </span>
        </div>
      );
    }
}
export default Video;