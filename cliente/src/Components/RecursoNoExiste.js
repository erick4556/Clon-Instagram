import React from "react";
import Main from "../Components/Main";
import { Link } from "react-router-dom";

export default function RecursoNoExiste({ mensaje }) {
  return (
    <Main center>
      <div>
        <h2 className="RecursoNoexiste__mensaje">{mensaje}</h2>
        <p className="RecursoNoEciste__link-container">
          Ir al <Link to="/">Home</Link>
        </p>
      </div>
    </Main>
  );
}
