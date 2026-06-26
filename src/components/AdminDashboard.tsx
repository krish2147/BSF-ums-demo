import React from 'react';
import { useAppState } from '../AppStateContext';
import { 
  Users, 
  Sparkles, 
  Clock, 
  ShieldAlert, 
  TrendingUp, 
  DollarSign, 
  Activity, 
  ArrowUpRight,
  CircleAlert
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const { users, attendance, setCurrentView, approveRegistration, approveRenewal, plans } = useAppState();

  // Metrics calculations
  const totalMembers = users.filter(u => u.role === 'member').length;
  const approvedMembers = users.filter(u => u.role === 'member' && u.status === 'approved');
  
  // Active means status approved and membershipExpiry is in the future
  const activeMembersCount = approvedMembers.filter(u => {
    if (!u.membershipExpiry) return false;
    return new Date(u.membershipExpiry).getTime() > Date.now();
  }).length;

  const expiredMembersCount = approvedMembers.length - activeMembersCount;

  const pendingRegistrations = users.filter(u => u.role === 'member' && u.status === 'pending');
  
  // Pending renewals has [RENEWAL_PENDING:planId] in medicalInformation
  const pendingRenewals = users.filter(u => u.role === 'member' && u.status === 'approved' && u.medicalInformation.includes('[RENEWAL_PENDING'));

  // Today's attendance
  const todayStr = new Date().toISOString().split('T')[0];
  const todaysAttendance = attendance.filter(a => a.date === todayStr);

  // Growth percentage (Simulated)
  const growthPercent = 14.8;

  // Capacity calculations
  const currentCheckedIn = todaysAttendance.filter(a => !a.checkOutTime).length;
  const maxCapacity = 120;
  const availableSlots = Math.max(0, maxCapacity - currentCheckedIn);
  const capacityPercent = Math.min(100, Math.round((currentCheckedIn / maxCapacity) * 100));

  // Revenue estimation
  const totalRevenue = approvedMembers.reduce((sum, user) => {
    const plan = plans.find(p => p.id === user.planId);
    return sum + (plan ? plan.price : 0);
  }, 0);

  // Mock data for Recharts curves
  const monthlySignupsData = [
    { month: 'Jan', members: 12 },
    { month: 'Feb', members: 19 },
    { month: 'Mar', members: 26 },
    { month: 'Apr', members: 34 },
    { month: 'May', members: 48 },
    { month: 'Jun', members: totalMembers },
  ];

  const weeklyAttendanceData = [
    { name: 'Mon', visits: 18 },
    { name: 'Tue', visits: 24 },
    { name: 'Wed', visits: 15 },
    { name: 'Thu', visits: 31 },
    { name: 'Fri', visits: 28 },
    { name: 'Sat', visits: 45 },
    { name: 'Sun', visits: 38 },
  ];

  const COLORS = ['#0066FF', '#00D1FF', '#3B82F6', '#60A5FA'];

  return (
    <div className="space-y-6" id="admin-dashboard-view">
      
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Members */}
        <div 
          onClick={() => setCurrentView('members')}
          className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group relative overflow-hidden"
        >
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Members</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
              <Users className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-sans font-extrabold text-slate-800 font-mono">{totalMembers}</span>
            <span className="text-xs text-emerald-500 font-bold flex items-center gap-0.5">
              +{growthPercent}%
              <TrendingUp className="w-3 h-3" />
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium mt-1">Directory size of register records</p>
        </div>

        {/* Active Members */}
        <div 
          onClick={() => setCurrentView('members')}
          className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group relative overflow-hidden"
        >
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active passes</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-sans font-extrabold text-slate-800 font-mono">{activeMembersCount}</span>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded-md font-bold font-mono">
              {Math.round((activeMembersCount / (totalMembers || 1)) * 100)}% ratio
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium mt-1">Members with valid swimming plans</p>
        </div>

        {/* Pending Registrations */}
        <div 
          onClick={() => setCurrentView('registrations')}
          className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group relative overflow-hidden"
        >
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Pending Registrations</span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-300
              ${pendingRegistrations.length > 0 
                ? 'bg-amber-50 text-amber-600 border-amber-200 group-hover:bg-amber-500 group-hover:text-white' 
                : 'bg-slate-50 text-slate-400 border-slate-100'
              }
            `}>
              <ShieldAlert className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-sans font-extrabold text-slate-800 font-mono">{pendingRegistrations.length}</span>
            {pendingRegistrations.length > 0 && (
              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-md font-bold font-mono animate-pulse">
                ACTION REQ
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-400 font-medium mt-1">Awaiting profile registration vetting</p>
        </div>

        {/* Pending Renewals */}
        <div 
          onClick={() => setCurrentView('members')}
          className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group relative overflow-hidden"
        >
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Pending Renewals</span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-300
              ${pendingRenewals.length > 0 
                ? 'bg-blue-50 text-blue-600 border-blue-200 group-hover:bg-blue-600 group-hover:text-white' 
                : 'bg-slate-50 text-slate-400 border-slate-100'
              }
            `}>
              <Activity className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-sans font-extrabold text-slate-800 font-mono">{pendingRenewals.length}</span>
            {pendingRenewals.length > 0 && (
              <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded-md font-bold font-mono">
                EXTENSIONS
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-400 font-medium mt-1">Existing members requesting pass renews</p>
        </div>

      </div>

      {/* Advanced Capacity & Quick Actions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Real-time Pool Capacity Progress */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start border-b border-slate-50 pb-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Swimfront Live Load Index</h3>
                <p className="text-xs text-slate-400 font-medium">Real-time gate tracking counters</p>
              </div>
              <span className="px-2.5 py-0.5 text-[9px] font-mono font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded-full uppercase">
                Gate Active
              </span>
            </div>

            <div className="flex items-center gap-6 my-6">
              {/* Radial simulated percentage */}
              <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="56" cy="56" r="48" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                  <circle 
                    cx="56" 
                    cy="56" 
                    r="48" 
                    stroke="url(#gradient-blue)" 
                    strokeWidth="10" 
                    fill="transparent" 
                    strokeDasharray={2 * Math.PI * 48}
                    strokeDashoffset={2 * Math.PI * 48 * (1 - Math.max(0.05, capacityPercent / 100))}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00D1FF" />
                      <stop offset="100%" stopColor="#0066FF" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-xl font-sans font-black text-slate-800 font-mono">{currentCheckedIn}</span>
                  <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Swimmers</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span className="text-slate-500 font-medium">Checked-In: <strong className="text-slate-800 font-mono">{currentCheckedIn}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                  <span className="text-slate-500 font-medium">Empty Slots: <strong className="text-slate-800 font-mono">{availableSlots}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  <span className="text-slate-500 font-medium">Max Limit: <strong className="text-slate-800 font-mono">{maxCapacity}</strong></span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-500">Occupancy Ratio</span>
            <span className="text-blue-600 font-mono">{capacityPercent}% Capacity Loaded</span>
          </div>
        </div>

        {/* Quick Registration Review Board */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center border-b border-slate-50 pb-3 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Awaiting Registration Actions</h3>
              <p className="text-xs text-slate-400 font-medium">Approve profile vetting requests in one-click</p>
            </div>
            <button 
              onClick={() => setCurrentView('registrations')}
              className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 cursor-pointer"
            >
              Manage Requests
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {pendingRegistrations.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              Excellent! No pending membership profiles require review.
            </div>
          ) : (
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {pendingRegistrations.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-slate-700">{item.name}</p>
                      <span className="text-[9px] font-mono font-medium text-slate-400">({item.id})</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">{item.email} • {item.phone}</p>
                    <span className="text-[9px] font-mono text-slate-400 block mt-1">Applied: {item.joinDate}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => approveRegistration(item.id)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] rounded-lg transition-all cursor-pointer shadow-sm shadow-blue-600/10"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => setCurrentView('registrations')}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-[10px] rounded-lg transition-all cursor-pointer"
                    >
                      Inspect
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Advanced Recharts Visualization Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Member Sign-up growth trend (AreaChart) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-5">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                Member Onboarding Sign-up Curve
              </h3>
              <p className="text-xs text-slate-400 font-medium">Historical cumulative signups (H1 2026)</p>
            </div>
            
            <div className="flex items-center gap-2 bg-slate-100 px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              SaaS Target Met
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlySignupsData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0066FF" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#0066FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} />
                <Tooltip 
                  contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                  labelStyle={{ fontWeight: 'bold', color: '#0066FF' }}
                />
                <Area type="monotone" dataKey="members" stroke="#0066FF" strokeWidth={3} fillOpacity={1} fill="url(#colorMembers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly check-ins Peak (BarChart) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-5">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-blue-500" />
                Weekly Peak Check-Ins
              </h3>
              <p className="text-xs text-slate-400 font-medium">Attendance densities across weekdays</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyAttendanceData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(241, 245, 249, 0.4)', borderRadius: 8 }}
                  contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                />
                <Bar dataKey="visits" radius={[8, 8, 0, 0]}>
                  {weeklyAttendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Financial projection / plan conversion widget */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-blue-400 shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold tracking-tight">Active Pool Subscription Value</h4>
            <p className="text-xs text-slate-300 font-medium mt-0.5">Sum value of approved current membership plans</p>
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-[10px] text-slate-400 font-semibold font-mono">ESTIMATED RUNRATE:</span>
          <span className="text-2xl font-sans font-black text-blue-400 font-mono">${totalRevenue}.00</span>
        </div>
      </div>

    </div>
  );
};
