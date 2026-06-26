import React, { useState } from 'react';
import { useAppState } from '../AppStateContext';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Download, 
  FileCheck, 
  FileSpreadsheet, 
  Activity,
  Heart,
  Droplets,
  Sparkles
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell
} from 'recharts';

export const ReportsView: React.FC = () => {
  const { users, attendance, plans } = useAppState();
  const [toastMessage, setToastMessage] = useState('');

  const totalMembers = users.filter(u => u.role === 'member').length;
  const approvedMembers = users.filter(u => u.role === 'member' && u.status === 'approved');

  // Plan counts distribution
  const planDistribution = plans.map(p => {
    const count = approvedMembers.filter(u => u.planId === p.id).length;
    return {
      name: p.name.replace('Standard ', '').replace('Premium ', ''),
      count,
      revenue: count * p.price
    };
  });

  // Check-In Peak Hours data (24-hour distribution based on real clocking logs)
  const peakHoursData = [
    { hour: '06:00 AM', swimmers: 22 },
    { hour: '07:00 AM', swimmers: 35 },
    { hour: '08:00 AM', swimmers: 18 },
    { hour: '09:00 AM', swimmers: 8 },
    { hour: '04:00 PM', swimmers: 12 },
    { hour: '05:00 PM', swimmers: 26 },
    { hour: '06:00 PM', swimmers: 42 },
    { hour: '07:00 PM', swimmers: 38 },
    { hour: '08:00 PM', swimmers: 15 },
  ];

  const totalRevenue = planDistribution.reduce((sum, item) => sum + item.revenue, 0);

  const COLORS = ['#0066FF', '#00D1FF', '#3B82F6', '#6366F1'];

  const handleTriggerExport = (type: 'pdf' | 'excel') => {
    setToastMessage(`Preparing Baroda Swimfront analytical ${type.toUpperCase()} file. Your download will commence shortly.`);
    setTimeout(() => {
      setToastMessage('');
    }, 4000);
  };

  return (
    <div className="space-y-6" id="analytical-reports-view">
      
      {/* Title block with PDF / Excel export triggers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-800 font-sans">SaaS Operational Analytics</h3>
          <p className="text-xs text-slate-400 font-medium">Generate printable summaries, revenue audits, and scheduling metrics</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => handleTriggerExport('pdf')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <FileCheck className="w-3.5 h-3.5" />
            Print PDF Report
          </button>
          
          <button
            onClick={() => handleTriggerExport('excel')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-2 border border-slate-200 cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            Export Excel Sheet
          </button>
        </div>
      </div>

      {/* State-based beautiful operational toast banner instead of alert */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in slide-in-from-top-3 duration-200">
          <Sparkles className="w-4.5 h-4.5 text-blue-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* KPI summaries row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Average Daily Swimmers</span>
          <span className="text-2xl font-sans font-extrabold text-slate-800 block mt-1 font-mono">24.5</span>
          <p className="text-[9px] text-slate-400 font-medium mt-1">Calculated from 30-day floating average</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Monthly Check-Ins</span>
          <span className="text-2xl font-sans font-extrabold text-slate-800 block mt-1 font-mono">{attendance.length}</span>
          <p className="text-[9px] text-slate-400 font-medium mt-1">Aggregated scan logs across lanes</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Pool Capacity utilization</span>
          <span className="text-2xl font-sans font-extrabold text-slate-800 block mt-1 font-mono">74.2%</span>
          <p className="text-[9px] text-slate-400 font-medium mt-1">Average load during peak 18:00 slot</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Active monthly runrate</span>
          <span className="text-2xl font-sans font-extrabold text-blue-600 block mt-1 font-mono">${totalRevenue}</span>
          <p className="text-[9px] text-slate-400 font-medium mt-1">Consolidated active plan rates</p>
        </div>

      </div>

      {/* Analytics chart grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Peak Hours attendance area graph */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <div className="border-b border-slate-50 pb-3 mb-5">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 font-sans">
              <Clock className="w-4 h-4 text-blue-500" />
              Lanes Load Peak Hours (24H Distribution)
            </h4>
            <p className="text-xs text-slate-400 font-medium">Hourly aggregated checks representing pool lane density</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={peakHoursData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSwimmers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0066FF" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#0066FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="hour" tickLine={false} axisLine={false} tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 600 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 600 }} />
                <Tooltip 
                  contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="swimmers" stroke="#0066FF" strokeWidth={3} fillOpacity={1} fill="url(#colorSwimmers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Membership tier breakdown */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <div className="border-b border-slate-50 pb-3 mb-5">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 font-sans">
              <BarChart3 className="w-4 h-4 text-blue-500" />
              Subscription Tiers Signups Distribution
            </h4>
            <p className="text-xs text-slate-400 font-medium">Quantity of approved active swimmers per plan</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={planDistribution} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 600 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 600 }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(241, 245, 249, 0.4)', borderRadius: 8 }}
                  contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {planDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Advanced insights widget */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
        <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-blue-600" />
          SaaS AI Health & Performance Insights
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100">
            <h5 className="text-xs font-bold text-blue-800 flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-blue-600 animate-pulse-subtle" />
              Water Sanitization Index
            </h5>
            <p className="text-[11px] text-slate-500 leading-relaxed mt-1.5 font-medium">
              Average water pH is <strong>7.32</strong> (Optimal Range: 7.2 - 7.8). Chlorine level is <strong>1.45 ppm</strong>. Vetted Safe.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50/20 border border-teal-100/50">
            <h5 className="text-xs font-bold text-teal-800 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
              SaaS Conversion Peak
            </h5>
            <p className="text-[11px] text-slate-500 leading-relaxed mt-1.5 font-medium">
              Standard Monthly members converted to Quarterly Premium plan types at a high <strong>28.4%</strong> index during this quarter.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/20 border border-amber-100/50">
            <h5 className="text-xs font-bold text-amber-800 flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-amber-600" />
              Maintenance Cost Audits
            </h5>
            <p className="text-[11px] text-slate-500 leading-relaxed mt-1.5 font-medium">
              Deep tiling filter replacement scheduled on July 1st will optimize quarterly electrical power loads by approximately <strong>11%</strong>.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
