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
      // Listado de adopción — accesible por /adoptar y /animales
      { path: 'adoptar', element: <Adoptar /> },
      { path: 'animales', element: <Navigate to="/adoptar" replace /> },
      // Detalle y formulario de animal
      { path: 'animals/:id', element: <AnimalDetail /> },
      { path: 'adopt/:id', element: <AdoptionForm /> },
      // Páginas de colaboración
      { path: 'colaborar', element: <Colaborar /> },
      { path: 'donar', element: <Donar /> },
      { path: 'apadrinar', element: <Apadrinar /> },
      // Resto
      { path: 'login', element: <Login /> },
      { path: 'quienes-somos', element: <QuienesSomos /> },
      { path: 'contacto', element: <Contacto /> },
    ],
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DashboardHome /> },
      { path: 'animals', element: <AnimalsManagement /> },
      { path: 'animals/new', element: <AnimalForm /> },
      { path: 'animals/:id', element: <AnimalDetailDashboard /> },
      { path: 'animals/:id/edit', element: <AnimalForm /> },
      { path: 'animals/:id/appointments', element: <AnimalAppointments /> },
      { path: 'warehouse', element: <Warehouse /> },
      { path: 'warehouse/:id', element: <ProductDetail /> },
      { path: 'requests', element: <Requests /> },
      { path: 'adoption-requests', element: <AdoptionRequests /> },
      { path: 'users', element: <UserManagement /> },
      { path: 'formularios', element: <FormularioManagement /> },
    ],
  },
]);
