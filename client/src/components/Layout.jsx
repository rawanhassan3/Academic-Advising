import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans antialiased text-[#1e3a5f]">
      <Sidebar
        user={user}
        logout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Navbar user={user} onMenuClick={() => setIsSidebarOpen(true)} />

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
