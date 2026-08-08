import { createBrowserRouter, Navigate } from 'react-router';
import PublicLayout from './components/PublicLayout';
import DashboardLayout from './components/DashboardLayout';
import Home from './pages/Home';
import Adoptar from './pages/Adoptar';
import AnimalDetail from './pages/AnimalDetail';
import AdoptionForm from './pages/AdoptionForm';
import Login from './pages/Login';
import QuienesSomos from './pages/QuienesSomos';
import Contacto from './pages/Contacto';
import Colaborar from './pages/Colaborar';
import Donar from './pages/Donar';
import Apadrinar from './pages/Apadrinar';
import AvisoLegal from './pages/AvisoLegal';
import PoliticaPrivacidad from './pages/PoliticaPrivacidad';
import PoliticaCookies from './pages/PoliticaCookies';
import NovedadDetail from './pages/NovedadDetail';
import DashboardHome from './pages/dashboard/DashboardHome';
import AnimalsManagement from './pages/dashboard/AnimalsManagement';
import AnimalForm from './pages/dashboard/AnimalForm';
import AnimalDetailDashboard from './pages/dashboard/AnimalDetail';
import AnimalAppointments from './pages/dashboard/AnimalAppointments';
import Warehouse from './pages/dashboard/Warehouse';
import ProductDetail from './pages/dashboard/ProductDetail';
import Requests from './pages/dashboard/Requests';
import UserManagement from './pages/dashboard/UserManagement';
import AdoptionRequests from './pages/dashboard/AdoptionRequests';
import FormularioManagement from './pages/dashboard/FormularioManagement';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <Home /> },
      // Adopción
      { path: 'adoptar', element: <Adoptar /> },
      { path: 'animales', element: <Navigate to="/adoptar" replace /> },
      { path: 'animales/:id', element: <AnimalDetail /> },
      { path: 'adopcion/:id', element: <AdoptionForm /> },
      // Novedades
      { path: 'novedades/:id', element: <NovedadDetail /> },
      // Colaboración
      { path: 'colaborar', element: <Colaborar /> },
      { path: 'donar', element: <Donar /> },
      { path: 'apadrinar', element: <Apadrinar /> },
      // Información
      { path: 'quienes-somos', element: <QuienesSomos /> },
      { path: 'contacto', element: <Contacto /> },
      // Autenticación
      { path: 'login', element: <Login /> },
      // Páginas legales
      { path: 'aviso-legal', element: <AvisoLegal /> },
      { path: 'privacidad', element: <PoliticaPrivacidad /> },
      { path: 'cookies', element: <PoliticaCookies /> },
    ],
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DashboardHome /> },
      { path: 'animales', element: <AnimalsManagement /> },
      { path: 'animales/nuevo', element: <AnimalForm /> },
      { path: 'animales/:id', element: <AnimalDetailDashboard /> },
      { path: 'animales/:id/edit', element: <AnimalForm /> },
      { path: 'animales/:id/appointments', element: <AnimalAppointments /> },
      { path: 'almacen', element: <Warehouse /> },
      { path: 'almacen/:id', element: <ProductDetail /> },
      { path: 'solicitudes', element: <Requests /> },
      { path: 'solicitudes-adopcion', element: <AdoptionRequests /> },
      { path: 'usuarios', element: <UserManagement /> },
      { path: 'formularios', element: <FormularioManagement /> },
    ],
  },
]);
