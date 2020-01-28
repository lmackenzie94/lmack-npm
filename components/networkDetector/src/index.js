import React, { useState, useEffect, useRef } from 'react';
import { useSpring, useTransition, config, a } from 'react-spring';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

// NEED TO HANDLE FETCH IN IE

function NetworkDetector({
  errorMessage = `Internet connection lost`,
  reconnectMessage = `Internet has reconnected`,
  autoHide,
  preventClose = false
}) {
  const [isDisconnected, setIsDisconnected] = useState(false);
  const [messageIsOpen, setMessageIsOpen] = useState(true);
  const webPing = useRef(0);

  useEffect(() => {
    handleConnectionChange();
    window.addEventListener('online', handleConnectionChange);
    window.addEventListener('offline', handleConnectionChange);
    return () => {
      window.removeEventListener('online', handleConnectionChange);
      window.removeEventListener('offline', handleConnectionChange);
    };
  }, []);

  useEffect(() => {
    if (autoHide && isDisconnected) {
      setTimeout(() => {
        setMessageIsOpen(false);
      }, 5000);
    }
  }, [autoHide, isDisconnected]);

  const handleConnectionChange = () => {
    const condition = navigator.onLine ? 'online' : 'offline';
    if (condition === 'online') {
      webPing.current = setInterval(() => {
        fetch('//google.com', {
          mode: 'no-cors'
        })
          .then(() => {
            setIsDisconnected(false);
            setMessageIsOpen(true);
            clearInterval(webPing.current);
          })
          .catch(() => setIsDisconnected(true));
      }, 2000);
      return;
    }
    setIsDisconnected(true);
    setMessageIsOpen(true);
  };

  const messageTransition = useTransition(isDisconnected, null, {
    config: { ...config.gentle, clamp: true },
    from: { y: `scaleY(0)` },
    enter: { y: `scaleY(1)` },
    leave: { y: `scaleY(0)`, delay: 5000 }
  });

  const messageSpring = useSpring({
    opacity: messageIsOpen ? 1 : 0
  });

  return messageTransition.map(
    ({ item, key, props }) =>
      item && (
        <a.div
          key={key}
          data-network-container
          style={
            messageIsOpen
              ? {
                  transform: props.y,
                  transformOrigin: `top`
                }
              : { ...messageSpring }
          }
        >
          <p data-network-message>
            {!isDisconnected ? reconnectMessage : errorMessage}
          </p>
          {!preventClose && (
            <button
              data-network-close-button
              onClick={() => setMessageIsOpen(false)}
            >
              <FontAwesomeIcon data-network-close-button-icon icon={faTimes} />
            </button>
          )}
        </a.div>
      )
  );
}

export default NetworkDetector;
