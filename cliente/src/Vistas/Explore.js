import React, { useState, useEffect } from "react";
import Main from "../Components/Main";
import { Link } from "react-router-dom";
import Loading from "../Components/Loading";
import { ImageAvatar } from "../Components/Avatar";
import Axios from "axios";
import Grid from "../Components/Grid";

const Explore = ({ showError }) => {
  const [posts, setPosts] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPostandUsers = async () => {
      try {
        const [posts, usuarios] = await Promise.all([
          Axios.get("/api/posts/explore").then(({ data }) => data),
          Axios.get("/api/usuarios/explore").then(({ data }) => data),
        ]);
        setPosts(posts);
        setUsuarios(usuarios);
        setLoading(false);
      } catch (error) {
        showError("Hubo un problema cargando explore. Refrezca la página.");
        console.log(error);
      }
    };

    loadPostandUsers();
  }, []);

  if (loading) {
    return (
      <Main center>
        <Loading />
      </Main>
    );
  }

  return (
    <Main>
      <div className="Explore__section">
        <h2 className="Explore__title">Descubrir usuarios.</h2>
        <div className="Explore__usuarios-container">
          {usuarios.map((usuario) => {
            return (
              <div className="Explore__usuario" key={usuarios._id}>
                <ImageAvatar usuario={usuario} />
                <p>{usuario.username}</p>
                <Link to={`/perfil/${usuario.username}`}>Ver perfil</Link>
              </div>
            );
          })}
        </div>
      </div>

      <div className="Explore__section">
        <h2 className="Explore__title">Explorar</h2>
        <Grid posts={posts} />
      </div>
    </Main>
  );
};

export default Explore;
