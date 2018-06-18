import React from "react";
import PropTypes from "prop-types";

const Message = ({ message }) => {
  return (
    <div>
      <h3>{message}</h3>
    </div>
  );
};

Message.propTypes = {
  message: PropTypes.string
};

export default Message;