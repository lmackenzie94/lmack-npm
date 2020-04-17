import React, { useState } from 'react';
import SliderContent from './SliderContent';
import Slide from './Slide';
import './slider.css';
import Arrow from './Arrow';

const ImageSlider = ({ slides, width = '600px' }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const numOfImages = slides.length;

  const handleNext = () => {
    if (activeIdx === numOfImages - 1) {
      setActiveIdx(0);
    } else {
      setActiveIdx((prevIdx) => prevIdx + 1);
    }
  };

  const handlePrev = () => {
    if (activeIdx === 0) {
      setActiveIdx(numOfImages - 1);
    } else {
      setActiveIdx((prevIdx) => prevIdx - 1);
    }
  };

  return (
    <div data-component-slider style={{ width: width, maxWidth: '95%' }}>
      <SliderContent>
        {slides.map((slide, idx) => (
          <Slide
            key={`slide-${idx}`}
            index={idx}
            image={slide}
            active={activeIdx === idx}
          />
        ))}
      </SliderContent>
      <Arrow prev onClick={handlePrev} />
      <Arrow onClick={handleNext} />
    </div>
  );
};

export default ImageSlider;
