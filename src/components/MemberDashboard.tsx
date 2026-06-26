import React, { useState } from 'react';
import { useAppState } from '../AppStateContext';
import { 
  Calendar, 
  Clock, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  AlertCircle,
  CreditCard,
  BellRing,
  Award,
  CircleArrowOutUpRight
} from 'lucide-react';

export const MemberDashboard: React.FC = () => {
  const { currentUser, attendance, events, holidays, plans, requestRenewal } = useAppState();
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('monthly');

  if (!currentUser) return null;

  // Filter attendance records for current user
  const userAttendance = attendance.filter(a => a.userId === currentUser.id);
  
  // Calculate remaining days for membership
  const calculateRemainingDays = () => {
    if (!currentUser.membershipExpiry) return 0;
    const expiry = new Date(currentUser.membershipExpiry);
    const today = new Date();
    const diff = expiry.getTime() - today.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const remainingDays = calculateRemainingDays();

  // Find user current plan
  const activePlan = plans.find(p => p.id === currentUser.planId) || plans[0];

  // Calculate membership active percentage for progress bar (Assume standard plan is 30 days if monthly, 90 days quarterly, 180 semi-annual, 365 annual)
  const totalDays = activePlan.durationMonths * 30;
  const progressPercent = Math.min(100, Math.max(0, Math.round((remainingDays / totalDays) * 100)));

  // Check if renewal is pending (we check the medicalInformation tag [RENEWAL_PENDING:planId] we simulated)
  const pendingRenewalMatch = currentUser.medicalInformation.match(/\[RENEWAL_PENDING:(.*?)\]/);
  const isRenewalPending = !!pendingRenewalMatch;
  const pendingPlanId = pendingRenewalMatch ? pendingRenewalMatch[1] : null;
  const pendingPlan = plans.find(p => p.id === pendingPlanId);

  const handleRenewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requestRenewal(currentUser.id, selectedPlan);
    setShowRenewModal(false);
  };

  return (
    <div className="space-y-6" id="member-dashboard-view">
      
      {/* Welcome Hero Banner */}
      <div className="rounded-3xl p-6 bg-gradient-to-r from-blue-600 to-cyan-500 border border-blue-100 text-white relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 text-[10px] font-mono bg-blue-100 text-blue-800 font-bold rounded-full uppercase tracking-wider">
                Active Member
              </span>
              <span className="text-blue-100 text-xs font-mono">ID: {currentUser.id}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-sans font-bold tracking-tight">
              Welcome back, {currentUser.name}!
            </h1>
            <p className="text-blue-50 mt-1 max-w-xl font-medium leading-relaxed">
              Your lanes are prepped and the water quality index is high at 98.7% today. Grab your goggles!
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Membership details Card & Plan list */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Membership Plan Info Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">My Pool Membership</h3>
                  <p className="text-xs text-slate-400 font-medium">Linked Plan: {activePlan.name}</p>
                </div>
              </div>

              <div className="text-right">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono
                  ${remainingDays > 7 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                    : remainingDays > 0 
                      ? 'bg-amber-50 text-amber-700 border border-amber-100' 
                      : 'bg-red-50 text-red-700 border border-red-100'
                  }
                `}>
                  <span className={`w-1.5 h-1.5 rounded-full ${remainingDays > 7 ? 'bg-emerald-500' : remainingDays > 0 ? 'bg-amber-500' : 'bg-red-500'}`} />
                  {remainingDays > 7 ? 'ACTIVE' : remainingDays > 0 ? 'EXPIRING SOON' : 'EXPIRED'}
                </span>
              </div>
            </div>

            {/* Expire and Timeline bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Start Date</p>
                <p className="text-sm font-bold text-slate-700 mt-1 font-mono">{currentUser.membershipStart || 'N/A'}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Expiration Date</p>
                <p className="text-sm font-bold text-slate-700 mt-1 font-mono">{currentUser.membershipExpiry || 'N/A'}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Remaining Days</p>
                <p className="text-lg font-bold text-slate-800 mt-0.5 font-mono">{remainingDays} Days</p>
              </div>
            </div>

            {/* Custom progress visualizer */}
            <div className="mb-6">
              <div className="flex justify-between items-center text-xs font-medium text-slate-500 mb-2">
                <span>Membership Utilization Tracker</span>
                <span className="font-mono">{progressPercent}% validity remaining</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r
                    ${remainingDays > 7 ? 'from-blue-600 to-cyan-400' : 'from-amber-400 to-amber-500'}
                  `}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Renewal Status or Action Box */}
            <div className="p-4 rounded-2xl border border-dashed flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50 border-slate-200">
              {isRenewalPending ? (
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                    <Clock className="w-4 h-4 animate-spin" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700">Renewal Requested & Pending Review</p>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                      Requested upgrade to <span className="font-semibold text-slate-600">{pendingPlan?.name}</span>. Admin approval pending.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700">Safe Lane Access Valid</p>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">Extend your pass at any time to guarantee premium lane slot reservations.</p>
                  </div>
                </div>
              )}

              {!isRenewalPending && (
                <button
                  onClick={() => setShowRenewModal(true)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
                  id="renew-membership-dashboard-btn"
                >
                  Renew Membership Now
                </button>
              )}
            </div>
          </div>

          {/* Attendance Module: Weekly analytics summary */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                Attendance analytics & Recent Visits
              </h3>
              <span className="text-[11px] text-slate-400 font-mono font-bold">Total Sessions: {currentUser.attendanceCount}</span>
            </div>

            {/* Attendance list */}
            {userAttendance.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No recent pool check-ins detected. Please check in with the administrator at the reception desk!
              </div>
            ) : (
              <div className="space-y-2.5">
                {userAttendance.slice(-4).reverse().map((rec) => (
                  <div key={rec.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-700">{new Date(rec.date).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                        <p className="text-[10px] text-slate-400 font-medium">Baroda Swimfront Main Complex</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <p className="text-xs font-semibold text-slate-700 font-mono">
                          {rec.checkInTime} {rec.checkOutTime ? ` - ${rec.checkOutTime}` : ' (Active)'}
                        </p>
                        <p className="text-[9px] text-slate-400">Checked-in via Entry Gate 1</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-mono
                        ${rec.checkOutTime ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}
                      `}>
                        {rec.checkOutTime ? 'COMPLETED' : 'ACTIVE'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Events & Holidays summary */}
        <div className="space-y-6">
          
          {/* Upcoming Event Alert Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4 border-b border-slate-50 pb-3">
              <Award className="w-4 h-4 text-blue-500" />
              Upcoming Special Pool Events
            </h3>

            <div className="space-y-4">
              {events.slice(0, 2).map((evt) => (
                <div key={evt.id} className="p-4 rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100 border border-slate-200/50">
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-2 py-0.5 text-[9px] bg-blue-100 text-blue-800 font-bold rounded-full capitalize">
                      {evt.type.replace('_', ' ')}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono font-semibold">Deadline: {evt.registrationDeadline}</span>
                  </div>
                  
                  <h4 className="text-xs font-bold text-slate-800 leading-snug">{evt.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-normal">{evt.description}</p>
                  
                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-200/50">
                    <span className="text-[10px] text-slate-400 font-mono">Date: <span className="font-semibold text-slate-600">{evt.date}</span></span>
                    <button className="text-[10px] font-bold text-blue-600 flex items-center gap-1 hover:text-blue-700">
                      View details
                      <CircleArrowOutUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Holiday and Notice Board Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4 border-b border-slate-50 pb-3">
              <BellRing className="w-4 h-4 text-amber-500" />
              Pool Holidays & Maintenance Notices
            </h3>

            <div className="space-y-3">
              {holidays.map((hol) => (
                <div key={hol.id} className="p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="text-[10px] font-mono text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full capitalize">
                      {hol.type}
                    </span>
                    <span className="text-[9px] font-mono font-medium text-slate-400">{hol.startDate}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-700 mt-1.5 leading-snug">{hol.title}</h4>
                  <p className="text-[10px] text-slate-400 leading-normal mt-0.5 line-clamp-2">{hol.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Payment History Card (Mocked) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4 border-b border-slate-50 pb-3">
              <CreditCard className="w-4 h-4 text-slate-500" />
              Recent Payment Transactions
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/50">
                <div>
                  <p className="text-xs font-bold text-slate-700">Standard Plan Activated</p>
                  <p className="text-[9px] text-slate-400 font-mono">Invoice: #INV-2026-0922</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-800 font-mono">$60.00</p>
                  <span className="text-[8px] font-mono font-bold text-emerald-500 bg-emerald-50 px-1 py-0.2 rounded-md">PAID</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/50">
                <div>
                  <p className="text-xs font-bold text-slate-700">Quarterly Premium Pass</p>
                  <p className="text-[9px] text-slate-400 font-mono">Invoice: #INV-2026-0150</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-800 font-mono">$150.00</p>
                  <span className="text-[8px] font-mono font-bold text-emerald-500 bg-emerald-50 px-1 py-0.2 rounded-md">PAID</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* RENEW MEMBERSHIP MODAL */}
      {showRenewModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-lg font-sans font-bold text-slate-800 mb-2">Request Membership Plan Extension</h3>
            <p className="text-xs text-slate-400 font-medium mb-4">
              Select one of our premium, high-tier membership plans. Your request will be queued for Admin approval.
            </p>

            <form onSubmit={handleRenewSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {plans.map((p) => (
                  <label 
                    key={p.id}
                    className={`p-4 rounded-2xl border-2 cursor-pointer flex flex-col justify-between transition-all hover:border-blue-400
                      ${selectedPlan === p.id 
                        ? 'border-blue-500 bg-blue-50/10 shadow-sm' 
                        : 'border-slate-100 bg-slate-50/50'
                      }
                    `}
                  >
                    <input 
                      type="radio" 
                      name="plan" 
                      value={p.id} 
                      checked={selectedPlan === p.id}
                      onChange={() => setSelectedPlan(p.id)}
                      className="sr-only"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-700 block">{p.name}</span>
                      <span className="text-[10px] text-slate-400 leading-tight mt-1 line-clamp-2">{p.features[0]}</span>
                    </div>
                    <span className="text-sm font-extrabold text-slate-800 mt-3 block font-mono">
                      ${p.price} <span className="text-[10px] font-medium text-slate-400">/ {p.durationMonths}mo</span>
                    </span>
                  </label>
                ))}
              </div>

              <div className="flex gap-3 justify-end pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRenewModal(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
