import { useEffect, useRef } from 'react';

export default function useOutsideClickDetect(callback) {
  const wrapper = useRef();
  const clickArea = useRef();

  const handleClickOutside = e => {
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
    clickArea
  };
}
