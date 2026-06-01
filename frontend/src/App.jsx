import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Logo from './components/Logo.jsx';

import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Home from './pages/Home.jsx';
import ExperienceDetail from './pages/ExperienceDetail.jsx';
import MisReservas from './pages/MisReservas.jsx';
import GuiaDashboard from './pages/GuiaDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import SolicitudGuia from './pages/SolicitudGuia.jsx';
import PagoExito from './pages/PagoExito.jsx';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/experiencias" element={<Home />} />
          <Route path="/experiencias/:id" element={<ExperienceDetail />} />
          <Route path="/pago/exito" element={<PagoExito />} />

          <Route
            path="/mis-reservas"
            element={
              <ProtectedRoute>
                <MisReservas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/solicitud-guia"
            element={
              <ProtectedRoute>
                <SolicitudGuia />
              </ProtectedRoute>
            }
          />
          <Route
            path="/guia"
            element={
              <ProtectedRoute roles={['guia', 'admin']}>
                <GuiaDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<div className="p-10 text-center">Página no encontrada.</div>} />
        </Routes>
      </main>
      <footer className="border-t border-slate-200 bg-white py-6 dark:border-rio-800 dark:bg-rio-950">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 text-sm text-slate-500 dark:text-slate-400 sm:flex-row sm:justify-between">
          <Logo size={32} textClass="text-rio-800 dark:text-white" />
          <span>Ecoturismo fluvial en Barrancabermeja · © {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
}
