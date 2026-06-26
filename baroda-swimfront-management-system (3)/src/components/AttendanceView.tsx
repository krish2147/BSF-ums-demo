import React, { useState } from 'react';
import { useAppState } from '../AppStateContext';
import { AttendanceRecord, User } from '../types';
import { 
  Calendar, 
  Clock, 
  UserCheck, 
  UserMinus, 
  Search, 
  Activity, 
  TrendingUp,
  Download,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const AttendanceView: React.FC = () => {
  const { currentUser, users, attendance, checkInUser, checkOutUser } = useAppState();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Terminal emulator state
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [checkInTime, setCheckInTime] = useState('07:00');
  const [terminalError, setTerminalError] = useState('');
  const [terminalSuccess, setTerminalSuccess] = useState('');

  if (!currentUser) return null;

  const isAdmin = currentUser.role === 'admin';
  const todayStr = new Date().toISOString().split('T')[0];

  // List of approved members who can check in (admins only see these)
  const approvedMembers = users.filter(u => u.role === 'member' && u.status === 'approved');

  // Currently checked-in active sessions (checked in today and checkOutTime is empty)
  const activePoolSessions = attendance.filter(a => a.date === todayStr && !a.checkOutTime);

  // Historic attendance logs filtered
  const filteredAttendance = attendance.filter(record => {
    if (isAdmin) {
      // Admin sees everyone, matches search
      return record.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
             record.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
             record.date.includes(searchTerm);
    } else {
      // Member sees only themselves
      return record.userId === currentUser.id && record.date.includes(searchTerm);
    }
  });

  // Handle Terminal Check-In form
  const handleTerminalCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    setTerminalError('');
    setTerminalSuccess('');

    if (!selectedMemberId) {
      setTerminalError('Please select a member to check in.');
      return;
    }

    const res = checkInUser(selectedMemberId, checkInTime);
    if (!res.success) {
      setTerminalError(res.error || 'Check-in failed.');
    } else {
      const user = users.find(u => u.id === selectedMemberId);
      setTerminalSuccess(`Successfully checked in ${user?.name || 'Swimmer'}!`);
      setSelectedMemberId('');
    }
  };

  // Export logs to simulated CSV
  const handleExportCSV = () => {
    const headers = ['Record ID', 'Member ID', 'Member Name', 'Date', 'Check-In', 'Check-Out', 'Status'];
    const rows = filteredAttendance.map(r => [
      r.id,
      r.userId,
      r.userName,
      r.date,
      r.checkInTime,
      r.checkOutTime || 'Active',
      r.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `swimfront_attendance_${isAdmin ? 'admin' : currentUser.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6" id="attendance-module-view">
      
      {isAdmin ? (
        /* ================= ADMIN WORKSPACE ================= */
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Interactive Gate Terminal Check-In */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 border-b border-slate-50 pb-3 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                    <UserCheck className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 font-sans">Gate Terminal Check-In</h3>
                    <p className="text-[11px] text-slate-400 font-medium">Replicate physical desk reception member check-ins</p>
                  </div>
                </div>

                <form onSubmit={handleTerminalCheckIn} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Select Swimmer</label>
                    <select
                      value={selectedMemberId}
                      onChange={(e) => setSelectedMemberId(e.target.value)}
                      className="w-full text-xs font-medium bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-700 focus:outline-none"
                    >
                      <option value="">-- Choose active member --</option>
                      {approvedMembers.map(m => (
                        <option key={m.id} value={m.id}>{m.name} ({m.id})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Check-In Timestamp</label>
                    <input
                      type="time"
                      required
                      value={checkInTime}
                      onChange={(e) => setCheckInTime(e.target.value)}
                      className="w-full text-xs font-semibold font-mono bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-700"
                    />
                  </div>

                  {terminalError && (
                    <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs font-medium flex items-center gap-1.5 border border-red-100/50">
                      <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                      <span>{terminalError}</span>
                    </div>
                  )}

                  {terminalSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-medium flex items-center gap-1.5 border border-emerald-100/50 animate-bounce">
                      <CheckCircle2 className="w-4.5 h-4.5 shrink-0" />
                      <span>{terminalSuccess}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <UserCheck className="w-4 h-4" />
                    Trigger Desk Entry
                  </button>
                </form>
              </div>

              <p className="text-[10px] text-slate-400 text-center font-medium mt-4 pt-4 border-t border-slate-50">
                Check-in records update active lane statistics and swimming history reports in real time.
              </p>
            </div>

            {/* Swimmers in Pool Right Now (Live Board) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm lg:col-span-2">
              <div className="flex justify-between items-center border-b border-slate-50 pb-3 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Swimmers in Pool Now</h3>
                  <p className="text-xs text-slate-400 font-medium">Currently active pool lanes occupancy tracker</p>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded-full">
                  {activePoolSessions.length} Swimmers active
                </span>
              </div>

              {activePoolSessions.length === 0 ? (
                <div className="py-16 text-center text-slate-400 text-xs">
                  No active swimming sessions registered. Swimmers will show up here once checked in.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
                  {activePoolSessions.map((rec) => {
                    const swimmer = users.find(u => u.id === rec.userId);
                    return (
                      <div key={rec.id} className="p-3.5 rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100/80 border border-slate-200/50 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-bold text-slate-700 truncate">{rec.userName}</p>
                            <span className="text-[9px] text-slate-400 font-mono">({rec.userId})</span>
                          </div>
                          <p className="text-[10px] text-slate-500 font-medium mt-0.5">Checked-in: <strong className="text-slate-600 font-mono">{rec.checkInTime} AM</strong></p>
                          <span className="text-[8px] font-mono font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md mt-1 block w-max uppercase">Lane active</span>
                        </div>

                        <button
                          onClick={() => {
                            const now = new Date();
                            const checkoutTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                            checkOutUser(rec.id, checkoutTime);
                          }}
                          className="px-2.5 py-1.5 bg-white hover:bg-red-50 text-slate-700 hover:text-red-500 font-semibold text-[10px] border border-slate-200 rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-sm shrink-0"
                        >
                          <UserMinus className="w-3.5 h-3.5" />
                          Check-Out
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

        </div>
      ) : (
        /* ================= MEMBER PORTAL ================= */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Member Attendance Statistics */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm text-center">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 mb-4">
                <Activity className="w-6 h-6 animate-pulse-subtle" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">My Attendance Quotient</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Keep high consistency to hit swim goals</p>
              
              <div className="my-6">
                <span className="text-4xl font-sans font-black text-slate-800 font-mono">
                  {Math.min(100, Math.round((currentUser.attendanceCount / 30) * 100))}%
                </span>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1">Recommended quotient: 80%+</p>
              </div>

              <div className="space-y-2 text-xs border-t border-slate-100 pt-4">
                <div className="flex justify-between items-center text-slate-500 font-medium">
                  <span>Sessions logged (Month)</span>
                  <span className="font-bold text-slate-700 font-mono">{currentUser.attendanceCount} sessions</span>
                </div>
                <div className="flex justify-between items-center text-slate-500 font-medium">
                  <span>Active check-ins today</span>
                  <span className="font-semibold text-slate-700">
                    {attendance.find(a => a.userId === currentUser.id && a.date === todayStr && !a.checkOutTime) ? 'Yes (Pool)' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            {/* Attendance Quote Tips */}
            <div className="bg-gradient-to-tr from-blue-600 to-cyan-500 text-white rounded-3xl p-5 shadow-sm">
              <TrendingUp className="w-6 h-6 text-white mb-3" />
              <h4 className="font-sans font-bold text-sm tracking-tight">Coaches consistency recommendation</h4>
              <p className="text-xs text-blue-100 leading-relaxed mt-1 font-medium">
                Standard swimmer lung-capacity retention drops by 14% with absences exceeding 4 consecutive days. Maintain at least 3 sessions per week!
              </p>
            </div>
          </div>

          {/* Member Monthly attendance Grid Calendar */}
          <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4 border-b border-slate-50 pb-3">
              <Calendar className="w-4 h-4 text-blue-500" />
              My Attendance Calendar Grid
            </h3>

            {/* Simulated 30-day Calendar layout with highlighted checked-in days */}
            <div className="grid grid-cols-7 gap-1.5 text-center">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                <span key={i} className="text-[10px] font-mono font-bold text-slate-400 py-1.5">{day}</span>
              ))}

              {[...Array(30)].map((_, i) => {
                const dayNum = i + 1;
                const formattedDay = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
                const dateStr = `2026-06-${formattedDay}`;
                const isCheckedIn = attendance.some(a => a.userId === currentUser.id && a.date === dateStr);
                const isToday = dateStr === todayStr;

                return (
                  <div 
                    key={i} 
                    className={`aspect-square rounded-xl flex items-center justify-center font-mono font-bold text-xs border relative transition-all duration-200
                      ${isCheckedIn 
                        ? 'bg-blue-600 text-white border-blue-500 shadow-sm shadow-blue-500/10' 
                        : isToday
                          ? 'border-blue-500 text-slate-800 bg-blue-50/20'
                          : 'border-slate-100 text-slate-400 bg-slate-50/50'
                      }
                    `}
                  >
                    <span>{dayNum}</span>
                    {isCheckedIn && (
                      <span className="absolute bottom-1 w-1 h-1 rounded-full bg-white animate-ping" />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-4 mt-6 pt-4 border-t border-slate-100 text-[10px] font-mono font-bold text-slate-400">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-blue-600 border border-blue-500" />
                <span>Present</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-slate-50 border border-slate-100" />
                <span>Absent / Rest Day</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* HISTORIC ATTENDANCE LOG TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        
        {/* Table header */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter by name, ID or date (YYYY-MM)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs font-medium pl-9 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 placeholder-slate-400"
            />
          </div>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-2 border border-slate-200 w-full sm:w-auto justify-center cursor-pointer"
            id="attendance-logs-export-btn"
          >
            <Download className="w-3.5 h-3.5" />
            Export logs
          </button>
        </div>

        {/* Attendance data table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <th className="p-4">Member Name</th>
                <th className="p-4">Member ID</th>
                <th className="p-4">Visited Date</th>
                <th className="p-4">Check-In</th>
                <th className="p-4">Check-Out</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
              {filteredAttendance.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-slate-400">
                    No attendance logs recorded under the specified criteria.
                  </td>
                </tr>
              ) : (
                filteredAttendance.slice().reverse().map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-800">{rec.userName}</td>
                    <td className="p-4 font-mono font-medium text-[11px] text-slate-400">{rec.userId}</td>
                    <td className="p-4 font-mono font-medium text-[11px] text-slate-500">{rec.date}</td>
                    <td className="p-4 font-mono font-semibold text-[11px] text-slate-700">{rec.checkInTime} AM</td>
                    <td className="p-4 font-mono font-semibold text-[11px] text-slate-700">
                      {rec.checkOutTime ? `${rec.checkOutTime} ${parseInt(rec.checkOutTime.split(':')[0]) >= 12 ? 'PM' : 'AM'}` : 'Still In Pool'}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-mono
                        ${rec.checkOutTime ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}
                      `}>
                        {rec.checkOutTime ? 'Present' : 'Active'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
