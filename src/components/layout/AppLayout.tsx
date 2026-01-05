import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { FloatingActionButton } from '@/components/FloatingActionButton';

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      <div className="lg:pl-64">
        <Header onToggleSidebar={toggleSidebar} />
        
        <main className="container mx-auto px-4 py-6 pb-24 lg:pb-6">
          <Outlet />
        </main>
      </div>

      <FloatingActionButton />
    </div>
  );
}

