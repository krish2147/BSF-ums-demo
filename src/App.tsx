/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AppStateProvider, useAppState } from './AppStateContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { AuthScreen } from './components/AuthScreen';
import { AdminDashboard } from './components/AdminDashboard';
import { MemberDashboard } from './components/MemberDashboard';
import { MembersView } from './components/MembersView';
import { RegistrationsView } from './components/RegistrationsView';
import { AttendanceView } from './components/AttendanceView';
import { EventsView } from './components/EventsView';
import { HolidaysView } from './components/HolidaysView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { MembershipView } from './components/MembershipView';

function AppContent() {
  const { currentUser, currentView } = useAppState();
  const [collapsed, setCollapsed] = useState(false);

  // Collapse sidebar by default on mobile screens on mount
  useEffect(() => {
    if (window.innerWidth < 768) {
      setCollapsed(true);
    }
  }, []);

  // If user is not authenticated, render the high-fidelity Auth suite
  if (!currentUser) {
    return <AuthScreen />;
  }

  const isAdmin = currentUser.role === 'admin';

  // Dynamic View router rendering
  const renderActiveView = () => {
    switch (currentView) {
      case 'dashboard':
        return isAdmin ? <AdminDashboard /> : <MemberDashboard />;
      case 'members':
        return isAdmin ? <MembersView /> : null;
      case 'registrations':
        return isAdmin ? <RegistrationsView /> : null;
      case 'membership':
        return !isAdmin ? <MembershipView /> : null;
      case 'attendance':
        return <AttendanceView />;
      case 'events':
        return <EventsView />;
      case 'holidays':
        return <HolidaysView />;
      case 'reports':
        return isAdmin ? <ReportsView /> : null;
      case 'settings':
        return <SettingsView />;
      default:
        return isAdmin ? <AdminDashboard /> : <MemberDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden text-slate-700 font-sans" id="app-shell-container">
      {/* Dynamic Navigation Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Mobile backdrop overlay when sidebar is open */}
      {!collapsed && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-35 md:hidden"
          onClick={() => setCollapsed(true)}
          id="sidebar-mobile-backdrop"
        />
      )}

      {/* Main Content shell panel */}
      <div 
        className={`flex-1 flex flex-col min-w-0 h-screen transition-all duration-300 ease-in-out
          ${collapsed ? 'md:pl-16' : 'md:pl-64'}
          pl-0
        `}
        id="main-shell-wrapper"
      >
        {/* Header containing clock, notifications popover, global searches, profile dropdowns */}
        <Header onMenuToggle={() => setCollapsed(!collapsed)} />

        {/* Dynamic content canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6" id="dashboard-canvas">
          <div className="max-w-7xl mx-auto space-y-6">
            {renderActiveView()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <AppContent />
    </AppStateProvider>
  );
}

