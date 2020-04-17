import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * @function useIntersectionObserver
 * @param {object} options - IntersectionObserver options
 * @returns {array} - returns an array with a ref and isVisible state [ref, isVisible]
 */

export default function useIntersectionObserver(options) {
  const ref = useRef();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // callback is executed when the observer notices an intersection
    // options is optional (root = element/viewport the observed element will intersect; rootMargin = shrinks/grows root element's area; threshold = array b/w 0 and 1 to determine when to trigger the callback)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (options.triggerOnce) {
          setIsVisible(true);
        } else {
          setIsVisible(entry.isIntersecting);
        }
      },
      {
        root: options.root,
        rootMargin: options.rootMargin,
        threshold: options.threshold,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, options]);

  return [ref, isVisible];
}

useIntersectionObserver.PropTypes = {
  options: PropTypes.object,
};
