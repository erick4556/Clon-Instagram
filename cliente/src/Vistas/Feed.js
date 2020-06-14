import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import Main from "../Components/Main";
import Loading from "../Components/Loading";
import Post from "../Components/Post";

const cargarPost = async (dateLastPost) => {
  const query = dateLastPost ? `?fecha=${dateLastPost}` : "";
  const { data: nuevoPosts } = await Axios.get(`/api/posts/feed${query}`);
  return nuevoPosts;
};

const NUMERO_POSTS_LLAMADA = 3;

const Feed = ({ showError, usuario }) => {
  const [posts, setPosts] = useState([]);
  const [loadingPostInitials, setLoadingPostInitials] = useState(true);
  const [loadingMorePosts, setLoadingMorePosts] = useState(false);
  const [allPostsLoaded, setAllPostsLoaded] = useState(false);
  useEffect(() => {
    async function cargarPostsIniciales() {
      try {
        const newPosts = await cargarPost();
        setPosts(newPosts);
        console.log(newPosts);
        setLoadingPostInitials(false);
        revisarMasPosts(newPosts);
      } catch (error) {
        console.log(error);
        showError("Hubo un problema cargando tu feed.");
      }
    }
    cargarPostsIniciales();
  }, []); //Se ejectua una loza vez

  const updatePost = (originalPost, updatedPost) => {
    setPosts((posts) => {
      const updatedPosts = posts.map((post) => {
        if (post !== originalPost) {
          return post;
        }

        return updatedPost;
      });
      return updatedPosts;
    });
  };

  const loadMorePosts = async () => {
    if (loadingMorePosts) {
      return;
    } else {
      try {
        setLoadingMorePosts(true);
        const dateLastPost = posts[posts.length - 1].fecha_creado; //Para traer la última posición
        const newPosts = await cargarPost(dateLastPost);
        setPosts((oldPosts) => [...oldPosts, ...newPosts]); //Se construye un nuevo arreglo
        setLoadingMorePosts(false);
        revisarMasPosts(newPosts);
      } catch (error) {
        showError("Hubo un problema cargando los siguientes posts.");
        setLoadingMorePosts(false);
      }
    }
  };

  const revisarMasPosts = (nuevosPosts) => {
    if (nuevosPosts.length < NUMERO_POSTS_LLAMADA) {
      setAllPostsLoaded(true);
    }
  };

  if (loadingPostInitials) {
    return (
      <Main center>
        <Loading />
      </Main>
    );
  }

  if (!loadingPostInitials && posts.length === 0) {
    return (
      <Main center>
        <DontFollow />
      </Main>
    );
  }

  return (
    <Main center>
      <div className="Feed">
        {posts.map((post, x) => (
          <Post
            key={post._id}
            post={post}
            updatePost={updatePost}
            showError={showError}
            usuario={usuario}
          />
        ))}
        <LoadMorePosts
          onClick={loadMorePosts}
          allPostsLoaded={allPostsLoaded}
        />
      </div>
    </Main>
  );
};

const DontFollow = () => {
  return (
    <div className="NoSiguesANadie">
      <p className="NoSiguesANadie??mensaje">
        Tu feed no tiene fotos por que no sigues a nadie, o por que no han
        publicado fotos.
      </p>
      <div className="text-center"></div>
      <Link to="/explore" className="NoSiguesANadie__boton">
        Explora el Clon de Instagran
      </Link>
    </div>
  );
};

const LoadMorePosts = ({ onClick, allPostsLoaded }) => {
  if (allPostsLoaded) {
    return <div className="Feed__no-hay-mas-posts">No hay más posts</div>;
  } else {
    return (
      <button className="Feed__cargar-mas" onClick={onClick}>
        Ver más
      </button>
    );
  }
};

export default Feed;
