import React, { useState, useRef } from 'react';
import { useSpring, a } from 'react-spring';

// DEFAULT COMPONENTS
function DefaultRenderer() {
  return (
    <div data-accordion-renderer>
      <h3>{`Pass an 'Item Renderer' to Accordion to customize this space`}</h3>
      <a href="https://google.ca">Google</a>
    </div>
  );
}

function DefaultContainer({ children }) {
  return <div data-accordion-container>{children}</div>;
}

function DefaultButton({ open, data, labelkey, ...rest }) {
  return (
    <button
      data-accordion-button
      {...rest}
      aria-expanded={open ? `true` : `false`}
    >
      <h3 data-accordion-button-title>{data[labelkey]}</h3>
    </button>
  );
}

function ItemWrapper({ open, id, children }) {
  const innerHeightRef = useRef();
  const outerHeightRef = useRef();

  const spring = useSpring({
    maxHeight: open ? innerHeightRef.current.offsetHeight : 0,
    onRest: () => {
      if (open) {
        outerHeightRef.current.style.maxHeight = `none`;
        outerHeightRef.current.style.height = `auto`;
      }
    }
  });
  const visibilitySpring = useSpring({
    visibility: open ? 'visible' : 'hidden',
    delay: open ? 0 : 700
  });
  return (
    <a.div
      data-accordion-wrapper-outer
      id={id}
      // need visibility:hidden when closed so elements inside are not tabbable
      style={{ ...spring, ...visibilitySpring }}
      ref={outerHeightRef}
    >
      <div data-accordion-wrapper-inner ref={innerHeightRef}>
        {children}
      </div>
    </a.div>
  );
}

// ACCORDION
function Accordion({
  Container = DefaultContainer,
  ButtonComponent = DefaultButton,
  ItemRenderer = DefaultRenderer,
  allowMultipleOpen = false,
  labelkey = `Label goes here`,
  items
}) {
  const [activeIdx, setActiveIdx] = useState([]);
  const [hoveredIdx, setHoveredIdx] = useState([]);

  const close = idx => {
    setActiveIdx(activeIdx.filter(i => i !== idx));
  };

  const open = idx => {
    if (allowMultipleOpen) {
      setActiveIdx(prevIdx => [...prevIdx, idx]);
    } else {
      let newActiveIdx = [idx];
      setActiveIdx(newActiveIdx);
    }
  };

  const handleClick = idx => {
    if (activeIdx.includes(idx)) {
      close(idx);
    } else {
      open(idx);
    }
  };

  const handleHover = idx => {
    if (hoveredIdx.includes(idx)) return;
    setHoveredIdx(prevIdx => [...prevIdx, idx]);
  };

  const handleKeyPress = (e, idx) => {
    switch (e.key) {
      case `Escape`:
        if (activeIdx.includes(idx)) {
          close(idx);
        }
        break;
      default:
        break;
    }
  };

  return (
    <Container>
      {items.map((item, idx) => (
        <React.Fragment key={`button-${idx}`}>
          <ButtonComponent
            open={activeIdx.includes(idx)}
            data={{ idx, ...item }}
            labelkey={ButtonComponent === DefaultButton ? labelkey : null}
            onClick={() => {
              handleClick(idx);
            }}
            onMouseEnter={() => handleHover(idx)}
            onKeyDown={e => handleKeyPress(e, idx)}
            data-test-id="accordion-button"
          />
          <ItemWrapper open={activeIdx.includes(idx)}>
            <ItemRenderer data={item} loadImage={hoveredIdx.includes(idx)} />
          </ItemWrapper>
        </React.Fragment>
      ))}
    </Container>
  );
}

export default Accordion;
