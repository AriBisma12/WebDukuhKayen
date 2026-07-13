import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

export default function AdminDashboard() {
  const [counts, setCounts] = useState({
    berita: 0,
    dokumentasi: 0,
    video: 0,
    aparatur: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true);
      const [b, d, v, a] = await Promise.all([
        supabase.from('berita_desa').select('id', { count: 'exact', head: true }),
        supabase.from('posting_dokumentasi').select('id', { count: 'exact', head: true }),
        supabase.from('video_dokumentasi').select('id', { count: 'exact', head: true }),
        supabase.from('aparatur_desa').select('id', { count: 'exact', head: true }),
      ]);
      setCounts({
        berita: b.count || 0,
        dokumentasi: d.count || 0,
        video: v.count || 0,
        aparatur: a.count || 0,
      });
      setLoading(false);
    };
    fetchCounts();
  }, []);

  const statCards = [
    { title: 'Kabar Padukuhan', count: counts.berita, icon: '📰', link: '/admin/kabar', color: 'bg-[#fffbeb] border-[#f0cc5a]', iconBg: 'bg-[#f0cc5a] text-[#5e4300]' },
    { title: 'Posting Dokumentasi', count: counts.dokumentasi, icon: '📷', link: '/admin/dokumentasi', color: 'bg-[#f0fdf4] border-[#86efac]', iconBg: 'bg-[#86efac] text-[#166534]' },
    { title: 'Video Dokumentasi', count: counts.video, icon: '🎬', link: '/admin/video', color: 'bg-[#eff6ff] border-[#93c5fd]', iconBg: 'bg-[#93c5fd] text-[#1e40af]' },
    { title: 'Aparatur Desa', count: counts.aparatur, icon: '👥', link: '/admin/aparatur', color: 'bg-[#fdf4ff] border-[#d8b4fe]', iconBg: 'bg-[#d8b4fe] text-[#6b21a8]' },
  ];

  const quickLinks = [
    { label: 'Tambah Kabar Padukuhan', icon: '✍️', to: '/admin/kabar', desc: 'Publikasikan berita dan pengumuman padukuhan.' },
    { label: 'Tambah Dokumentasi', icon: '📸', to: '/admin/dokumentasi', desc: 'Upload foto kegiatan dan acara padukuhan.' },
    { label: 'Edit Aparatur Desa', icon: '👤', to: '/admin/aparatur', desc: 'Perbarui data perangkat dan aparatur padukuhan.' },
    { label: 'Update Statistik', icon: '📊', to: '/admin/statistik-desa', desc: 'Perbarui data kependudukan padukuhan.' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl font-extrabold text-[#3f2d11]">Ikhtisar Sistem</h1>
        <p className="text-[#9f8e78] mt-1">
          Selamat datang di panel admin. Berikut ringkasan data portal Padukuhan Kayen.
        </p>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-[#ece8df] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <Link
              key={card.title}
              to={card.link}
              className={`rounded-2xl border ${card.color} p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group`}
            >
              <div className={`w-11 h-11 rounded-xl ${card.iconBg} flex items-center justify-center text-xl mb-4 shadow-sm`}>
                {card.icon}
              </div>
              <div className="font-heading text-4xl font-extrabold text-[#3f2d11]">{card.count}</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#9f8e78] mt-2">{card.title}</div>
            </Link>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#faf7f0] rounded-2xl border border-[#ddd3c2] p-6 shadow-sm">
          <h2 className="font-heading text-lg font-bold text-[#3f2d11] mb-4 flex items-center gap-2">
            <span>⚡</span> Aksi Cepat
          </h2>
          <div className="space-y-3">
            {quickLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-4 p-4 rounded-xl border border-[#ddd3c2] hover:border-[#c59f38] hover:bg-[#fffbeb] transition-all group"
              >
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <div className="font-semibold text-sm text-[#3f2d11] group-hover:text-[#7a5b0a]">{item.label}</div>
                  <div className="text-xs text-[#9f8e78]">{item.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-[#faf7f0] rounded-2xl border border-[#ddd3c2] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="font-heading text-lg font-bold text-[#3f2d11] mb-3 flex items-center gap-2">
              <span>ℹ️</span> Panduan Penggunaan
            </h2>
            <ul className="space-y-3 text-sm text-[#7a6e5a] leading-relaxed">
              <li className="flex gap-2"><span className="text-[#c59f38] font-bold mt-0.5">→</span> Gunakan menu sidebar untuk mengelola setiap bagian konten website.</li>
              <li className="flex gap-2"><span className="text-[#c59f38] font-bold mt-0.5">→</span> Setiap perubahan akan langsung tampil di website publik.</li>
              <li className="flex gap-2"><span className="text-[#c59f38] font-bold mt-0.5">→</span> Pastikan gambar menggunakan URL yang valid dan dapat diakses publik.</li>
              <li className="flex gap-2"><span className="text-[#c59f38] font-bold mt-0.5">→</span> Urutan tampil (angka kecil = tampil lebih awal).</li>
            </ul>
          </div>
          <Link
            to="/"
            target="_blank"
            className="mt-6 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#7a5b0a] text-white font-semibold text-sm hover:bg-[#684d08] transition-all shadow-[0_12px_24px_-10px_rgba(122,91,10,0.7)] hover:-translate-y-0.5"
          >
            🌐 Lihat Website Publik
          </Link>
        </div>
      </div>
    </div>
  );
}
