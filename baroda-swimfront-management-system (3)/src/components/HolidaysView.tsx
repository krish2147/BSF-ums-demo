import React, { useState } from 'react';
import { useAppState } from '../AppStateContext';
import { PoolHoliday } from '../types';
import { 
  CalendarDays, 
  Settings, 
  Trash2, 
  Plus, 
  X, 
  AlertTriangle, 
  ShieldAlert,
  Megaphone,
  Wrench
} from 'lucide-react';

export const HolidaysView: React.FC = () => {
  const { currentUser, holidays, addHoliday, deleteHoliday } = useAppState();
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'maintenance' | 'festival' | 'national' | 'weather'>('maintenance');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');

  if (!currentUser) return null;

  const isAdmin = currentUser.role === 'admin';

  const handleCreateHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    addHoliday({
      title,
      type,
      startDate,
      endDate,
      description
    });

    // Reset Form
    setTitle('');
    setType('maintenance');
    setStartDate('');
    setEndDate('');
    setDescription('');
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6" id="holidays-module-view">
      
      {/* Title block */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-800 font-display">Pool Calendar Rules</h3>
          <p className="text-xs text-slate-400 font-medium">Scheduled maintenance shutdowns, public holidays, and notices</p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            id="admin-create-holiday-btn"
          >
            <Plus className="w-4 h-4" />
            Schedule Shutdown / Holiday
          </button>
        )}
      </div>

      {/* Main grids of upcoming calendar shutdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {holidays.map((hol) => (
          <div 
            key={hol.id} 
            className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-all relative overflow-hidden"
          >
            {/* Ambient accent bar depending on closure type */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 
              ${hol.type === 'maintenance' 
                ? 'bg-amber-500' 
                : hol.type === 'weather'
                  ? 'bg-red-500'
                  : hol.type === 'festival'
                    ? 'bg-purple-500'
                    : 'bg-indigo-500'
              }
            `} />

            <div className="pt-2">
              <div className="flex items-center justify-between mb-3.5">
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold font-mono uppercase flex items-center gap-1
                  ${hol.type === 'maintenance' 
                    ? 'bg-amber-50 text-amber-700 border border-amber-100' 
                    : hol.type === 'weather'
                      ? 'bg-red-50 text-red-700 border border-red-100'
                      : 'bg-slate-50 text-slate-700 border border-slate-100'
                  }
                `}>
                  {hol.type === 'maintenance' && <Wrench className="w-2.5 h-2.5" />}
                  {hol.type === 'weather' && <ShieldAlert className="w-2.5 h-2.5" />}
                  {hol.type} Notice
                </span>

                <span className="text-[10px] font-mono font-bold text-slate-400">
                  {hol.startDate === hol.endDate ? hol.startDate : `${hol.startDate} to ${hol.endDate}`}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-800 tracking-tight leading-snug">{hol.title}</h4>
              <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed">{hol.description}</p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-semibold font-mono">
              <span>STATUS: CLOSED FOR SWIMMING</span>
              
              {isAdmin && (
                <button
                  onClick={() => deleteHoliday(hol.id)}
                  className="p-1 text-slate-400 hover:text-red-500 rounded hover:bg-red-50 transition-colors cursor-pointer"
                  title="Remove Notice"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: ADMIN SCHEDULE SHUTDOWN */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-display font-bold text-slate-800 text-base">Schedule Pool Calendar Shutdown</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateHoliday} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Notice / Holiday Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Filter Deep-Clean Maintenance"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Notice Category</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-700 focus:outline-none"
                  >
                    <option value="maintenance">Sanitization / Maintenance (Amber)</option>
                    <option value="festival">Festival Holiday (Purple)</option>
                    <option value="national">National Holiday (Blue)</option>
                    <option value="weather">Severe Weather Emergency (Red)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-700"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Detailed closure description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Outline the reasons for the shutdown, whether water is completely drained, and which alternative hours are active."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-700 resize-none"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-2 text-[10px] text-amber-800 leading-normal font-medium">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p>Scheduling a shutdown will immediately dispatch a system notification push banner to all pool members.</p>
              </div>

              <div className="flex gap-3 justify-end pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-md"
                >
                  Broadcast Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
