"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = useOutsideClickDetect;

var _react = require("react");

/**
 * @function useOutsideClickDetect
 * @param {function} callback - a callback to execute when a click is detected outside the wrapper
 * @returns {array} - returns an array of refs for the wrapper and click area [wrapper, clickArea]
 */
function useOutsideClickDetect(callback) {
  var wrapper = (0, _react.useRef)();
  var clickArea = (0, _react.useRef)();

  var handleClickOutside = function handleClickOutside(e) {
    if (wrapper.current && !wrapper.current.contains(e.target)) {
      callback();
    }
  };

  var handler;
  (0, _react.useEffect)(function () {
    if (!wrapper.current) return;

    if (clickArea.current) {
      handler = clickArea.current.addEventListener('click', handleClickOutside);
      clickArea.current.addEventListener('click', handleClickOutside);
    } else {
      handler = document.addEventListener('click', handleClickOutside);
      document.addEventListener('click', handleClickOutside);
    }

    return function () {
      return handler;
    };
  }, [handler, handleClickOutside]);
  return {
    wrapper: wrapper,
    clickArea: clickArea
  };
}