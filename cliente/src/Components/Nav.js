import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCameraRetro } from "@fortawesome/free-solid-svg-icons";
import { faCompass, faUser } from "@fortawesome/free-regular-svg-icons";

const Nav = ({ usuario }) => {
  return (
    <nav className="Nav">
      <ul className="Nav__links">
        <li>
          <Link to="/" className="Nav__link">
            Clon - Instagram
          </Link>
        </li>
        {usuario && <LoginRoute usuario={usuario} />}
      </ul>
    </nav>
  );
};

const LoginRoute = ({ usuario }) => {
  return (
    //Uso de React fragment para retornar varias cosas dentro ese fragment
    <>
      <li className="Nav__link-push">
        <Link className="Nav__link" to="/upload">
          <FontAwesomeIcon icon={faCameraRetro} />
        </Link>
      </li>
      <li className="Nav__link-margin-left">
        <Link className="Nav__link" to="/explore">
          <FontAwesomeIcon icon={faCompass} />
        </Link>
      </li>
      <li className="Nav__link-margin-left">
        <Link className="Nav__link" to={`/perfil/${usuario.username}`}>
          <FontAwesomeIcon icon={faUser} />
        </Link>
      </li>
    </>
  );
};

export default Nav;
