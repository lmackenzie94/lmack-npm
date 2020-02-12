import { useState, useRef, useEffect } from 'react';
import serialize from 'form-serialize';
import PropTypes from 'prop-types';

export default function useForm(callback) {
  const formRef = useRef();
  const shouldDoSubmit = useRef(false);
  const [inputs, setInputs] = useState({});

  const serializeAllInputs = () => {
    if (!formRef.current) {
      return;
    }
    const serializedInputs = serialize(formRef.current, { hash: true });
    setInputs(prevInputs => ({ ...prevInputs, ...serializedInputs }));
  };

  const handleSubmit = event => {
    if (event) {
      event.preventDefault();
    }

    shouldDoSubmit.current = true;
    serializeAllInputs();
    return false;
  };

  useEffect(() => {
    if (shouldDoSubmit.current) {
      callback.call(null, inputs);
      shouldDoSubmit.current = false;
    }
  }, [inputs, callback]);

  const handleInputChange = event => {
    // prevents the keys of the event object from being nullified after the callback/event-handler has finished executing.
    // browsers use the same event object in memory for all events
    event.persist();
    setInputs(prevInputs => ({
      ...prevInputs,
      [event.target.name]: event.target.value
    }));
  };

  return {
    handleSubmit,
    handleInputChange,
    inputs,
    formRef
  };
}

useForm.PropTypes = {
  callback: PropTypes.func
};
