import React, { useState } from 'react';
import { useAppState } from '../AppStateContext';
import { Sparkles, Calendar, Clock, ShieldCheck, Heart, CircleDollarSign, BadgePercent } from 'lucide-react';

export const MembershipView: React.FC = () => {
  const { currentUser, plans, requestRenewal } = useAppState();
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [success, setSuccess] = useState('');

  if (!currentUser) return null;

  const activePlan = plans.find(p => p.id === currentUser.planId) || plans[0];
  
  // Expiry calculations
  const calculateRemainingDays = () => {
    if (!currentUser.membershipExpiry) return 0;
    const expiry = new Date(currentUser.membershipExpiry);
    const today = new Date();
    const diff = expiry.getTime() - today.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const remainingDays = calculateRemainingDays();

  // Renewal state
  const pendingRenewalMatch = currentUser.medicalInformation.match(/\[RENEWAL_PENDING:(.*?)\]/);
  const isRenewalPending = !!pendingRenewalMatch;
  const pendingPlanId = pendingRenewalMatch ? pendingRenewalMatch[1] : null;

  const handleRenew = (e: React.FormEvent) => {
    e.preventDefault();
    requestRenewal(currentUser.id, selectedPlan);
    setSuccess(`Renewal request for ${plans.find(p => p.id === selectedPlan)?.name} submitted successfully!`);
    setTimeout(() => setSuccess(''), 4000);
  };

  return (
    <div className="space-y-6" id="membership-details-view">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Active plan details & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Plan details */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 shrink-0">
                <Sparkles className="w-5 h-5 animate-pulse-subtle" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">My Active Plan</h3>
                <p className="text-xs text-slate-400 font-medium">Valid until {currentUser.membershipExpiry || 'N/A'}</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl p-5 mb-5 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-mono text-blue-100 font-bold uppercase tracking-widest">{activePlan.name}</span>
                <span className="text-xs font-mono font-bold">${activePlan.price} / term</span>
              </div>
              <p className="text-lg font-sans font-bold">Baroda Swimfront Core Member</p>
              <span className="text-[10px] text-blue-100 block mt-0.5">Linked UID: {currentUser.id}</span>
            </div>

            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">Active Plan benefits</h4>
            <ul className="space-y-2">
              {activePlan.features.map((feat, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-600 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Membership Timeline */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-50 pb-3 mb-5 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              Membership Timeline history
            </h3>

            <div className="relative border-l border-slate-100 pl-4 ml-2.5 space-y-6">
              
              <div className="relative">
                <div className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full bg-blue-500 shadow-sm shadow-blue-500/10" />
                <h4 className="text-xs font-bold text-slate-700">Account Activated</h4>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">Timestamp: {currentUser.membershipStart || currentUser.joinDate}</p>
                <p className="text-xs text-slate-500 mt-1 font-medium">Vetted and verified by Admin. Membership initialized with Standard Pass.</p>
              </div>

              <div className="relative">
                <div className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full bg-slate-200" />
                <h4 className="text-xs font-bold text-slate-700">Subscribed: {activePlan.name}</h4>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">Active status confirmed</p>
                <p className="text-xs text-slate-500 mt-1 font-medium">Payment received under secure banking gateways.</p>
              </div>

              <div className="relative">
                <div className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full bg-slate-200" />
                <h4 className="text-xs font-bold text-slate-700">Membership Valid Expiration</h4>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">Expires: {currentUser.membershipExpiry || 'N/A'}</p>
                <p className="text-xs text-slate-500 mt-1 font-medium">Access expires unless renewal checkpoint is processed.</p>
              </div>

            </div>
          </div>

        </div>

        {/* Right column: Renew Pass card */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-50 pb-3 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              Renew Membership pass
            </h3>

            {success && (
              <div className="p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-[11px] font-semibold">
                {success}
              </div>
            )}

            {isRenewalPending ? (
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-blue-800 text-xs">
                <p className="font-bold">Extension Request Active</p>
                <p className="leading-relaxed mt-1">
                  You have requested a renewal upgrade. The administrator will review and extend your term shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRenew} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Select Extension Tier</label>
                  <div className="space-y-2">
                    {plans.map(p => (
                      <label 
                        key={p.id}
                        className={`p-3 rounded-xl border flex justify-between items-center cursor-pointer transition-all hover:border-blue-300
                          ${selectedPlan === p.id 
                            ? 'border-blue-500 bg-blue-50/10' 
                            : 'border-slate-100 bg-slate-50/50'
                          }
                        `}
                      >
                        <input 
                          type="radio" 
                          name="renew_plan" 
                          value={p.id}
                          checked={selectedPlan === p.id}
                          onChange={() => setSelectedPlan(p.id)}
                          className="sr-only"
                        />
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-slate-700 block truncate">{p.name}</span>
                          <span className="text-[9px] text-slate-400 font-mono block">Duration: {p.durationMonths} Months</span>
                        </div>
                        <span className="text-xs font-bold text-slate-800 font-mono shrink-0">${p.price}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md text-center"
                >
                  Submit Renewal Request
                </button>
              </form>
            )}
          </div>

          {/* Swimfront offers card */}
          <div className="bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-3xl p-5 text-white shadow-sm relative overflow-hidden">
            <BadgePercent className="w-8 h-8 text-white/20 absolute -right-2 -top-2 scale-150 rotate-12" />
            <h4 className="font-sans font-bold text-sm tracking-tight">Referral Lane Rewards</h4>
            <p className="text-xs text-blue-100 leading-relaxed mt-1 font-medium">
              Refer a friend to Baroda Swimfront and grab <strong>15 Days extension passes</strong> added to your active validity term for free!
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
