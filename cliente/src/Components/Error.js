import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-regular-svg-icons";

const Error = ({ mensaje, hideError }) => {
  if (!mensaje) {
    return null;
  } else {
    return (
      <div className="ErrorContainer" role="alert">
        <div className="Error__inner">
          <span className="block">{mensaje}</span>
          <button className="Error__button" onClick={hideError}>
            <FontAwesomeIcon className="Error__icon" icon={faTimesCircle} />
          </button>
        </div>
      </div>
    );
  }
};

export default Error;
