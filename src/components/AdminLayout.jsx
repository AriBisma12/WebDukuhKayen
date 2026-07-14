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
      const {
        data: { session },
      } = await supabase.auth.getSession();
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
    { name: 'Dashboard', path: '/admin/dashboard', icon: 'DB' },
    { name: 'Tampilan', path: '/admin/tampilan', icon: 'TP' },
    { name: 'Kabar Padukuhan', path: '/admin/kabar', icon: 'KB' },
    { name: 'Dokumentasi', path: '/admin/dokumentasi', icon: 'DK' },
    { name: 'Video', path: '/admin/video', icon: 'VD' },
    { name: 'Statistik Desa', path: '/admin/statistik-desa', icon: 'SD' },
    { name: 'Aparatur Desa', path: '/admin/aparatur', icon: 'AP' },
    { name: 'Statistik Profil', path: '/admin/statistik-profil', icon: 'SP' },
    { name: 'Batas Wilayah', path: '/admin/batas-wilayah', icon: 'BW' },
    { name: 'Navigasi', path: '/admin/navigasi', icon: 'NV' },
  ];

  const mobileNavItems = [
    navItems[0],
    navItems[1],
    navItems[2],
    navItems[5],
    navItems.find((item) => location.pathname.startsWith(item.path)),
  ].filter((item, index, items) => item && items.findIndex((entry) => entry.path === item.path) === index);

  const currentPageName =
    navItems.find((item) => location.pathname.startsWith(item.path))?.name ||
    'Dashboard';

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
    <div className="flex h-screen overflow-hidden bg-[#f6f3ee]">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[#ddd3c2] bg-[#faf7f0] shadow-[4px_0_20px_-8px_rgba(50,34,11,0.15)] transition-transform duration-300 md:relative md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#ddd3c2] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7a5b0a] text-sm font-bold text-white shadow-[0_8px_20px_-8px_rgba(122,91,10,0.8)]">
              PK
            </div>
            <div>
              <h1 className="font-heading text-sm font-bold text-[#3f2d11]">Admin Panel</h1>
              <p className="text-xs text-[#9f8e78]">Padukuhan Kayen</p>
            </div>
          </div>
          <button
            className="text-[#9f8e78] transition-colors hover:text-[#7a5b0a] md:hidden"
            onClick={() => setIsSidebarOpen(false)}
            type="button"
          >
            X
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#7a5b0a] text-white shadow-[0_8px_20px_-10px_rgba(122,91,10,0.8)]'
                    : 'text-[#7a6e5a] hover:bg-[#ece8df] hover:text-[#5a430d]'
                }`}
              >
                <span className="inline-flex w-7 justify-center text-[11px] font-bold leading-none">
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[#ddd3c2] p-4">
          <div className="mb-3 px-2">
            <p className="truncate text-xs font-semibold text-[#5a430d]">{user.email}</p>
            <p className="text-[11px] text-[#9f8e78]">Administrator</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#e5c8c8] px-4 py-2.5 text-sm font-semibold text-[#b54040] transition-colors hover:bg-[#fdf0f0]"
            type="button"
          >
            <span>{'<'}</span> Logout
          </button>
        </div>
      </aside>

      <div className="flex h-screen w-full flex-1 flex-col overflow-hidden">
        <header className="flex h-[64px] shrink-0 items-center justify-between border-b border-[#ddd3c2] bg-[#faf7f0] px-4 shadow-sm md:px-6">
          <div className="flex items-center gap-3">
            <button
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[#9f8e78] transition-colors hover:bg-[#ece8df] hover:text-[#7a5b0a] md:hidden"
              onClick={() => setIsSidebarOpen(true)}
              type="button"
            >
              =
            </button>
            <div>
              <h2 className="font-heading text-base font-bold text-[#3f2d11]">{currentPageName}</h2>
              <p className="hidden text-[11px] text-[#9f8e78] sm:block">Portal Padukuhan Kayen</p>
            </div>
          </div>
          <Link
            to="/"
            target="_blank"
            className="flex min-w-[72px] items-center justify-center gap-2 rounded-xl bg-[#e7dcc3] px-4 py-2.5 text-xs font-bold tracking-[0.08em] text-[#7a5b0a] transition-colors hover:bg-[#dccdaa]"
          >
            <span>WWW</span>
            <span className="hidden sm:inline">Lihat Website</span>
          </Link>
        </header>

        <div className="border-b border-[#ddd3c2] bg-[#faf7f0] px-4 py-3 md:hidden">
          <div className="grid grid-cols-2 gap-2">
            {mobileNavItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex min-h-[44px] items-center justify-center rounded-xl px-3 py-2 text-center text-xs font-semibold ${
                    isActive
                      ? 'bg-[#7a5b0a] text-white'
                      : 'border border-[#ddd3c2] bg-white text-[#6f604b]'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="col-span-2 flex min-h-[44px] items-center justify-center rounded-xl border border-[#ddd3c2] bg-white px-3 py-2 text-xs font-semibold text-[#6f604b]"
            >
              Menu Lainnya
            </button>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto bg-[#f6f3ee] p-4 pb-24 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
