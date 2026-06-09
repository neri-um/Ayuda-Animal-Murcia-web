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
    Component: PublicLayout,
    children: [
      { index: true, Component: Home },
      { path: 'animals/:id', Component: AnimalDetail },
      { path: 'adopt/:id', Component: AdoptionForm },
      { path: 'login', Component: Login },
      { path: 'quienes-somos', Component: QuienesSomos },
      { path: 'contacto', Component: Contacto },
    ],
  },
  {
    path: '/dashboard',
    Component: DashboardLayout,
    children: [
      { index: true, Component: DashboardHome },
      { path: 'animals', Component: AnimalsManagement },
      { path: 'animals/new', Component: AnimalForm },
      { path: 'animals/:id', Component: AnimalDetailDashboard },
      { path: 'animals/:id/edit', Component: AnimalForm },
      { path: 'animals/:id/appointments', Component: AnimalAppointments },
      { path: 'warehouse', Component: Warehouse },
      { path: 'warehouse/:id', Component: ProductDetail },
      { path: 'requests', Component: Requests },
      { path: 'adoption-requests', Component: AdoptionRequests },
      { path: 'users', Component: UserManagement },
      { path: 'formularios', Component: FormularioManagement },
    ],
  },
]);
