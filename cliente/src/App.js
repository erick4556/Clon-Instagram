//useEffect es un hook que permite ejecutar código luego de que el componente haya sido renderizado
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Nav from "./Components/Nav";
import SingUp from "./Vistas/SignUp";
import Login from "./Vistas/Login";
import Axios from "axios";
import {
  setToken,
  deleteToken,
  getToken,
  initAxiosInterceptor,
} from "./Helpers/auth-helpers";
import Loading from "./Components/Loading";
import Error from "./Components/Error";
import Main from "./Components/Main";
import Upload from "./Vistas/Upload";
import Feed from "./Vistas/Feed";
import Post from "./Vistas/Post";
import Explore from "./Vistas/Explore";
import Perfil from "./Vistas/Perfil";

initAxiosInterceptor(); //Se ejecuta apena el navegador cargue el js de la aplicación

export default function App() {
  const [usuario, setUsuario] = useState(null); //No se sabe si hay un usuario autenticado inicialmente
  const [cargandoUsuario, setCargandousuario] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function cargarUsuario() {
      if (!getToken()) {
        setCargandousuario(false);
        return;
      }
      try {
        const { data: usuario } = await Axios.get("/api/usuarios/whoami");
        setUsuario(usuario);
        setCargandousuario(false);
      } catch (error) {
        console.log(error);
      }
    }

    cargarUsuario();
  }, []);

  const login = async (email, password) => {
    const { data } = await Axios.post("/api/usuarios/login", {
      email,
      password,
    });
    console.log(data);
    setUsuario(data.usuario);
    setToken(data.token);
  };

  const signUp = async (usuario) => {
    const { data } = await Axios.post("/api/usuarios/signup", usuario);
    console.log(data);
    setUsuario(data.usuario);
    setToken(data.token);
  };

  const logOut = () => {
    setUsuario(null);
    deleteToken();
  };

  const showError = (mensaje) => {
    setError(mensaje);
  };

  const hideError = () => {
    setError(null);
  };

  if (cargandoUsuario) {
    return (
      <Main center>
        <Loading />
      </Main>
    );
  }

  return (
    <Router>
      <Nav usuario={usuario} />
      <Error mensaje={error} hideError={hideError} />
      {usuario ? (
        <LoginRoutes showError={showError} usuario={usuario} logOut={logOut} />
      ) : (
        <LogOutRoutes login={login} signUp={signUp} showError={showError} />
      )}
      {/* <div>{JSON.stringify(usuario)}</div> */}
    </Router>
  );
}

const LoginRoutes = ({ showError, usuario, logOut }) => {
  return (
    <Switch>
      <Route
        path="/upload/"
        render={(props) => <Upload {...props} showError={showError} />}
      />
      <Route
        path="/post/:id"
        render={(props) => (
          <Post {...props} showError={showError} usuario={usuario} />
        )}
      />

      <Route
        path="/perfil/:username"
        render={(props) => (
          <Perfil
            {...props}
            showError={showError}
            usuario={usuario}
            logOut={logOut}
          />
        )}
      />

      <Route
        path="/explore/"
        render={(props) => <Explore {...props} showError={showError} />}
      />
      <Route
        path="/"
        render={(props) => (
          <Feed {...props} showError={showError} usuario={usuario} />
        )}
        default
      />
    </Switch>
  );
};

const LogOutRoutes = ({ login, signUp, showError }) => {
  return (
    <Switch>
      <Route
        path="/login/"
        render={(props) => (
          <Login {...props} login={login} showError={showError} />
        )}
      />
      <Route
        default
        render={(props) => (
          <SingUp {...props} signUp={signUp} showError={showError} />
        )}
      />
    </Switch>
  );
};
