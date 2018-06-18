import React from 'react';
import PropTypes from 'prop-types';
import Icons from '../images/sprites.svg';

const Icon = ({ name, color, size }) => {
  return (
    <svg className={`icon icon-${name}`} fill={`#${color}`} width={size} height={size}>
      <use xlinkHref={`${Icons}#icon-${name}`} />
    </svg>
  );
};

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string,
  size: PropTypes.number,
};

export default Icon;
