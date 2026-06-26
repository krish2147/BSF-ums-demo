import React, { useState, useEffect } from 'react';
import { useAppState } from '../AppStateContext';
import { PoolEvent } from '../types';
import { 
  Award, 
  Calendar, 
  Clock, 
  Users, 
  Plus, 
  CheckCircle, 
  X,
  Megaphone,
  BellRing
} from 'lucide-react';

export const EventsView: React.FC = () => {
  const { currentUser, events, addEvent, deleteEvent } = useAppState();
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Registration list simulation
  const [userRegisteredEventIds, setUserRegisteredEventIds] = useState<string[]>(() => {
    const local = localStorage.getItem('bsms_registered_events');
    return local ? JSON.parse(local) : ['e3']; // pre-register for 1 event
  });

  // Countdown timer state
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Admin form state
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'competition' | 'camp' | 'special_session' | 'training'>('competition');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [capacity, setCapacity] = useState(50);

  useEffect(() => {
    localStorage.setItem('bsms_registered_events', JSON.stringify(userRegisteredEventIds));
  }, [userRegisteredEventIds]);

  // Calculate countdown to first event (Monsoon Swim Gala 2026: July 12)
  useEffect(() => {
    const targetDate = new Date('2026-07-12T08:00:00');
    
    const interval = setInterval(() => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        clearInterval(interval);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdown({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!currentUser) return null;

  const isAdmin = currentUser.role === 'admin';

  const handleRegisterEvent = (eventId: string) => {
    if (userRegisteredEventIds.includes(eventId)) return;
    
    setUserRegisteredEventIds(prev => [...prev, eventId]);
    
    // Increment count on event (transiently update appState)
    events.forEach(e => {
      if (e.id === eventId) {
        e.registeredCount = Math.min(e.maxCapacity, e.registeredCount + 1);
      }
    });
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    addEvent({
      title,
      type,
      date,
      time,
      description,
      registrationDeadline: deadline,
      maxCapacity: capacity
    });

    // Reset Form
    setTitle('');
    setType('competition');
    setDate('');
    setTime('');
    setDescription('');
    setDeadline('');
    setCapacity(50);
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6" id="events-module-view">
      
      {/* Marquee Countdown Banner to Gala */}
      <div className="rounded-3xl p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 text-white relative overflow-hidden shadow-xl text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl" />
        
        <div>
          <span className="px-2.5 py-0.5 text-[9px] bg-cyan-500 text-slate-950 font-bold rounded-full uppercase tracking-widest font-mono">
            Mega Championship Coming Up
          </span>
          <h2 className="text-xl md:text-2xl font-display font-bold tracking-tight mt-2 text-white">
            Baroda Monsoon Swim Gala 2026
          </h2>
          <p className="text-slate-400 text-xs mt-1 max-w-md font-medium leading-normal">
            Relay lanes are closing on July 5th. Swimmers must complete trial loops at Swimfront to register.
          </p>
        </div>

        {/* Live Countdown clocks with JetBrains Mono numbers */}
        <div className="flex items-center gap-3 shrink-0 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
          <div className="flex flex-col items-center">
            <span className="text-xl md:text-2xl font-display font-black text-cyan-400 font-mono tracking-tight">{countdown.days}</span>
            <span className="text-[8px] text-slate-500 font-bold uppercase mt-1">Days</span>
          </div>
          <span className="text-slate-600 font-extrabold text-lg">:</span>
          <div className="flex flex-col items-center">
            <span className="text-xl md:text-2xl font-display font-black text-cyan-400 font-mono tracking-tight">{countdown.hours}</span>
            <span className="text-[8px] text-slate-500 font-bold uppercase mt-1">Hours</span>
          </div>
          <span className="text-slate-600 font-extrabold text-lg">:</span>
          <div className="flex flex-col items-center">
            <span className="text-xl md:text-2xl font-display font-black text-cyan-400 font-mono tracking-tight">{countdown.minutes}</span>
            <span className="text-[8px] text-slate-500 font-bold uppercase mt-1">Mins</span>
          </div>
          <span className="text-slate-600 font-extrabold text-lg">:</span>
          <div className="flex flex-col items-center">
            <span className="text-xl md:text-2xl font-display font-black text-cyan-400 font-mono tracking-tight">{countdown.seconds}</span>
            <span className="text-[8px] text-slate-500 font-bold uppercase mt-1">Secs</span>
          </div>
        </div>
      </div>

      {/* Actions and title Row */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-800 font-display">Baroda Swimfront Events Desk</h3>
          <p className="text-xs text-slate-400 font-medium">Competitions, specialized clinics, and leisure events</p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            id="admin-create-event-btn"
          >
            <Plus className="w-4 h-4" />
            Schedule Event
          </button>
        )}
      </div>

      {/* Events listing grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((evt) => {
          const isRegistered = userRegisteredEventIds.includes(evt.id);
          const capPercent = Math.round((evt.registeredCount / evt.maxCapacity) * 100);

          return (
            <div key={evt.id} className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
              <div>
                <div className="flex items-center justify-between mb-3 border-b border-slate-50 pb-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold font-mono uppercase
                    ${evt.type === 'competition' 
                      ? 'bg-red-50 text-red-700 border border-red-100' 
                      : evt.type === 'camp'
                        ? 'bg-amber-50 text-amber-700 border border-amber-100'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                    }
                  `}>
                    {evt.type.replace('_', ' ')}
                  </span>
                  
                  {isRegistered && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-[9px] font-bold font-mono">
                      <CheckCircle className="w-3 h-3" />
                      REGISTERED
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-slate-800 tracking-tight leading-snug">{evt.title}</h4>
                <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed line-clamp-3">{evt.description}</p>

                {/* Logistics */}
                <div className="grid grid-cols-2 gap-3 my-4 bg-slate-50 p-2.5 rounded-2xl border border-slate-100/50 text-xs">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <span className="text-[9px] text-slate-400 font-semibold block uppercase">Scheduled</span>
                      <span className="font-bold text-slate-700 font-mono text-[10px] block mt-0.5">{evt.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <span className="text-[9px] text-slate-400 font-semibold block uppercase">Time slots</span>
                      <span className="font-bold text-slate-700 text-[10px] block mt-0.5">{evt.time}</span>
                    </div>
                  </div>
                </div>

                {/* Capacity index */}
                <div className="space-y-1.5 mb-5 text-[10px] font-medium text-slate-500">
                  <div className="flex justify-between font-mono">
                    <span>Registered Ratio</span>
                    <span className="font-bold">{evt.registeredCount} / {evt.maxCapacity} Seats ({capPercent}%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500
                        ${capPercent > 80 ? 'bg-amber-500' : 'bg-cyan-500'}
                      `}
                      style={{ width: `${capPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase">Deadline: {evt.registrationDeadline}</span>
                
                {isAdmin ? (
                  <button
                    onClick={() => deleteEvent(evt.id)}
                    className="text-red-500 hover:text-red-600 text-xs font-bold px-3 py-1.5 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                ) : (
                  <button
                    disabled={isRegistered || evt.registeredCount >= evt.maxCapacity}
                    onClick={() => handleRegisterEvent(evt.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer
                      ${isRegistered 
                        ? 'bg-slate-100 text-slate-400 border border-slate-200/50 cursor-not-allowed' 
                        : evt.registeredCount >= evt.maxCapacity
                          ? 'bg-red-50 text-red-500 border border-red-100/50 cursor-not-allowed'
                          : 'bg-cyan-500 hover:bg-cyan-600 text-white shadow-sm shadow-cyan-500/10'
                      }
                    `}
                  >
                    {isRegistered ? 'RSVP Confirmed' : evt.registeredCount >= evt.maxCapacity ? 'Passes sold out' : 'Register Pass'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: ADMIN SCHEDULE EVENT */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-display font-bold text-slate-800 text-base">Schedule Pool Event</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Olympic Training trials"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Event Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-700 focus:outline-none"
                  >
                    <option value="competition">Competition</option>
                    <option value="camp">Coaching Camp</option>
                    <option value="special_session">Special Session</option>
                    <option value="training">Lane Training</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Swimmer Capacity Limit</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={capacity}
                    onChange={(e) => setCapacity(parseInt(e.target.value))}
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-700"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Event Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-700"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Start Time</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 08:30 AM"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Registration RSVP Deadline</label>
                <input
                  type="date"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-700"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Detailed description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Outline schedules, relay rules, trial timings or specific requirements."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-700 resize-none"
                />
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
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
