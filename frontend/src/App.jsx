import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import DashProf from './pages/prof/Dashboard';
import DashAdmin from "./pages/admin/Dashboard.jsx";
import RequireAuth from './components/RequireAuth';
import NuevoProyecto from "./pages/prof/NuevoProyecto.jsx";
import EditarProyecto from "./pages/prof/EditarProyecto.jsx";

import SapsTrabajoCompetitividad from './pages/SapsTrabajoCompetitividad';
import SapsVidaSalud from './pages/SapsVidaSalud';
import SapsStem from './pages/SapsStem';
import SapsDesarrolloHumano from './pages/SapsDesarrolloHumano';
import ProyectoDetail from "./pages/ProyectoDetail.jsx";


import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


function AppWrapper() {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith('/admin');

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/saps/trabajo-competitividad" element={<SapsTrabajoCompetitividad />} />
        <Route path="/saps/vida-salud" element={<SapsVidaSalud />} />
        <Route path="/saps/stem" element={<SapsStem />} />
        <Route path="/saps/desarrollo-humano" element={<SapsDesarrolloHumano />} />
        <Route path="/proyecto/:id" element={<ProyectoDetail />} />

        <Route
          path="/prof/*"
          element={
            <RequireAuth role={2}>
              <DashProf />
            </RequireAuth>
          }
        />
        <Route path="/prof/proyectos/nuevo" element={<NuevoProyecto />} />
        <Route path="/prof/proyectos/:id/editar" element={<EditarProyecto />} />

        <Route
          path="/admin/*"
          element={
            <RequireAuth role={1}>
              <DashAdmin />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}
