import { useEffect, useRef } from 'react';

/**
 * @function useOutsideClickDetect
 * @param {function} callback - a callback to execute when a click is detected outside the wrapper
 * @returns {array} - returns an array of refs for the wrapper and click area [wrapper, clickArea]
 */
export default function useOutsideClickDetect(callback) {
  const wrapper = useRef();
  const clickArea = useRef();

  const handleClickOutside = (e) => {
    if (wrapper.current && !wrapper.current.contains(e.target)) {
      callback();
    }
  };

  let handler;
  useEffect(() => {
    if (!wrapper.current) return;
    if (clickArea.current) {
      handler = clickArea.current.addEventListener('click', handleClickOutside);
      clickArea.current.addEventListener('click', handleClickOutside);
    } else {
      handler = document.addEventListener('click', handleClickOutside);
      document.addEventListener('click', handleClickOutside);
    }
    return () => handler;
  }, [handler, handleClickOutside]);

  return {
    wrapper,
    clickArea,
  };
}
