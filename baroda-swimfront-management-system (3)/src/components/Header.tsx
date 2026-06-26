import React, { useState, useEffect } from 'react';
import { useAppState } from '../AppStateContext';
import { 
  Bell, 
  Search, 
  Clock, 
  Menu, 
  ChevronDown, 
  ShieldCheck, 
  CheckCircle, 
  HelpCircle,
  CalendarDays,
  CircleAlert
} from 'lucide-react';

interface HeaderProps {
  onMenuToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { currentUser, logout, notifications, markNotificationAsRead, clearNotifications } = useAppState();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Tick the clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!currentUser) return null;

  // Filter notifications relevant to current user
  const userNotifications = notifications.filter(n => !n.userId || n.userId === currentUser.id);
  const unreadNotifications = userNotifications.filter(n => !n.read);

  // Formatted date and time
  const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const formattedDate = currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <header className="h-16 border-b border-slate-200/80 bg-white/70 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30 select-none">
      
      {/* Left side: Mobile menu toggle + breadcrumb */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuToggle}
          className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
          id="mobile-sidebar-toggle"
        >
          <Menu className="w-5.5 h-5.5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-mono text-xs font-semibold tracking-wider uppercase">BSMS</span>
          <span className="text-slate-300">/</span>
          <span className="font-sans font-medium text-slate-800 text-sm tracking-tight capitalize">
            {currentUser.role === 'admin' ? 'Enterprise Core' : 'Member Portal'}
          </span>
        </div>
      </div>

      {/* Center: Search & Real-time clock */}
      <div className="hidden lg:flex items-center gap-6">
        {/* Real-time Clock */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/50">
          <Clock className="w-4 h-4 text-blue-500" />
          <span className="font-mono text-xs font-semibold tracking-tight">{formattedTime}</span>
          <span className="text-slate-300 text-xs">|</span>
          <span className="text-xs font-medium text-slate-500">{formattedDate}</span>
        </div>

        {/* Global Search Bar (Visual) */}
        <div className="relative w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Quick search commands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-medium pl-9 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 placeholder-slate-400"
          />
        </div>
      </div>

      {/* Right side: Notifications + User dropdown */}
      <div className="flex items-center gap-4">
        
        {/* Help Icon */}
        <div className="hidden sm:flex p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer" title="Documentation">
          <HelpCircle className="w-5 h-5" />
        </div>

        {/* Notifications Icon with Popover */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-all cursor-pointer"
            id="notifications-button"
          >
            <Bell className="w-5.5 h-5.5" />
            {unreadNotifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 shadow-md ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 text-left animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                <span className="font-sans font-bold text-sm text-slate-800">System Notifications</span>
                <button 
                  onClick={clearNotifications}
                  className="text-[10px] text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                >
                  Mark all read
                </button>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2.5">
                {userNotifications.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    No notifications at this time.
                  </div>
                ) : (
                  userNotifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      onClick={() => markNotificationAsRead(notif.id)}
                      className={`p-2.5 rounded-xl border transition-all duration-200 cursor-pointer
                        ${notif.read 
                          ? 'bg-slate-50 border-slate-100/50 text-slate-500' 
                          : 'bg-blue-50/25 border-blue-100/60 text-slate-800 shadow-sm shadow-blue-500/5'
                        }
                      `}
                    >
                      <div className="flex items-start gap-2">
                        {notif.type === 'membership' && <ShieldCheck className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />}
                        {notif.type === 'event' && <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />}
                        {notif.type === 'holiday' && <CalendarDays className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />}
                        {notif.type === 'system' && <CircleAlert className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />}
                        
                        <div className="min-w-0">
                          <p className="text-xs font-semibold leading-tight truncate">{notif.title}</p>
                          <p className="text-[10px] text-slate-500 leading-normal mt-0.5 font-medium">{notif.message}</p>
                          <span className="text-[8px] font-mono text-slate-400 mt-1 block">{notif.date}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-slate-200" />

        {/* User Profile dropdown */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
            id="profile-dropdown-button"
          >
            {currentUser.photoUrl ? (
              <img 
                src={currentUser.photoUrl} 
                alt={currentUser.name} 
                className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/10"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-sans font-bold text-xs shrink-0">
                {currentUser.name.charAt(0)}
              </div>
            )}
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-1.5 z-50 text-left animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800 truncate">{currentUser.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
              </div>
              
              <button 
                onClick={() => {
                  logout();
                  setShowProfileMenu(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-red-50/60 text-xs font-medium text-red-500 rounded-xl transition-all cursor-pointer mt-1"
                id="header-logout-option"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
