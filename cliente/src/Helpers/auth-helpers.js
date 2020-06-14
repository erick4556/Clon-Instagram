import Axios from "axios";

const TOKEN_KEY = "CLONINSTAGRAMTOKEN";

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function deleteToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function initAxiosInterceptor() {
  //Antes que la llamada salga del navegador a la red, la intercepto con los interceptors de Axios
  Axios.interceptors.request.use(function (config) {
    //Recibe un objeto de configuración
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  Axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (err) => {
      //Error de autenticación
      if (err.response.status === 401) {
        deleteToken();
        window.location = "/login";
      } else {
        return Promise.reject(err);
      }
    }
  );
}
