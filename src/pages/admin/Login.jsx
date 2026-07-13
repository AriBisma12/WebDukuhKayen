import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      if (error.message?.includes('Email not confirmed')) {
        setError('Email belum dikonfirmasi. Cek inbox email atau nonaktifkan konfirmasi email di Supabase Dashboard.');
      } else if (error.message?.includes('Invalid login credentials')) {
        setError('Email atau password salah. Silakan coba lagi.');
      } else {
        setError(error.message || 'Terjadi kesalahan. Silakan coba lagi.');
      }
    } else {
      navigate('/admin/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-[#f6f3ee]">
      {/* Left side — Branding */}
      <div className="hidden lg:flex w-1/2 relative flex-col items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80"
          alt="Padukuhan Kayen"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,_rgba(55,39,10,0.85),_rgba(122,91,10,0.7))]" />
        <div className="relative z-10 text-center px-12">
          <div className="w-20 h-20 rounded-[1.5rem] bg-[#f4c94b] flex items-center justify-center font-heading text-3xl font-extrabold text-[#5e4300] mx-auto mb-6 shadow-[0_20px_40px_-16px_rgba(244,201,75,0.6)]">
            PK
          </div>
          <h1 className="font-heading text-5xl font-extrabold text-white mb-4 leading-tight">
            Padukuhan<br />Kayen
          </h1>
          <p className="text-white/80 text-lg leading-8 max-w-sm mx-auto">
            Sistem pengelolaan portal informasi resmi Padukuhan Kayen yang transparan dan modern.
          </p>
          <div className="mt-8 flex justify-center gap-6 text-white/60 text-sm">
            <div className="text-center">
              <div className="font-heading text-2xl font-bold text-[#f4c94b]">100%</div>
              <div>Transparan</div>
            </div>
            <div className="w-px bg-white/20" />
            <div className="text-center">
              <div className="font-heading text-2xl font-bold text-[#f4c94b]">Aman</div>
              <div>Terenkripsi</div>
            </div>
            <div className="w-px bg-white/20" />
            <div className="text-center">
              <div className="font-heading text-2xl font-bold text-[#f4c94b]">Real-time</div>
              <div>Sinkronisasi</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side — Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#faf7f0]">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-[1.2rem] bg-[#7a5b0a] flex items-center justify-center font-heading text-2xl font-bold text-white mx-auto mb-5 shadow-[0_16px_30px_-12px_rgba(122,91,10,0.8)]">
              PK
            </div>
            <h2 className="font-heading text-3xl font-extrabold text-[#3f2d11]">Selamat Datang</h2>
            <p className="text-[#9f8e78] mt-2">Masuk ke Panel Admin Padukuhan Kayen</p>
          </div>

          {error && (
            <div className="bg-[#fdf0f0] border border-[#e5c8c8] text-[#b54040] px-4 py-3 rounded-xl mb-6 flex items-center gap-3 text-sm">
              <span className="text-lg">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[#5a430d] mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#9f8e78] text-lg">
                  ✉
                </span>
                <input
                  id="admin-email"
                  type="email"
                  required
                  placeholder="admin@padukuhankayen.go.id"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#ddd3c2] bg-white text-[#3f2d11] placeholder-[#c5b9a8] focus:outline-none focus:ring-2 focus:ring-[#7a5b0a] focus:border-[#7a5b0a] transition-all shadow-sm text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#5a430d] mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#9f8e78] text-lg">
                  🔒
                </span>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-[#ddd3c2] bg-white text-[#3f2d11] placeholder-[#c5b9a8] focus:outline-none focus:ring-2 focus:ring-[#7a5b0a] focus:border-[#7a5b0a] transition-all shadow-sm text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#9f8e78] hover:text-[#7a5b0a] transition-colors text-sm"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              id="admin-login-btn"
              disabled={loading}
              className="w-full bg-[#7a5b0a] text-white py-3.5 rounded-xl font-heading font-bold text-base mt-2 hover:bg-[#684d08] transition-all disabled:opacity-50 flex justify-center items-center gap-2 shadow-[0_16px_30px_-12px_rgba(122,91,10,0.8)] hover:shadow-[0_20px_36px_-12px_rgba(122,91,10,0.9)] hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Memuat...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-[#b0a08a]">
            © {new Date().getFullYear()} Pemerintah Padukuhan Kayen. Seluruh hak cipta dilindungi.
          </div>
        </div>
      </div>
    </div>
  );
}
