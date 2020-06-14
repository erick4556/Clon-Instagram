import React, { useState } from "react";
import { Link } from "react-router-dom";
import Main from "../Components/Main";
import imagenSingUp from "../imagenes/signup.png";

const SingUp = ({ signUp, showError }) => {
  const [usuario, setUsuario] = useState({
    email: "",
    username: "",
    nombre: "",
    password: "",
    bio: "",
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
    //Recibe un eventp también
    e.preventDefault(); // Para que no haga refresh de la página cuando se envian los datos
    try {
      /*  const { data } = await Axios.post("/api/usuarios/signup", usuario); //Le paso el estado del formulario "usuario"
      console.log(data); */
      await signUp(usuario);
    } catch (error) {
      showError(error.response.data);
      console.log(error);
    }
  };

  return (
    <Main center={true}>
      <div className="SingUp">
        <img src={imagenSingUp} alt="" className="SingUp__img" />
        <div className="FormContainer">
          <h1 className="Form__titulo">ClonInstagram</h1>
          <p className="FormContainer__info">
            Regístrate para que veas una copia de instagram
          </p>
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
              type="text"
              name="nombre"
              placeholder="Nombre y Apellido"
              className="Form__field"
              required
              minLength="3"
              maxLength="80"
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="Form__field"
              required
              minLength="3"
              maxLength="20"
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="bio"
              placeholder="Hablanos sobre ti..."
              className="Form__field"
              required
              maxLength="120"
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
              SignUp
            </button>
            <p className="FormContainer__info">
              Ya tienes una cuenta? <Link to="/login">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </Main>
  );
};

export default SingUp;
