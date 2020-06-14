import Axios from "axios";

export async function toggleLike(post) {
  const url = `/api/posts/${post._id}/likes`;
  let postLikeUpdated;
  if (post.estaLike) {
    await Axios.delete(url, {});
    postLikeUpdated = {
      ...post,
      estaLike: false,
      numLikes: post.numLikes - 1,
    };
  } else {
    await Axios.post(url, {});
    postLikeUpdated = {
      ...post,
      estaLike: true,
      numLikes: post.numLikes + 1,
    };
  }

  return postLikeUpdated;
}

export async function comment(post, mensaje, usuario) {
  const {
    data: nuevoComentario,
  } = await Axios.post(`/api/posts/${post._id}/comentarios`, { mensaje }); //nuevoComentario que retorna el servidor

  nuevoComentario.usuario = usuario;

  const updatedPostsComments = {
    ...post, //Todas las propiedades del post iguales
    comentarios: [...post.comentarios, nuevoComentario],
    numComentarios: post.numComentarios + 1,
  };
  return updatedPostsComments;
}
