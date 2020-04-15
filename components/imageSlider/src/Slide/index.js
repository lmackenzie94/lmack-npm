import React from 'react';
import './slide.css';

const Slide = ({ image, active, index }) => {
  const transformStyles = {
    transform: active ? `translateX(-${index * 100}%)` : null,
    opacity: active ? 1 : 0,
  };

  return (
    <div data-component-slide style={transformStyles}>
      <img src={image} data-component-slide-image alt="" />
    </div>
  );
};

export default Slide;
