import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Inicio from './pages/Inicio.jsx';
import Destinos from './pages/Destinos.jsx';
import DetalleDestino from './pages/DetalleDestino.jsx';
import VuelosDestino from './pages/VuelosDestino.jsx';
import HotelesDestino from './pages/HotelesDestino.jsx';
import MiViaje from './pages/MiViaje.jsx';
import NoEncontrada from './pages/NoEncontrada.jsx';

// Configuración de rutas con React Router (incluye rutas anidadas para vuelos y hoteles)
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Inicio />} />
        <Route path="destinos" element={<Destinos />} />

        {/* Detalle del destino (REST) con sub-rutas para vuelos y hoteles (GraphQL) */}
        <Route path="destinos/:id" element={<DetalleDestino />}>
          <Route index element={<Navigate to="vuelos" replace />} />
          <Route path="vuelos" element={<VuelosDestino />} />
          <Route path="hoteles" element={<HotelesDestino />} />
        </Route>

        <Route path="mi-viaje" element={<MiViaje />} />
        <Route path="*" element={<NoEncontrada />} />
      </Route>
    </Routes>
  );
}
