import { createBrowserRouter } from 'react-router';
import PublicLayout from './components/PublicLayout';
import DashboardLayout from './components/DashboardLayout';
import Home from './pages/Home';
import AnimalDetail from './pages/AnimalDetail';
import AdoptionForm from './pages/AdoptionForm';
import Login from './pages/Login';
import QuienesSomos from './pages/QuienesSomos';
import Contacto from './pages/Contacto';
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
      { path: 'animals/:id', element: <AnimalDetail /> },
      { path: 'adopt/:id', element: <AdoptionForm /> },
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
