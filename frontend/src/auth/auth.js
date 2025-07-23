// Lee el usuario o devuelve null
export const getUser = () =>
  JSON.parse(localStorage.getItem("user") || "null");

// ¿Está autenticado?
export const isLogged = () => Boolean(localStorage.getItem("token"));

// Cerrar sesión
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
