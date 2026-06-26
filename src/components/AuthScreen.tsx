import React, { useState } from 'react';
import { useAppState } from '../AppStateContext';
import { 
  Droplets, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Calendar, 
  ShieldAlert, 
  Activity, 
  ArrowRight, 
  ArrowLeft,
  ChevronRight,
  Sparkles,
  Award
} from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { login, register, users } = useAppState();

  // Mode: 'login' | 'register' | 'forgot' | 'reset' | 'role_select'
  const [mode, setMode] = useState<'role_select' | 'login' | 'register' | 'forgot' | 'reset'>('role_select');
  const [selectedRole, setSelectedRole] = useState<'admin' | 'member'>('member');

  // Input fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regGender, setRegGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [regDob, setRegDob] = useState('');
  const [regEmergencyName, setRegEmergencyName] = useState('');
  const [regEmergencyPhone, setRegEmergencyPhone] = useState('');
  const [regMedical, setRegMedical] = useState('');

  // Notifications / Alert messages
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleRoleSelect = (role: 'admin' | 'member') => {
    setSelectedRole(role);
    setErrorMessage('');
    setSuccessMessage('');
    setMode('login');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const res = login(email, selectedRole);
    if (!res.success) {
      setErrorMessage(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regEmail.includes('@')) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }

    const res = register({
      name: regName,
      email: regEmail,
      phone: regPhone,
      gender: regGender,
      dateOfBirth: regDob,
      emergencyContactName: regEmergencyName,
      emergencyContactPhone: regEmergencyPhone,
      medicalInformation: regMedical || 'None'
    });

    if (!res.success) {
      setErrorMessage(res.error || 'Registration failed.');
    } else {
      setSuccessMessage('Registration submitted successfully! Your account is pending administrator review. Click below to return to login.');
      
      // Clear fields
      setRegName('');
      setRegEmail('');
      setRegPhone('');
      setRegDob('');
      setRegEmergencyName('');
      setRegEmergencyPhone('');
      setRegMedical('');
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('A password reset link has been dispatched to your verified email address.');
    setErrorMessage('');
    setTimeout(() => {
      setMode('reset');
    }, 1500);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('Credentials synced. New password established successfully. Please sign in.');
    setErrorMessage('');
    setTimeout(() => {
      setMode('login');
    }, 1500);
  };

  // Demo Login Quick shortcuts
  const handleDemoLogin = (role: 'admin' | 'member') => {
    setErrorMessage('');
    setSuccessMessage('');
    const demoEmail = role === 'admin' ? 'admin@swimfront.com' : 'aarav.patel@gmail.com';
    const res = login(demoEmail, role);
    if (!res.success) {
      setErrorMessage(res.error || 'Demo login failed.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 select-none relative overflow-hidden" id="auth-screen-container">
      {/* Decorative ambient background glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl" />

      {/* Main Crisp white container */}
      <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl relative z-10 text-slate-700">
        
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-md mb-3">
            <Droplets className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-sans font-bold text-lg text-slate-800 leading-tight uppercase tracking-wider">Baroda Swimfront</h1>
          <p className="text-[10px] text-blue-600 font-mono tracking-widest uppercase font-semibold mt-1">Management System • BSMS</p>
        </div>

        {/* Error / Success feedback blocks */}
        {errorMessage && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-2.5">
            <ShieldAlert className="w-4.5 h-4.5 shrink-0 mt-0.5 text-red-500" />
            <p className="leading-relaxed">{errorMessage}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-start gap-2.5">
            <Sparkles className="w-4.5 h-4.5 shrink-0 mt-0.5 text-emerald-600" />
            <p className="leading-relaxed">{successMessage}</p>
          </div>
        )}

        {/* ================= MODE: ROLE SELECTION ================= */}
        {mode === 'role_select' && (
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center pb-2 border-b border-slate-100 mb-4">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Gateway Role Authorization</h2>
              <p className="text-xs text-slate-400 mt-1">Access the appropriate control dashboard</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div 
                onClick={() => handleRoleSelect('member')}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-blue-50/20 hover:border-blue-400 transition-all cursor-pointer text-left group"
                id="role-member-card"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 border border-blue-200 group-hover:bg-blue-600 group-hover:text-white transition-all mb-4">
                  <User className="w-4.5 h-4.5" />
                </div>
                <h3 className="font-sans font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">Swimfront Swimmer</h3>
                <p className="text-[11px] text-slate-500 leading-normal mt-1">Verify membership schedules, register relay competitions, and scan gate access logs.</p>
              </div>

              <div 
                onClick={() => handleRoleSelect('admin')}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-blue-50/20 hover:border-blue-400 transition-all cursor-pointer text-left group"
                id="role-admin-card"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 border border-blue-200 group-hover:bg-blue-600 group-hover:text-white transition-all mb-4">
                  <Award className="w-4.5 h-4.5" />
                </div>
                <h3 className="font-sans font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">Pool Administrator</h3>
                <p className="text-[11px] text-slate-500 leading-normal mt-1">Approve registrations, extend membership terms, schedule holidays, and view financial audits.</p>
              </div>
            </div>

            {/* Quick Demo logins shortcuts */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button 
                onClick={() => handleDemoLogin('member')}
                className="text-xs font-bold px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all cursor-pointer shadow-sm w-full sm:w-auto"
                id="quick-member-demo"
              >
                Member Demo Login
              </button>
              <button 
                onClick={() => handleDemoLogin('admin')}
                className="text-xs font-bold px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all cursor-pointer border border-slate-200 w-full sm:w-auto"
                id="quick-admin-demo"
              >
                Admin Demo Login
              </button>
            </div>
          </div>
        )}

        {/* ================= MODE: LOGIN ================= */}
        {mode === 'login' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 cursor-pointer mb-2 w-max" onClick={() => setMode('role_select')}>
              <ArrowLeft className="w-4 h-4" />
              <span>Back to roles</span>
            </div>

            <div className="border-b border-slate-100 pb-2">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider capitalize">Authorize as {selectedRole}</h2>
              <p className="text-xs text-slate-400 mt-1">Provide your registered swimming credentials</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. aarav.patel@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs font-semibold pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 placeholder-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Password</label>
                  <button type="button" onClick={() => setMode('forgot')} className="text-[10px] text-blue-600 hover:text-blue-700 font-semibold cursor-pointer">
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-xs font-semibold pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 placeholder-slate-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Authenticate Pass
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {selectedRole === 'member' && (
              <p className="text-center text-xs text-slate-500 mt-4">
                New swimmer?{' '}
                <button onClick={() => setMode('register')} className="text-blue-600 hover:text-blue-700 font-bold cursor-pointer">
                  Submit Admission Form
                </button>
              </p>
            )}
          </div>
        )}

        {/* ================= MODE: REGISTER ================= */}
        {mode === 'register' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 cursor-pointer mb-2 w-max" onClick={() => setMode('login')}>
              <ArrowLeft className="w-4 h-4" />
              <span>Back to login</span>
            </div>

            <div className="border-b border-slate-100 pb-2">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Admission Form Request</h2>
              <p className="text-xs text-slate-400 mt-1">Pending review, accounts activate upon admin vetting</p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              
              <div className="space-y-3">
                <h3 className="text-[10px] font-bold text-blue-600 uppercase tracking-widest border-b border-slate-100 pb-1">Primary details</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Meera Trivedi"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500/30 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. meera@gmail.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500/30 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Mobile Line</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. +91 95432 10987"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500/30 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Date of Birth</label>
                    <input
                      type="date"
                      required
                      value={regDob}
                      onChange={(e) => setRegDob(e.target.value)}
                      className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500/30 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Gender Group</label>
                    <select
                      value={regGender}
                      onChange={(e) => setRegGender(e.target.value as any)}
                      className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-800"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="text-[10px] font-bold text-blue-600 uppercase tracking-widest border-b border-slate-100 pb-1">Safety & Emergencies</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Emergency Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sanjay Trivedi"
                      value={regEmergencyName}
                      onChange={(e) => setRegEmergencyName(e.target.value)}
                      className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Emergency Phone</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. +91 95432 00000"
                      value={regEmergencyPhone}
                      onChange={(e) => setRegEmergencyPhone(e.target.value)}
                      className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-800"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Medical declarations (Asthma, musculoskeletal constraints)</label>
                <textarea
                  value={regMedical}
                  onChange={(e) => setRegMedical(e.target.value)}
                  rows={2}
                  placeholder="e.g. Mild asthmatic, penicillin allergy, or write None"
                  className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none resize-none text-slate-800"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm mt-4 cursor-pointer"
              >
                Submit Admission Dossier
              </button>
            </form>
          </div>
        )}

        {/* ================= MODE: FORGOT PASSWORD ================= */}
        {mode === 'forgot' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 cursor-pointer mb-2" onClick={() => setMode('login')}>
              <ArrowLeft className="w-4 h-4" />
              <span>Back to login</span>
            </div>

            <div className="border-b border-slate-100 pb-2">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Reset Security Key</h2>
              <p className="text-xs text-slate-400 mt-1">Retrieve swimming lane access passcode</p>
            </div>

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Registered Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. aarav.patel@gmail.com"
                    className="w-full text-xs font-semibold pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition-all cursor-pointer"
              >
                Dispatch Reset Request
              </button>
            </form>
          </div>
        )}

        {/* ================= MODE: RESET PASSWORD ================= */}
        {mode === 'reset' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 pb-2">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Establish New Passcode</h2>
              <p className="text-xs text-slate-400 mt-1">Configure security credentials</p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Reset Validation Token</label>
                <input
                  type="text"
                  required
                  placeholder="Sent to your email"
                  className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">New Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition-all cursor-pointer"
              >
                Establish Password
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
