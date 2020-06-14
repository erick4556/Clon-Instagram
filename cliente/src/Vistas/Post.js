import React, { useState, useEffect } from "react";
import Main from "../Components/Main";
import { Link } from "react-router-dom";
import Loading from "../Components/Loading";
import Avatar from "../Components/Avatar";
import Comment from "../Components/Comment";
import BotonLike from "../Components/BotonLike";
import RecursoNoExiste from "../Components/RecursoNoExiste";
import Axios from "axios";
import { toggleLike, comment } from "../Helpers/post-helpers";

const PostVista = ({ showError, match, usuario }) => {
  const postId = match.params.id; //Router inyecto esta propiedad
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [postNotFound, setPostNotFound] = useState(false);
  const [sendingLike, setSendingLike] = useState(false);

  useEffect(() => {
    async function cargarPost() {
      try {
        const { data: post } = await Axios.get(`/api/posts/${postId}`);
        setPost(post);
        setLoading(false);
      } catch (error) {
        if (
          error.response &&
          (error.response.status === 404 || error.response.status === 400)
        ) {
          setPostNotFound(true);
        } else {
          showError("Hubo un problema cargando este post.");
        }
        setLoading(false);
      }
    }
    cargarPost();
  }, [postId]); //Le agrego un array con el postid, para que React ejecute esta función o el efecto, cargue la data de nuevo en caso que el id cambie.

  const onSubtmitComment = async (mensaje) => {
    const updatedPostsComments = await comment(post, mensaje, usuario);
    setPost(updatedPostsComments);
  };

  const onSubmitLike = async () => {
    if (sendingLike) {
      return;
    }
    try {
      setSendingLike(true);
      const updatedPost = await toggleLike(post);
      setPost(updatedPost);
      setSendingLike(false);
    } catch (error) {
      console.log(error);
      setSendingLike(false);
      showError("Hubo un problema modificando el like. Intenta de nuevo.");
    }
  };

  if (loading) {
    return (
      <Main center>
        <Loading />
      </Main>
    );
  }

  if (postNotFound) {
    return (
      <RecursoNoExiste mensaje="El post que estas intentando ver no existe." />
    );
  }

  if (post === null) {
    return null;
  }

  return (
    <Main center>
      <Post {...post} onSubtmitComment={onSubtmitComment} onSubmitLike={onSubmitLike}/>
    </Main>
  );
};

const Post = ({
  comentarios,
  caption,
  url,
  usuario,
  estaLike,
  onSubmitLike,
  onSubtmitComment,
}) => {
  return (
    <div className="Post">
      <div className="Post__image-container">
        <img src={url} alt={caption} />
      </div>
      <div className="Post__side-bar">
        <Avatar usuario={usuario}></Avatar>
        <div className="Post__comentarios-y-like">
          <Comentarios
            usuario={usuario}
            caption={caption}
            comentarios={comentarios}
          />
          <div className="Post__like">
            <BotonLike onSubmitLike={onSubmitLike} like={estaLike} />
          </div>
          <Comment onSubmitComment={onSubtmitComment} />
        </div>
      </div>
    </div>
  );
};

const Comentarios = ({ usuario, caption, comentarios }) => {
  return (
    <ul className="Post__comentarios">
      <li className="Post__comentario">
        <Link
          to={`/perfil/${usuario.username}`}
          className="Post__autor-comentario"
        >
          <b>{usuario.username}</b>
        </Link>{" "}
        {caption}
      </li>
      {comentarios.map((comentario) => (
        <li className="Post__comentario" key={comentario._id}>
          <Link
            to={`/perfil/${comentario.usuario.username}`}
            className="Post__autor-comentario"
          >
            <b>{comentario.usuario.username}</b>
          </Link>{" "}
          {comentario.mensaje}
        </li>
      ))}
    </ul>
  );
};

export default PostVista;
