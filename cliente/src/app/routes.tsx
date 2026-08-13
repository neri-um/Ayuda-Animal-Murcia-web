import { createBrowserRouter, Navigate } from 'react-router';
import PublicLayout from './components/PublicLayout';
import DashboardLayout from './components/DashboardLayout';
import Home from './pages/Home';
import Adoptar from './pages/Adoptar';
import AnimalDetail from './pages/AnimalDetail';
import AdoptionForm from './pages/AdoptionForm';
import Login from './pages/Login';
import Contacto from './pages/Contacto';
import Colaborar from './pages/Colaborar';
import ColaborarOpcion from './pages/ColaborarOpcion';
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
import Blog from './pages/Blog';
import EntradaBlogDetail from './pages/EntradaBlogDetail';
import BlogManagement from './pages/dashboard/BlogManagement';
import ErrorPagina from './pages/ErrorPagina';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    errorElement: <ErrorPagina />,
    children: [
      { index: true, element: <Home /> },
      { path: 'adoptar', element: <Adoptar /> },
      { path: 'animales', element: <Navigate to="/adoptar" replace /> },
      { path: 'animales/:id', element: <AnimalDetail /> },
      { path: 'adopcion/:id', element: <AdoptionForm /> },
      { path: 'novedades/:id', element: <NovedadDetail /> },
      // Blog
      { path: 'blog', element: <Blog /> },
      { path: 'blog/:id', element: <EntradaBlogDetail /> },
      { path: 'colaborar', element: <Colaborar /> },
      { path: 'colaborar/:opcion', element: <ColaborarOpcion /> },
      { path: 'donar', element: <Donar /> },
      { path: 'apadrinar', element: <Apadrinar /> },
      { path: 'contacto', element: <Contacto /> },
      // Autenticación
      { path: 'login', element: <Login /> },
      { path: 'aviso-legal', element: <AvisoLegal /> },
      { path: 'privacidad', element: <PoliticaPrivacidad /> },
      { path: 'cookies', element: <PoliticaCookies /> },

      { path: '*', element: <ErrorPagina /> },
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
      { path: 'adopciones', element: <AdoptionRequests /> },
      { path: 'blog', element: <BlogManagement /> },
      { path: 'usuarios', element: <UserManagement /> },
      { path: 'formularios', element: <FormularioManagement /> },
    ],
  },
]);
