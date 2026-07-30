import { Heart, Menu, X, LogIn, LayoutDashboard, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AppContext';

export default function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();

  const isAdmin = Boolean(currentUser?.roles?.includes('ROLE_ADMIN'));

  return (
    <div className="min-h-screen bg-slate-50">
      {/* resto del layout exactamente igual que tu versión anterior */}
    </div>
  );
}
