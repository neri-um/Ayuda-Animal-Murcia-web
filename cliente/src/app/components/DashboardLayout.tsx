import { Link, Outlet, useNavigate, useLocation } from 'react-router';
import {
  LayoutDashboard, PawPrint, Package,
  ClipboardList, Users, LogOut, ChevronRight, ClipboardCheck, FileText, Newspaper,
  Home,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AppContext';
import LOGO_URL from '../public/logopng.png';

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  minRole?: 'VOLUNTARIO' | 'ENCARGADO' | 'ADMIN';
}

const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Panel principal', icon: <LayoutDashboard className="w-5 h-5" /> },
  { to: '/dashboard/animales', label: 'Animales', icon: <PawPrint className="w-5 h-5" /> },
  { to: '/dashboard/almacen', label: 'Almacén', icon: <Package className="w-5 h-5" /> },
  { to: '/dashboard/solicitudes', label: 'Solicitudes', icon: <ClipboardList className="w-5 h-5" /> },
  { to: '/dashboard/adopciones', label: 'Adopciones', icon: <ClipboardCheck className="w-5 h-5" /> },
  { to: '/dashboard/acogidas', label: 'Acogidas', icon: <Home className="w-5 h-5" /> },
  { to: '/dashboard/blog', label: 'Blog', icon: <Newspaper className="w-5 h-5" /> },
  { to: '/dashboard/formularios', label: 'Formularios', icon: <FileText className="w-5 h-5" />},
  { to: '/dashboard/usuarios', label: 'Usuarios', icon: <Users className="w-5 h-5" />, minRole: 'ADMIN' },
];

function NavLink({ item, onClick }: { item: NavItem; onClick?: () => void }) {
  const location = useLocation();
  const isActive = item.to === '/dashboard'
    ? location.pathname === '/dashboard'
    : location.pathname.startsWith(item.to);

  return (
    <Link
      to={item.to}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm group`}
      style={
        isActive
          ? { backgroundColor: '#f7e3b0', color: '#2e2e2e', fontWeight: 600 }
          : { color: '#d9d9d9' }
      }
      onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = '#3f3f3f'; }}
      onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
    >
      {item.icon}
      <span>{item.label}</span>
      {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
    </Link>
  );
}

const roleLabels = { VOLUNTARIO: 'Voluntario/a', ENCARGADO: 'Encargado/a', ADMIN: 'Administrador/a' };

export default function DashboardLayout() {
  const { currentUser, logout, canAccess } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const visibleItems = navItems.filter(item => !item.minRole || canAccess(item.minRole));

  const handleLogout = () => { logout(); navigate('/'); };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5" style={{ borderBottom: '1px solid #3f3f3f' }}>
        <Link to="/" className="flex items-center gap-2.5">
          <img src={LOGO_URL} alt="Logo Ayuda Animal Murcia" className="h-9 w-auto flex-shrink-0" />
          <span className="text-white" style={{ fontWeight: 600 }}>Vidanimal</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-5 flex flex-col gap-1">
        {visibleItems.map(item => (
          <NavLink key={item.to} item={item} onClick={() => setSidebarOpen(false)} />
        ))}
      </nav>

      <div className="px-4 py-4" style={{ borderTop: '1px solid #3f3f3f' }}>
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm"
            style={{ backgroundColor: '#f7e3b0', color: '#2e2e2e', fontWeight: 600 }}
          >
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm truncate" style={{ fontWeight: 500 }}>{currentUser.name}</p>
            <p className="text-xs" style={{ color: '#727272' }}>{roleLabels[currentUser.role]}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 transition-colors text-sm w-full px-1"
          style={{ color: '#727272' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#fca5a5')}
          onMouseLeave={e => (e.currentTarget.style.color = '#727272')}
        >
          <LogOut className="w-4 h-4" />Cerrar sesión
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-dvh overflow-hidden" style={{ backgroundColor: '#f7f7f7' }}>
      <aside className="hidden lg:flex w-64 flex-col flex-shrink-0" style={{ backgroundColor: '#2e2e2e' }}>
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 flex flex-col z-10" style={{ backgroundColor: '#2e2e2e' }}>
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 h-16 flex items-center justify-between flex-shrink-0">
          <button className="lg:hidden p-2 text-gray-500 hover:text-gray-700" onClick={() => setSidebarOpen(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-sm transition-colors hidden sm:block"
              style={{ color: '#727272' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#2e2e2e')}
              onMouseLeave={e => (e.currentTarget.style.color = '#727272')}
            >
              ← Ver web pública
            </Link>
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
              style={{ backgroundColor: '#f7e3b0', color: '#2e2e2e', fontWeight: 600 }}
            >
              {roleLabels[currentUser.role]}
            </div>
          </div>
        </header>

        <main ref={mainRef} className="flex-1 overflow-y-auto p-4 sm:p-6"><Outlet /></main>
      </div>
    </div>
  );
}
