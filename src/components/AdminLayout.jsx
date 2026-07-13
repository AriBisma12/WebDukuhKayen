import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function AdminLayout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin/login');
      } else {
        setUser(session.user);
      }
      setLoading(false);
    };
    checkUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { name: 'Kabar Padukuhan', path: '/admin/kabar', icon: '📰' },
    { name: 'Dokumentasi', path: '/admin/dokumentasi', icon: '📷' },
    { name: 'Video', path: '/admin/video', icon: '🎬' },
    { name: 'Statistik Desa', path: '/admin/statistik-desa', icon: '📈' },
    { name: 'Aparatur Desa', path: '/admin/aparatur', icon: '👥' },
    { name: 'Statistik Profil', path: '/admin/statistik-profil', icon: '🏘️' },
    { name: 'Batas Wilayah', path: '/admin/batas-wilayah', icon: '🗺️' },
    { name: 'Navigasi', path: '/admin/navigasi', icon: '🔗' },
  ];

  const currentPageName = navItems.find(item =>
    location.pathname.startsWith(item.path)
  )?.name || 'Dashboard';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f3ee]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#7a5b0a] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#7a6e5a] font-heading font-semibold">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen bg-[#f6f3ee] overflow-hidden">

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#faf7f0] border-r border-[#ddd3c2] flex flex-col shadow-[4px_0_20px_-8px_rgba(50,34,11,0.15)] transform transition-transform duration-300 md:relative md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b border-[#ddd3c2] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#7a5b0a] flex items-center justify-center text-white font-heading font-bold text-sm shadow-[0_8px_20px_-8px_rgba(122,91,10,0.8)]">
              PK
            </div>
            <div>
              <h1 className="font-heading text-sm font-bold text-[#3f2d11]">Admin Panel</h1>
              <p className="text-xs text-[#9f8e78]">Padukuhan Kayen</p>
            </div>
          </div>
          <button
            className="md:hidden text-[#9f8e78] hover:text-[#7a5b0a] transition-colors"
            onClick={() => setIsSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#7a5b0a] text-white shadow-[0_8px_20px_-10px_rgba(122,91,10,0.8)]'
                    : 'text-[#7a6e5a] hover:bg-[#ece8df] hover:text-[#5a430d]'
                }`}
              >
                <span className="text-base leading-none">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-[#ddd3c2]">
          <div className="mb-3 px-2">
            <p className="text-xs font-semibold text-[#5a430d] truncate">{user.email}</p>
            <p className="text-[11px] text-[#9f8e78]">Administrator</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#e5c8c8] text-[#b54040] text-sm font-semibold hover:bg-[#fdf0f0] transition-colors"
          >
            <span>↩</span> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden w-full">
        {/* Top Header */}
        <header className="h-[64px] bg-[#faf7f0] border-b border-[#ddd3c2] flex items-center justify-between px-4 md:px-6 shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden text-[#9f8e78] hover:text-[#7a5b0a] flex items-center justify-center w-9 h-9 rounded-lg hover:bg-[#ece8df] transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              ☰
            </button>
            <div>
              <h2 className="font-heading text-base font-bold text-[#3f2d11]">{currentPageName}</h2>
              <p className="text-[11px] text-[#9f8e78] hidden sm:block">Portal Padukuhan Kayen</p>
            </div>
          </div>
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#ece8df] text-[#7a5b0a] text-xs font-semibold hover:bg-[#e3ddd4] transition-colors"
          >
            <span>🌐</span>
            <span className="hidden sm:inline">Lihat Website</span>
          </Link>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#f6f3ee]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
