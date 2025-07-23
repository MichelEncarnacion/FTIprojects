// frontend/src/components/RequireAuth.jsx
import { Navigate } from "react-router-dom";

/**
 * Protege una sección de la app comprobando:
 *   1) que exista un usuario en localStorage
 *   2) opcionalmente, que su role (number) coincida con el prop "role"
 *
 * Uso:
 * <RequireAuth role={2}><DashProf /></RequireAuth>
 */
export default function RequireAuth({ role, children }) {
  // Lee usuario almacenado tras el login
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // 1) Sin usuario → redirigir a /login
  if (!user) return <Navigate to="/login" replace />;

  // 2) Si pasaron "role" y no coincide → home
  if (role && Number(user.role) !== Number(role)) {
    return <Navigate to="/" replace />;
  }

  // 3) ✓ Todo bien → renderiza el contenido protegido
  return children;
}
