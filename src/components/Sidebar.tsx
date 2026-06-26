import React from 'react';
import { useAppState } from '../AppStateContext';
import { 
  LayoutDashboard, 
  Users, 
  Award, 
  Calendar, 
  Sparkles, 
  ShieldAlert, 
  Bell, 
  BarChart3, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Droplets,
  CalendarCheck
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const { currentView, setCurrentView, currentUser, logout, notifications, users } = useAppState();

  if (!currentUser) return null;

  const isAdmin = currentUser.role === 'admin';
  
  // Unread notifications count
  const unreadCount = notifications.filter(n => !n.read && (!n.userId || n.userId === currentUser.id)).length;
  // Pending registrations count
  const pendingRegsCount = users.filter(u => u.status === 'pending').length;

  const adminMenu = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'members', label: 'Members Directory', icon: Users, badge: null },
    { id: 'registrations', label: 'Join Requests', icon: ShieldAlert, badge: pendingRegsCount > 0 ? pendingRegsCount : null },
    { id: 'attendance', label: 'Check-In & Logs', icon: CalendarCheck },
    { id: 'events', label: 'Events Manager', icon: Award },
    { id: 'holidays', label: 'Calendar Rules', icon: Calendar },
    { id: 'reports', label: 'Analytics Reports', icon: BarChart3 },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  const memberMenu = [
    { id: 'dashboard', label: 'My Dashboard', icon: LayoutDashboard },
    { id: 'membership', label: 'My Membership', icon: Sparkles },
    { id: 'attendance', label: 'My Attendance', icon: CalendarCheck },
    { id: 'events', label: 'Pool Events', icon: Award },
    { id: 'holidays', label: 'Pool Schedule', icon: Calendar },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadCount > 0 ? unreadCount : null },
    { id: 'settings', label: 'My Profile', icon: Settings },
  ];

  const menuItems = isAdmin ? adminMenu : memberMenu;

  return (
    <aside 
      className={`h-screen bg-white border-r border-slate-200 text-slate-600 flex flex-col justify-between transition-all duration-300 ease-in-out select-none z-40 fixed md:sticky top-0 left-0
        ${collapsed 
          ? '-translate-x-full md:translate-x-0 md:w-16 w-64' 
          : 'translate-x-0 md:w-64 w-64'
        }
      `}
      id="sidebar-container"
    >
      {/* Sidebar Header Brand */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shrink-0 shadow-sm">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-sans font-bold text-sm tracking-tight text-slate-800 leading-tight truncate">
                  Swimfront<span className="text-blue-600">MS</span>
                </span>
                <span className="text-[10px] font-mono text-blue-500 tracking-widest uppercase font-semibold">
                  Baroda • BSMS
                </span>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex w-6 h-6 rounded-full hover:bg-slate-100 items-center justify-center text-slate-400 hover:text-slate-600 border border-slate-200 bg-white absolute -right-3 top-5 shadow-sm z-50 cursor-pointer"
            id="sidebar-toggle-btn"
          >
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Navigation items */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  if (window.innerWidth < 768) {
                    setCollapsed(true);
                  }
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg transition-all duration-200 cursor-pointer text-sm font-medium group
                  ${isActive 
                    ? 'bg-blue-50 text-blue-600 font-semibold border-r-3 border-blue-600' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600 border-r-3 border-transparent'
                  }
                `}
                id={`sidebar-nav-${item.id}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <IconComponent className={`w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-105
                    ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-500'}
                  `} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!collapsed && item.badge !== undefined && item.badge !== null && (
                  <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-blue-100 text-blue-700 rounded-full leading-none">
                    {item.badge}
                  </span>
                )}
                {collapsed && item.badge !== undefined && item.badge !== null && (
                  <div className="absolute right-2 w-2 h-2 rounded-full bg-blue-500 shadow-md shadow-blue-500/20" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Footer Profile Summary */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/80">
        <div className="flex items-center justify-between gap-2 overflow-hidden">
          <div className="flex items-center gap-2.5 min-w-0">
            {currentUser.photoUrl ? (
              <img 
                src={currentUser.photoUrl} 
                alt={currentUser.name} 
                className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/20"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-sans font-bold text-sm shrink-0 border border-blue-100">
                {currentUser.name.charAt(0)}
              </div>
            )}
            
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-slate-800 truncate leading-tight">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-slate-500 truncate leading-none capitalize mt-0.5 flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${isAdmin ? 'bg-amber-500' : 'bg-blue-500'}`} />
                  {currentUser.role}
                </span>
              </div>
            )}
          </div>

          {!collapsed && (
            <button 
              onClick={logout}
              className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors shrink-0 cursor-pointer"
              title="Sign Out"
              id="sidebar-logout-btn"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
