import React, { useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import BotonLike from "./BotonLike";
import Comment from "./Comment";
import { toggleLike, comment } from "../Helpers/post-helpers";

const Post = ({ post, updatePost, showError, usuario }) => {
  const {
    numLikes,
    numComentarios,
    comentarios,
    _id,
    caption,
    url,
    usuario: usuariodelPost,
    estaLike,
  } = post;
  const [sendingLike, setSendingLike] = useState(false);

  const onSubmitLike = async () => {
    if (sendingLike) {
      return;
    }
    try {
      setSendingLike(true);
      const updatedPost = await toggleLike(post);
      updatePost(post, updatedPost);
      setSendingLike(false);
    } catch (error) {
      console.log(error);
      setSendingLike(false);
      showError("Hubo un problema modificando el like. Intenta de nuevo.");
    }
  };

  const onSubtmitComment = async (mensaje) => {
    const updatedPostsComments = await comment(post, mensaje, usuario);
    updatePost(post, updatedPostsComments);
  };

  return (
    <div className="Post-Componente">
      <Avatar usuario={usuariodelPost} />
      <img src={url} alt={caption} className="Post-Componente__img" />
      <div className="Post-Componente__acciones">
        <div className="Post-Compomente__like-container">
          <BotonLike onSubmitLike={onSubmitLike} like={estaLike} />
        </div>
        <p>Liked por {numLikes}</p>
        <ul>
          <li>
            <Link to={`/perfil/${usuariodelPost.username}`}>
              <b>{usuariodelPost.username}</b>
            </Link>{" "}
            {caption}
          </li>
          <ShowAllComments _id={_id} numComentarios={numComentarios} />
          <Comments comentarios={comentarios} />
        </ul>
      </div>
      <Comment onSubmitComment={onSubtmitComment} showError={showError} />
    </div>
  );
};

const ShowAllComments = ({ _id, numComentarios }) => {
  if (numComentarios < 4) {
    return null;
  }
  return (
    <li className="text-grey-dark">
      <Link to={`/post/${_id}`}>Ver los {numComentarios} comentarios</Link>
    </li>
  );
};

const Comments = ({ comentarios }) => {
  if (comentarios.length === 0) {
    return null;
  } else {
    return comentarios.map((comentario) => {
      return (
        <li key={comentario._id}>
          <Link to={`/perfil/${comentario.usuario.username}`}>
            <b>{comentario.usuario.username}</b>
          </Link>{" "}
          {comentario.mensaje}
        </li>
      );
    });
  }
};

export default Post;
