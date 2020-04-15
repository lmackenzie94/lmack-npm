"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = useForm;

var _react = require("react");

var _formSerialize = _interopRequireDefault(require("form-serialize"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function useForm(callback) {
  var formRef = (0, _react.useRef)();
  var shouldDoSubmit = (0, _react.useRef)(false);

  var _useState = (0, _react.useState)({}),
      _useState2 = _slicedToArray(_useState, 2),
      inputs = _useState2[0],
      setInputs = _useState2[1];

  var serializeAllInputs = function serializeAllInputs() {
    if (!formRef.current) {
      return;
    }

    var serializedInputs = (0, _formSerialize["default"])(formRef.current, {
      hash: true
    });
    setInputs(function (prevInputs) {
      return _objectSpread({}, prevInputs, {}, serializedInputs);
    });
  };

  var handleSubmit = function handleSubmit(event) {
    if (event) {
      event.preventDefault();
    }

    shouldDoSubmit.current = true;
    serializeAllInputs();
    return false;
  };

  (0, _react.useEffect)(function () {
    if (shouldDoSubmit.current) {
      callback.call(null, inputs);
      shouldDoSubmit.current = false;
    }
  }, [inputs, callback]);

  var handleInputChange = function handleInputChange(event) {
    // prevents the keys of the event object from being nullified after the callback/event-handler has finished executing.
    // browsers use the same event object in memory for all events
    event.persist();
    setInputs(function (prevInputs) {
      return _objectSpread({}, prevInputs, _defineProperty({}, event.target.name, event.target.value));
    });
  };

  return {
    handleSubmit: handleSubmit,
    handleInputChange: handleInputChange,
    inputs: inputs,
    formRef: formRef
  };
}

useForm.PropTypes = {
  callback: _propTypes["default"].func
};