import { useState, useEffect } from 'react';
import { ScheduleProvider } from './contexts/ScheduleContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { NotificationBanner } from './components/NotificationBanner';

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <ScheduleProvider>
      <div className="h-screen flex flex-col">
        <Header onToggleSidebar={toggleSidebar} isSidebarCollapsed={isSidebarCollapsed} />
        <NotificationBanner />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar isCollapsed={isSidebarCollapsed} onExpand={() => setIsSidebarCollapsed(false)} />
          <MainContent />
        </div>
      </div>
    </ScheduleProvider>
  );
}

export default App;
