import React, { useState, useEffect } from "react";
import Main from "../Components/Main";
import Loading from "../Components/Loading";
import Grid from "../Components/Grid";
import RecursoNoExiste from "../Components/RecursoNoExiste";
import Axios from "axios";
import stringToColor from "string-to-color";
import toggleFollowing from "../Helpers/amistad-helpers";
import useIsMobile from "../Hooks/useIsMobile";

const Perfil = ({ showError, usuario, match, logOut }) => {
  const username = match.params.username; //match para leer los parametros
  const [ownerUser, setOwnerUser] = useState(null);
  const [posts, setPosts] = useState(null);
  const [loadingPerfil, setLoadingPerfil] = useState(true);
  const [userNotFound, setUserNotFound] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [enviandoAmistad, setEnviandoAmistad] = useState(false);
  const isMobile = useIsMobile(); //Cada vez que el componente haga render, llama esta funcion useIsMobile

  useEffect(() => {
    const loadPostsUsers = async () => {
      try {
        setLoadingPerfil(true);
        const { data: usuario } = await Axios.get(`/api/usuarios/${username}`);
        const { data: posts } = await Axios.get(
          `/api/posts/usuario/${usuario._id}`
        );
        setOwnerUser(usuario);
        setPosts(posts);
        setLoadingPerfil(false);
      } catch (error) {
        if (
          error.response &&
          (error.response.status === 404 || error.response.status === 500)
        ) {
          setUserNotFound(true);
        } else {
          showError("Hubo un problema cargando este perfil.");
        }
        setLoadingPerfil(false);
      }
    };
    loadPostsUsers();
  }, [username]); //Si username cambia, react ejecuta este método nuevamente, y carga la data del nuevo usuario.

  const ownerUserLogged = () => {
    return usuario._id === ownerUser._id;
  };

  const handleImageSelected = async (e) => {
    try {
      setUploadingImage(true);
      const file = e.target.files[0]; //Solo se puede seleccionar un archivo
      const config = {
        headers: {
          "Content-Type": file.type,
        },
      };
      const { data } = await Axios.post("/api/usuarios/upload/", file, config);
      setOwnerUser({ ...ownerUser, imagen: data.url }); //Cambio la imagen por que ahora apunta a un nuevo url que regresó el servidor
      setUploadingImage(false);
    } catch (error) {
      showError(error.response.data);
      setUploadingImage(false);
      console.log(error);
    }
  };

  const onToggleFollowing = async () => {
    if (enviandoAmistad) {
      return;
    } else {
      try {
        setEnviandoAmistad(true);
        const userUpdated = await toggleFollowing(ownerUser);
        setOwnerUser(userUpdated);
        setEnviandoAmistad(false);
      } catch (error) {
        showError(
          "Hubo un problema siguiendo o dejando de seguir a este usuario. Intenta de nuevo."
        );
        setEnviandoAmistad(false);
        console.log(error);
      }
    }
  };

  if (loadingPerfil) {
    return (
      <Main center>
        <Loading />
      </Main>
    );
  }

  if (userNotFound) {
    return (
      <RecursoNoExiste
        mensaje={"El perfil que estas intentando ver no existe.."}
      />
    );
  }

  if (usuario === null) {
    return null;
  }

  return (
    <Main center>
      <div className="Perfil">
        <ImageAvatar
          ownerUserLogged={ownerUserLogged}
          ownerUser={ownerUser}
          handleImageSelected={handleImageSelected}
          uploadingImage={uploadingImage}
        />
        <div className="Perfil__bio-container">
          <div className="Perfil__bio-heading">
            <h2 className="capitalize">{ownerUser.username}</h2>
            {!ownerUserLogged() && (
              <FollowButton
                following={ownerUser.siguiendo}
                toggleFollowing={onToggleFollowing}
              />
            )}
            {ownerUserLogged() && <ButtonLogOut logOut={logOut} />}
          </div>
          {!isMobile && <UserDescription ownerUser={ownerUser} />}
        </div>
      </div>
      {isMobile && <UserDescription ownerUser={ownerUser} />}
      <div className="Perfil__separador" />
      {posts.length > 0 ? <Grid posts={posts} /> : <NoPhotos />}
    </Main>
  );
};

const ImageAvatar = ({
  ownerUserLogged,
  ownerUser,
  handleImageSelected,
  uploadingImage,
}) => {
  let content;

  if (uploadingImage) {
    content = <Loading />;
  } else if (ownerUserLogged) {
    content = (
      <label
        className="Perfil__img-placeholder Perfil__img-placeholder--pointer"
        style={{
          backgroundImage: ownerUser.imagen ? `url(${ownerUser.imagen})` : null,
          backgroundColor: stringToColor(ownerUser.username),
        }}
      >
        <input
          type="file"
          onChange={handleImageSelected}
          className="hidden"
          name="imagen"
        />
      </label>
    );
  } else {
    content = (
      <div
        className="Perfil__img-placeholder"
        style={{
          backgroundImage: ownerUser.imagen ? `url(${ownerUser.imagen})` : null,
          backgroundColor: stringToColor(ownerUser.username),
        }}
      />
    );
  }

  return <div className="Perfil__img-container">{content}</div>;
};

const FollowButton = ({ following, toggleFollowing }) => {
  return (
    <button onClick={toggleFollowing} className="Perfil__boton-seguir">
      {following ? "Dejar de seguir" : "Seguir"}
    </button>
  );
};

const ButtonLogOut = ({ logOut }) => {
  return (
    <button className="Perfil__boton-logout" onClick={logOut}>
      LogOut
    </button>
  );
};

const UserDescription = ({ ownerUser }) => {
  return (
    <div className="Perfil__descripcion">
      <h2 className="Perfil__nombre">{ownerUser.nombre}</h2>
      <p>{ownerUser.bio}</p>
      <p className="Perfil__estadisticas">
        <b>{ownerUser.numSeguiendo}</b> following
        <span className="ml-4">
          <b>{ownerUser.numSeguidores}</b> followers
        </span>
      </p>
    </div>
  );
};

const NoPhotos = () => {
  return <p className="text-center">Este usuario no ha subido fotos.</p>;
};

export default Perfil;
