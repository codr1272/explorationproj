import React from "react";
import "./ErrorMessage.scss";

const ErrorMessage = ({ errorMessage }) => {
  return <p className="error">{errorMessage}</p>;
};

export default ErrorMessage;