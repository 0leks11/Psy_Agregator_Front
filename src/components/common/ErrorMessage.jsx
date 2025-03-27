import React from 'react';
const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return (
    <div style={{ color: 'red', border: '1px solid red', padding: '10px', margin: '10px 0', borderRadius: '4px' }}>
      {message}
    </div>
  );
};
export default ErrorMessage;