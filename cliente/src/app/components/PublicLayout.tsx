import { Heart, Menu, X, LogIn, LayoutDashboard, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Outlet } from 'react-router';
import { useAuth } from '../context/AppContext';

export default function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();

  const isAdmin = Boolean(currentUser?.roles?.includes('ROLE_ADMIN'));

  return (
    <div className="w-full min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        {/* ... tu header tal como lo tenias ... */}
      </header>

      <main className="w-full">
        <Outlet />
      </main>
    </div>
  );
}
