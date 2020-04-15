import React from 'react';
import './arrow.css';

const Arrow = ({ prev, onClick }) => {
  const arrowSymbol = prev ? 'P' : 'N';

  const arrowStyles = {
    right: !prev && `15px`,
    left: prev && `15px`,
  };

  return (
    <button data-arrow onClick={onClick} style={arrowStyles}>
      {arrowSymbol}
    </button>
  );
};

export default Arrow;
