import React, { useState } from 'react';
import { useAppState } from '../AppStateContext';
import { User } from '../types';
import { 
  ShieldCheck, 
  UserX, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  FileCheck2,
  CalendarCheck2,
  Lock,
  Contact
} from 'lucide-react';

export const RegistrationsView: React.FC = () => {
  const { users, approveRegistration, rejectRegistration } = useAppState();
  const [inspectUser, setInspectUser] = useState<User | null>(null);

  // Find all users who are pending
  const pendingUsers = users.filter(u => u.role === 'member' && u.status === 'pending');

  return (
    <div className="space-y-6" id="registrations-requests-view">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: List of pending registration requests */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm">
            <div className="flex justify-between items-center border-b border-slate-50 pb-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Pending Admission Queue</h3>
                <p className="text-xs text-slate-400 font-medium">Verify guest credentials before pool lane access clearance</p>
              </div>
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-amber-50 text-amber-700 border border-amber-100 rounded-full">
                {pendingUsers.length} Requests Left
              </span>
            </div>

            {pendingUsers.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-xs">
                Excellent! All registration requests have been reviewed and resolved.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingUsers.map((user) => (
                  <div 
                    key={user.id} 
                    className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row items-center justify-between gap-4
                      ${inspectUser?.id === user.id 
                        ? 'border-blue-500 bg-blue-50/10 shadow-sm' 
                        : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'
                      }
                    `}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-800">{user.name}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">({user.id})</span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{user.email} • {user.phone}</p>
                      
                      <div className="flex items-center gap-4 mt-2.5 text-[10px] text-slate-400 font-mono">
                        <span>Gender: <strong className="text-slate-600 font-sans">{user.gender}</strong></span>
                        <span>DOB: <strong className="text-slate-600">{user.dateOfBirth}</strong></span>
                        <span>Registered: <strong className="text-slate-600">{user.joinDate}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-end">
                      <button
                        onClick={() => setInspectUser(user)}
                        className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs rounded-xl transition-all cursor-pointer"
                      >
                        Inspect Dossier
                      </button>
                      <button
                        onClick={() => approveRegistration(user.id)}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm shadow-blue-500/10"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => rejectRegistration(user.id)}
                        className="p-1.5 border border-slate-200 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-all cursor-pointer"
                        title="Reject Request"
                      >
                        <UserX className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column: Identity Vetting & Vetting Dossier Panel */}
        <div>
          {inspectUser ? (
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-5 sticky top-20 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                <h3 className="text-sm font-bold text-slate-800">Identity Clearance Vetting</h3>
                <button 
                  onClick={() => setInspectUser(null)} 
                  className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  Close
                </button>
              </div>

              {/* Simulated ID Doc Card with Premium Glassmorphism styling */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 border border-blue-100 text-white relative overflow-hidden shadow-sm select-none">
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                <div className="flex items-start justify-between mb-4 border-b border-white/10 pb-2.5">
                  <div>
                    <span className="text-[8px] font-mono tracking-widest text-blue-100 uppercase font-bold">STATE DRIVING LICENSE</span>
                    <h5 className="text-[10px] font-sans font-bold">REPUBLIC OF INDIA</h5>
                  </div>
                  <Lock className="w-3.5 h-3.5 text-white/75" />
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-14 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center font-sans font-extrabold text-lg text-white">
                    {inspectUser.name.charAt(0)}
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="text-xs font-bold truncate">{inspectUser.name}</p>
                    <p className="text-[9px] text-blue-50 mt-0.5">DOB: {inspectUser.dateOfBirth}</p>
                    <p className="text-[9px] text-blue-50">GENDER: {inspectUser.gender}</p>
                    <p className="text-[9px] font-mono text-white font-bold mt-1.5">LICENSE ID: DL-9022X-MOCK</p>
                  </div>
                </div>

                <div className="mt-4 pt-2.5 border-t border-white/10 flex justify-between items-center text-[8px] font-mono text-slate-400">
                  <span>VALIDITY: 2038-12-31</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                    <FileCheck2 className="w-2.5 h-2.5" />
                    CHIP VALIDATED
                  </span>
                </div>
              </div>

              {/* Medical and Emergency Dossier info */}
              <div className="space-y-3.5">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Medical Clearance Flags</span>
                  <p className="font-semibold text-slate-700 mt-1.5 leading-relaxed">
                    {inspectUser.medicalInformation || 'No declarations. Member cleared.'}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Emergency Call Protocol</span>
                  <p className="font-bold text-slate-700 mt-1.5">Contact: <span className="font-semibold">{inspectUser.emergencyContactName || 'N/A'}</span></p>
                  <p className="font-bold text-slate-700 mt-0.5">Phone line: <span className="font-semibold font-mono">{inspectUser.emergencyContactPhone || 'N/A'}</span></p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    approveRegistration(inspectUser.id);
                    setInspectUser(null);
                  }}
                  className="py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm shadow-blue-500/10 text-center"
                >
                  Approve Entry
                </button>
                <button
                  onClick={() => {
                    rejectRegistration(inspectUser.id);
                    setInspectUser(null);
                  }}
                  className="py-2 border border-slate-200 hover:bg-red-50 text-red-500 font-bold text-xs rounded-xl transition-all cursor-pointer text-center"
                >
                  Reject & Deny
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-slate-50 rounded-3xl p-6 border border-dashed border-slate-200 text-center text-slate-400 text-xs py-16">
              <Contact className="w-10 h-10 mx-auto mb-3 text-slate-300" />
              <p className="font-bold">Dossier Clearance Desk</p>
              <p className="text-[11px] leading-relaxed max-w-xs mx-auto mt-1">Select a pending registration request on the left to inspect submitted credentials and identity proofs.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
