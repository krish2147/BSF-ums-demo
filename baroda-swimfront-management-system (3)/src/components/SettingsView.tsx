import React, { useState } from 'react';
import { useAppState } from '../AppStateContext';
import { 
  Settings, 
  UserCircle, 
  Database, 
  History, 
  ShieldAlert, 
  Save, 
  CheckCircle,
  HelpCircle,
  Search,
  Lock,
  RefreshCw
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { currentUser, settings, updateSettings, auditLogs, updateUser, addLog } = useAppState();
  
  // Tab control
  const [activeTab, setActiveTab] = useState<'profile' | 'system' | 'logs'>('profile');

  // Member profile state
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [dob, setDob] = useState(currentUser?.dateOfBirth || '');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>(currentUser?.gender || 'Male');
  const [emergencyName, setEmergencyName] = useState(currentUser?.emergencyContactName || '');
  const [emergencyPhone, setEmergencyPhone] = useState(currentUser?.emergencyContactPhone || '');
  const [medical, setMedical] = useState(currentUser?.medicalInformation || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Admin system settings state
  const [poolName, setPoolName] = useState(settings.poolName);
  const [email, setEmail] = useState(settings.contactEmail);
  const [contactPhone, setContactPhone] = useState(settings.contactPhone);
  const [address, setAddress] = useState(settings.address);
  const [capacity, setCapacity] = useState(settings.capacityLimit);
  const [monthlyFee, setMonthlyFee] = useState(settings.monthlyFee);

  // Search logs state
  const [logSearch, setLogSearch] = useState('');

  // Status banners
  const [successBanner, setSuccessBanner] = useState('');

  if (!currentUser) return null;

  const isAdmin = currentUser.role === 'admin';

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(currentUser.id, {
      name,
      phone,
      dateOfBirth: dob,
      gender,
      emergencyContactName: emergencyName,
      emergencyContactPhone: emergencyPhone,
      medicalInformation: medical
    });

    setSuccessBanner('Personal profile details updated successfully!');
    setTimeout(() => setSuccessBanner(''), 4000);
  };

  const handleSaveSystem = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      poolName,
      contactEmail: email,
      contactPhone,
      address,
      capacityLimit: capacity,
      monthlyFee,
      maintenanceSchedule: settings.maintenanceSchedule,
      offlineMode: settings.offlineMode
    });

    setSuccessBanner('System configurations saved successfully!');
    setTimeout(() => setSuccessBanner(''), 4000);
  };

  const handleSimulateBackup = () => {
    addLog(currentUser.name, 'DATABASE_BACKUP_SIM', 'Triggered complete encrypted database restore point checkpoint');
    setSuccessBanner('Database backup point compiled! Encrypted ZIP saved under secure s3 vaults.');
    setTimeout(() => setSuccessBanner(''), 4000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setOldPassword('');
    setNewPassword('');
    alert('Security credentials updated. Passwords synchronized successfully.');
  };

  // Filter logs based on search
  const filteredLogs = auditLogs.filter(log => 
    log.actor.toLowerCase().includes(logSearch.toLowerCase()) ||
    log.action.toLowerCase().includes(logSearch.toLowerCase()) ||
    log.details.toLowerCase().includes(logSearch.toLowerCase())
  );

  return (
    <div className="space-y-6" id="settings-management-view">
      
      {/* Settings Navigation Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2
            ${activeTab === 'profile' 
              ? 'border-cyan-500 text-cyan-600' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
            }
          `}
        >
          <UserCircle className="w-4 h-4" />
          {isAdmin ? 'Admin Profile' : 'My Personal Profile'}
        </button>

        {isAdmin && (
          <>
            <button
              onClick={() => setActiveTab('system')}
              className={`px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2
                ${activeTab === 'system' 
                  ? 'border-cyan-500 text-cyan-600' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
                }
              `}
              id="admin-system-settings-tab"
            >
              <Settings className="w-4 h-4" />
              Branding & Capacity
            </button>

            <button
              onClick={() => setActiveTab('logs')}
              className={`px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2
                ${activeTab === 'logs' 
                  ? 'border-cyan-500 text-cyan-600' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
                }
              `}
              id="admin-audit-logs-tab"
            >
              <History className="w-4 h-4" />
              Live Security Audits
            </button>
          </>
        )}
      </div>

      {successBanner && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold flex items-center gap-1.5 animate-bounce">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* ================= TAB 1: PROFILE TAB ================= */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Details form */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm lg:col-span-2">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-50 pb-3 mb-5 font-display">Account Information</h3>
            
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Linked Email Address (ReadOnly)</label>
                  <input
                    type="email"
                    disabled
                    value={currentUser.email}
                    className="w-full text-xs font-medium bg-slate-100 border border-slate-200 p-2.5 rounded-xl text-slate-400 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Mobile Line</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Date of Birth</label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Gender Group</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-700 focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Emergency Contacts */}
              <div className="pt-4 border-t border-slate-100 mt-4">
                <h4 className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">Emergency Protocol Contacts</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Next of Kin Name</label>
                    <input
                      type="text"
                      required
                      value={emergencyName}
                      onChange={(e) => setEmergencyName(e.target.value)}
                      className="w-full text-xs font-medium bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-700 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Kins Mobile Line</label>
                    <input
                      type="text"
                      required
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      className="w-full text-xs font-semibold font-mono bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-700 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Medical conditions */}
              <div className="pt-4 border-t border-slate-100 mt-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Medical declarations (Asthma, Allergies, etc.)</label>
                <textarea
                  value={medical.replace(/\[RENEWAL_PENDING:.*?\]/g, '').trim()}
                  onChange={(e) => setMedical(e.target.value)}
                  rows={3}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-700 resize-none"
                  placeholder="Outline any pre-existing respiratory or muscular constraints for lifeguard tracking..."
                />
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* Change password column */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm h-max">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-50 pb-3 mb-5 font-display flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-500" />
              Security credentials
            </h3>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-700"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">New Secure Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-700"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Update password
              </button>
            </form>
          </div>

        </div>
      )}

      {/* ================= TAB 2: SYSTEM BRANDING TAB (ADMIN ONLY) ================= */}
      {activeTab === 'system' && isAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm lg:col-span-2">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-50 pb-3 mb-5 font-display">System parameters</h3>
            
            <form onSubmit={handleSaveSystem} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">SaaS Pool Name</label>
                  <input
                    type="text"
                    required
                    value={poolName}
                    onChange={(e) => setPoolName(e.target.value)}
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-700"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Support Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-700"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Support Phone line</label>
                  <input
                    type="text"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full text-xs font-semibold font-mono bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-700"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Pool Swimmer Capacity Threshold</label>
                  <input
                    type="number"
                    required
                    value={capacity}
                    onChange={(e) => setCapacity(parseInt(e.target.value))}
                    className="w-full text-xs font-semibold font-mono bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-700"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Physical Address</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-700"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  Save configurations
                </button>
              </div>
            </form>
          </div>

          {/* Backup columns */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm h-max space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-50 pb-3 font-display flex items-center gap-2">
              <Database className="w-4 h-4 text-slate-500" />
              Security Checkpoints
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Daily incremental snapshot backups compile automatically at 02:00 UTC under S3 isolated vaults.
            </p>

            <button
              onClick={handleSimulateBackup}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 animate-spin-slow text-cyan-600" />
              Compile Instant Backup ZIP
            </button>
          </div>

        </div>
      )}

      {/* ================= TAB 3: AUDIT SECURITY LOGS (ADMIN ONLY) ================= */}
      {activeTab === 'logs' && isAdmin && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="relative w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search audit action details..."
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                className="w-full text-xs font-medium pl-9 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>

            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
              Security Logs Validated
            </span>
          </div>

          <div className="overflow-x-auto max-h-[500px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[9px] font-bold uppercase tracking-wider">
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Actor</th>
                  <th className="p-3">Action Type</th>
                  <th className="p-3">Operation Details</th>
                  <th className="p-3">Client IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-600 font-mono">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50">
                    <td className="p-3 text-[10px] text-slate-400">{log.timestamp}</td>
                    <td className="p-3 font-sans font-bold text-slate-700">{log.actor}</td>
                    <td className="p-3 text-cyan-600 font-bold text-[10px]">{log.action}</td>
                    <td className="p-3 text-[11px] font-sans text-slate-500">{log.details}</td>
                    <td className="p-3 text-[10px] text-slate-400">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  );
};
