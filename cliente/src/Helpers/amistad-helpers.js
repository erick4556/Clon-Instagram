import Axios from "axios";

const toggleFollowing = async (usuario) => {
  let userUpdated;
  if (usuario.siguiendo) {
    await Axios.delete(`/api/amistades/${usuario._id}/eliminar/`);
    userUpdated = {
      ...usuario,
      numSeguidores: usuario.numSeguidores - 1,
      siguiendo: false,
    };
  } else {
    await Axios.post(`/api/amistades/${usuario._id}/seguir/`);
    userUpdated = {
      ...usuario,
      numSeguidores: usuario.numSeguidores + 1,
      siguiendo: true,
    };
  }
  return userUpdated;
};

export default toggleFollowing;
