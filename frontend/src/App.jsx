import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useUi } from './Ui';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import Home from './pages/Home';
import VendorDashboard from './pages/VendorDashboard';
import AdminDashboard from './pages/AdminDashboard';

function OpenAuth({ mode }) {
  const { openAuth } = useUi();
  useEffect(() => openAuth(mode), [mode]);
  return <Navigate to="/" replace />;
}

function Guard({ role, children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="center"><span className="spin" /></div>;
  if (!user) return <OpenAuth mode="login" />;
  if (user.role !== role) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  useEffect(() => {
    document.title = 'Go shop – Shop smart, live better';
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<OpenAuth mode="login" />} />
          <Route path="/register" element={<OpenAuth mode="register" />} />
          <Route
            path="/vendor"
            element={
              <Guard role="vendor">
                <VendorDashboard />
              </Guard>
            }
          />
          <Route
            path="/admin"
            element={
              <Guard role="admin">
                <AdminDashboard />
              </Guard>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <AuthModal />

      <footer className="foot mb-0">
        © {new Date().getFullYear()} Go shop · Shop smart, live better
      </footer>
    </div>
  );
}