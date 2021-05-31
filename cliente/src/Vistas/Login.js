import React, { useState } from "react";
import { Link } from "react-router-dom";
import Main from "../Components/Main";

const Login = (props) => {
  const [usuario, setUsuario] = useState({
    email: "",
    password: "",
  }); //Para usar estados en un componente
  const handleInputChange = (e) => {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value, //Hubo un cambio en unos de los campos actualizadlo
    });
    //usuario[e.target.name] = e.target.value; //Llena la información del objeto usuario
    e.persist();
  };

  const handleSubmit = async (e) => {
    //Recibe un event también
    e.preventDefault(); // Para que no haga refresh de la página cuando se envian los datos
    try {
      //const { data } = await Axios.post("/api/usuarios/login", usuario); //Le paso el estado del formulario "usuario"
      //console.log(data);
      await props.login(usuario.email, usuario.password);
    } catch (error) {
      props.showError(error.response.data);
      console.log(error);
    }
  };

  return (
    <Main center={true}>
      <div className="FormContainer">
        <h1 className="Form__titulo">Clon de Instagram</h1>
        <div>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="Form__field"
              required
              onChange={handleInputChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="Form__field"
              required
              onChange={handleInputChange}
            />
            <button className="Form__submit" type="submit">
              Login
            </button>
            <p className="FormContainer__info">
              No tienes cuenta? <Link to="/signup">SignUp</Link>
            </p>
          </form>
        </div>
      </div>
    </Main>
  );
};

export default Login;
