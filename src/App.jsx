import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Public pages
import Home from './pages/Home';
import ProfilDesa from './pages/ProfilDesa';
import KabarPadukuhan from './pages/KabarPadukuhan';
import DokumentasiKegiatan from './pages/DokumentasiKegiatan';

// Admin layout + pages
import AdminLayout from './components/AdminLayout';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminKabar from './pages/admin/AdminKabar';
import AdminDokumentasi from './pages/admin/AdminDokumentasi';
import AdminTampilan from './pages/admin/AdminTampilan';
import {
  AdminVideo,
  AdminStatistikDesa,
  AdminStatistikProfil,
  AdminAparatur,
  AdminBatasWilayah,
  AdminNavigasi,
} from './pages/admin/AdminPages';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/profil-desa" element={<ProfilDesa />} />
        <Route path="/kabar-padukuhan" element={<KabarPadukuhan />} />
        <Route path="/dokumentasi-kegiatan" element={<DokumentasiKegiatan />} />

        {/* Admin Routes */}
        <Route path="/admin">
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="login" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="kabar" element={<AdminKabar />} />
            <Route path="dokumentasi" element={<AdminDokumentasi />} />
            <Route path="tampilan" element={<AdminTampilan />} />
            <Route path="video" element={<AdminVideo />} />
            <Route path="statistik-desa" element={<AdminStatistikDesa />} />
            <Route path="statistik-profil" element={<AdminStatistikProfil />} />
            <Route path="aparatur" element={<AdminAparatur />} />
            <Route path="batas-wilayah" element={<AdminBatasWilayah />} />
            <Route path="navigasi" element={<AdminNavigasi />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
