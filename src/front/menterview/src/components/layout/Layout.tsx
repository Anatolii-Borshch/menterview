import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useTokenRefresh } from  '../../api/useTokenRefresh';

export const Layout = () => {
  useTokenRefresh();

  return (
    <div className="min-h-screen bg-snow flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};