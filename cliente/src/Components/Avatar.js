import React from "react";
import { Link } from "react-router-dom";
import stringToColor from "string-to-color";

const Avatar = ({ usuario }) => {
  return (
    <div className="Avatar">
      <ImageAvatar usuario={usuario} />
      <Link to={`/perfil/${usuario.username}`}>
        <h2>{usuario.username}</h2>
      </Link>
    </div>
  );
};

export const ImageAvatar = ({ usuario }) => {
  const style = {
    backgroundImage: usuario.imagen ? `url(${usuario.imagen})` : null,
    backgroundColor: stringToColor(usuario.username),
  };

  return <div className="Avatar__img" style={style}></div>;
};

export default Avatar;
