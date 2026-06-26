import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, MembershipPlan, AttendanceRecord, PoolEvent, PoolHoliday, SystemNotification, AuditLog, SystemSettings } from './types';
import { INITIAL_PLANS, INITIAL_USERS, INITIAL_ATTENDANCE, INITIAL_EVENTS, INITIAL_HOLIDAYS, INITIAL_NOTIFICATIONS, INITIAL_AUDIT_LOGS, DEFAULT_SETTINGS } from './mockData';

interface AppStateContextProps {
  users: User[];
  attendance: AttendanceRecord[];
  events: PoolEvent[];
  holidays: PoolHoliday[];
  notifications: SystemNotification[];
  auditLogs: AuditLog[];
  settings: SystemSettings;
  currentUser: User | null;
  currentView: string;
  plans: MembershipPlan[];
  
  setCurrentView: (view: string) => void;
  login: (email: string, role: 'admin' | 'member') => { success: boolean; error?: string; user?: User };
  register: (formData: Partial<User>) => { success: boolean; error?: string };
  logout: () => void;
  approveRegistration: (userId: string) => void;
  rejectRegistration: (userId: string) => void;
  deleteUser: (userId: string) => void;
  updateUser: (userId: string, updatedData: Partial<User>) => void;
  requestRenewal: (userId: string, planId: string) => void;
  approveRenewal: (userId: string) => void;
  checkInUser: (userId: string, checkInTime: string) => { success: boolean; error?: string };
  checkOutUser: (recordId: string, checkOutTime: string) => void;
  addEvent: (event: Omit<PoolEvent, 'id' | 'registeredCount' | 'status'>) => void;
  deleteEvent: (id: string) => void;
  addHoliday: (holiday: Omit<PoolHoliday, 'id'>) => void;
  deleteHoliday: (id: string) => void;
  updateSettings: (newSettings: SystemSettings) => void;
  addLog: (actor: string, action: string, details: string) => void;
  clearNotifications: () => void;
  markNotificationAsRead: (id: string) => void;
}

const AppStateContext = createContext<AppStateContextProps | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage or mock data
  const [users, setUsers] = useState<User[]>(() => {
    const local = localStorage.getItem('bsms_users');
    return local ? JSON.parse(local) : INITIAL_USERS;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const local = localStorage.getItem('bsms_attendance');
    return local ? JSON.parse(local) : INITIAL_ATTENDANCE;
  });

  const [events, setEvents] = useState<PoolEvent[]>(() => {
    const local = localStorage.getItem('bsms_events');
    return local ? JSON.parse(local) : INITIAL_EVENTS;
  });

  const [holidays, setHolidays] = useState<PoolHoliday[]>(() => {
    const local = localStorage.getItem('bsms_holidays');
    return local ? JSON.parse(local) : INITIAL_HOLIDAYS;
  });

  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    const local = localStorage.getItem('bsms_notifications');
    return local ? JSON.parse(local) : INITIAL_NOTIFICATIONS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const local = localStorage.getItem('bsms_audit');
    return local ? JSON.parse(local) : INITIAL_AUDIT_LOGS;
  });

  const [settings, setSettings] = useState<SystemSettings>(() => {
    const local = localStorage.getItem('bsms_settings');
    return local ? JSON.parse(local) : DEFAULT_SETTINGS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const local = localStorage.getItem('bsms_current_user');
    return local ? JSON.parse(local) : null;
  });

  const [currentView, setCurrentView] = useState<string>('dashboard');

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('bsms_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('bsms_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('bsms_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('bsms_holidays', JSON.stringify(holidays));
  }, [holidays]);

  useEffect(() => {
    localStorage.setItem('bsms_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('bsms_audit', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('bsms_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('bsms_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('bsms_current_user');
    }
  }, [currentUser]);

  // Log helper
  const addLog = (actor: string, action: string, details: string) => {
    const newLog: AuditLog = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actor,
      action,
      details,
      ipAddress: '192.168.1.' + Math.floor(Math.random() * 254 + 1)
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Auth Operations
  const login = (email: string, role: 'admin' | 'member') => {
    const lowerEmail = email.trim().toLowerCase();
    
    // Check if user exists with matching email
    const foundUser = users.find(u => u.email.toLowerCase() === lowerEmail);

    if (!foundUser) {
      return { success: false, error: 'No account registered with this email address.' };
    }

    if (foundUser.role !== role) {
      return { success: false, error: `Unauthorized role. Attempted login as ${role} for a ${foundUser.role} account.` };
    }

    if (foundUser.status === 'pending') {
      return { success: false, error: 'Your registration is currently pending administrator review. We will contact you once approved.' };
    }

    if (foundUser.status === 'rejected') {
      return { success: false, error: 'Your membership application was rejected. Please contact Baroda Swimfront administration.' };
    }

    // Success login
    setCurrentUser(foundUser);
    setCurrentView('dashboard');
    addLog(`${foundUser.name} (${foundUser.id})`, 'USER_LOGIN', `Logged in successfully via role: ${role}`);
    return { success: true, user: foundUser };
  };

  const register = (formData: Partial<User>) => {
    const existing = users.find(u => u.email.toLowerCase() === formData.email?.toLowerCase());
    if (existing) {
      return { success: false, error: 'An account with this email address already exists.' };
    }

    const newId = 'm-' + Math.floor(Math.random() * 90000 + 10000);
    const newUser: User = {
      id: newId,
      name: formData.name || 'Anonymous User',
      email: formData.email?.toLowerCase() || '',
      role: 'member',
      status: 'pending', // Registration starts as pending
      phone: formData.phone || '',
      joinDate: new Date().toISOString().split('T')[0],
      gender: formData.gender || 'Male',
      dateOfBirth: formData.dateOfBirth || '',
      emergencyContactName: formData.emergencyContactName || '',
      emergencyContactPhone: formData.emergencyContactPhone || '',
      medicalInformation: formData.medicalInformation || 'None',
      attendanceCount: 0
    };

    setUsers(prev => [...prev, newUser]);
    
    // Generate notification for admins
    const newNotify: SystemNotification = {
      id: 'n-reg-' + Date.now(),
      title: 'New Member Registration Pending',
      message: `${newUser.name} has submitted a membership registration and is waiting for review.`,
      date: new Date().toISOString().split('T')[0],
      type: 'system',
      read: false
    };
    setNotifications(prev => [newNotify, ...prev]);

    addLog(newUser.name, 'USER_REGISTER', `Form submitted. Registration is pending admin review.`);
    return { success: true };
  };

  const logout = () => {
    if (currentUser) {
      addLog(`${currentUser.name} (${currentUser.id})`, 'USER_LOGOUT', 'Logged out successfully');
    }
    setCurrentUser(null);
    setCurrentView('dashboard');
  };

  // Admin operations
  const approveRegistration = (userId: string) => {
    // Generate default membership details (1 month Standard Plan as starter)
    const start = new Date().toISOString().split('T')[0];
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);
    const expiry = expiryDate.toISOString().split('T')[0];

    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          status: 'approved',
          planId: 'monthly',
          membershipStart: start,
          membershipExpiry: expiry
        };
      }
      return u;
    }));

    const u = users.find(user => user.id === userId);
    if (u) {
      // Send individual notification
      const newNotify: SystemNotification = {
        id: 'n-approved-' + Date.now(),
        title: 'Membership Approved!',
        message: `Congratulations! Your Baroda Swimfront membership application has been approved. Your 1-Month Standard Monthly plan is now active.`,
        date: new Date().toISOString().split('T')[0],
        type: 'membership',
        read: false,
        userId: userId
      };
      setNotifications(prev => [newNotify, ...prev]);
      addLog('Admin (Digvijay)', 'APPROVE_REGISTRATION', `Approved registration for ${u.name} (${u.id})`);
    }
  };

  const rejectRegistration = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, status: 'rejected' };
      }
      return u;
    }));

    const u = users.find(user => user.id === userId);
    if (u) {
      addLog('Admin (Digvijay)', 'REJECT_REGISTRATION', `Rejected registration application for ${u.name} (${u.id})`);
    }
  };

  const deleteUser = (userId: string) => {
    const u = users.find(user => user.id === userId);
    setUsers(prev => prev.filter(user => user.id !== userId));
    if (u) {
      addLog('Admin (Digvijay)', 'DELETE_USER', `Permanently deleted user account for ${u.name} (${u.id})`);
    }
  };

  const updateUser = (userId: string, updatedData: Partial<User>) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const result = { ...u, ...updatedData };
        // If current user, update session as well
        if (currentUser && currentUser.id === userId) {
          setCurrentUser(result);
        }
        return result;
      }
      return u;
    }));
    addLog('System', 'UPDATE_USER_PROFILE', `Updated details for user ID: ${userId}`);
  };

  const requestRenewal = (userId: string, planId: string) => {
    // Member requests a renewal
    const plan = INITIAL_PLANS.find(p => p.id === planId);
    if (!plan) return;

    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        // Tag with a transient state representing renewal requested
        return {
          ...u,
          // We can model this by storing the requested plan ID in a metadata or custom field,
          // which is highly compliant with dynamic mock data!
          medicalInformation: u.medicalInformation.includes('[RENEWAL_PENDING:') 
            ? u.medicalInformation.replace(/\[RENEWAL_PENDING:.*?\]/g, `[RENEWAL_PENDING:${planId}]`)
            : u.medicalInformation + ` [RENEWAL_PENDING:${planId}]`
        };
      }
      return u;
    }));

    const u = users.find(user => user.id === userId);
    // Notify admin
    const newNotify: SystemNotification = {
      id: 'n-renewal-req-' + Date.now(),
      title: 'Membership Renewal Requested',
      message: `${u?.name} has requested a renewal for the plan: ${plan.name}.`,
      date: new Date().toISOString().split('T')[0],
      type: 'membership',
      read: false
    };
    setNotifications(prev => [newNotify, ...prev]);

    addLog(u?.name || 'Member', 'REQUEST_RENEWAL', `Requested renewal plan: ${plan.name}`);
  };

  const approveRenewal = (userId: string) => {
    const u = users.find(user => user.id === userId);
    if (!u) return;

    // Detect which plan was requested
    let requestedPlanId = 'monthly';
    const match = u.medicalInformation.match(/\[RENEWAL_PENDING:(.*?)\]/);
    if (match && match[1]) {
      requestedPlanId = match[1];
    }

    const plan = INITIAL_PLANS.find(p => p.id === requestedPlanId) || INITIAL_PLANS[0];
    
    // Extend expiry
    const currentExpiry = u.membershipExpiry ? new Date(u.membershipExpiry) : new Date();
    // If expired, start from today, otherwise append
    const baseDate = currentExpiry.getTime() < Date.now() ? new Date() : currentExpiry;
    baseDate.setMonth(baseDate.getMonth() + plan.durationMonths);
    const newExpiry = baseDate.toISOString().split('T')[0];

    // Remove the [RENEWAL_PENDING] string
    const clearedMedical = u.medicalInformation.replace(/\[RENEWAL_PENDING:.*?\]/g, '').trim();

    setUsers(prev => prev.map(usr => {
      if (usr.id === userId) {
        return {
          ...usr,
          planId: plan.id,
          membershipStart: new Date().toISOString().split('T')[0],
          membershipExpiry: newExpiry,
          medicalInformation: clearedMedical || 'None'
        };
      }
      return usr;
    }));

    // Update currentUser context if they are the one being approved
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prev => prev ? {
        ...prev,
        planId: plan.id,
        membershipStart: new Date().toISOString().split('T')[0],
        membershipExpiry: newExpiry,
        medicalInformation: clearedMedical || 'None'
      } : null);
    }

    // Add individual notification
    const newNotify: SystemNotification = {
      id: 'n-renewal-ok-' + Date.now(),
      title: 'Membership Renewed Successfully!',
      message: `Your renewal request for the ${plan.name} has been approved by the Administrator. Your membership is now extended to ${newExpiry}.`,
      date: new Date().toISOString().split('T')[0],
      type: 'membership',
      read: false,
      userId: userId
    };
    setNotifications(prev => [newNotify, ...prev]);

    addLog('Admin (Digvijay)', 'APPROVE_RENEWAL', `Approved renewal extension for ${u.name} (${u.id}) to ${newExpiry}`);
  };

  // Attendance Check-In / Check-Out
  const checkInUser = (userId: string, checkInTime: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) {
      return { success: false, error: 'User ID not found in system database.' };
    }

    if (user.status !== 'approved') {
      return { success: false, error: 'Only approved active members can check in.' };
    }

    // Check if user has active membership
    const expiry = user.membershipExpiry ? new Date(user.membershipExpiry) : null;
    if (!expiry || expiry.getTime() < Date.now()) {
      return { success: false, error: 'Membership has expired. Please renew membership to check in.' };
    }

    // Check if already checked in today (and not checked out)
    const todayStr = new Date().toISOString().split('T')[0];
    const alreadyCheckedIn = attendance.find(a => a.userId === userId && a.date === todayStr && !a.checkOutTime);
    if (alreadyCheckedIn) {
      return { success: false, error: `${user.name} is already checked in for today.` };
    }

    const newRecord: AttendanceRecord = {
      id: 'att-' + Date.now(),
      userId,
      userName: user.name,
      date: todayStr,
      checkInTime,
      status: 'Present'
    };

    setAttendance(prev => [...prev, newRecord]);
    
    // Increment attendance count
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          attendanceCount: u.attendanceCount + 1,
          lastVisit: todayStr
        };
      }
      return u;
    }));

    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prev => prev ? {
        ...prev,
        attendanceCount: prev.attendanceCount + 1,
        lastVisit: todayStr
      } : null);
    }

    addLog('QR Terminal', 'CHECK_IN_QR', `${user.name} scanned in at ${checkInTime}`);
    return { success: true };
  };

  const checkOutUser = (recordId: string, checkOutTime: string) => {
    let userName = '';
    setAttendance(prev => prev.map(rec => {
      if (rec.id === recordId) {
        userName = rec.userName;
        return { ...rec, checkOutTime };
      }
      return rec;
    }));

    addLog('QR Terminal', 'CHECK_OUT_QR', `${userName} scanned out at ${checkOutTime}`);
  };

  // Event operations
  const addEvent = (eventData: Omit<PoolEvent, 'id' | 'registeredCount' | 'status'>) => {
    const newEvent: PoolEvent = {
      ...eventData,
      id: 'e-' + Date.now(),
      registeredCount: 0,
      status: 'open'
    };

    setEvents(prev => [...prev, newEvent]);

    const newNotify: SystemNotification = {
      id: 'n-evt-' + Date.now(),
      title: 'New Event Scheduled: ' + newEvent.title,
      message: `Join our upcoming ${newEvent.type.replace('_', ' ')} event on ${newEvent.date} at ${newEvent.time}! Description: ${newEvent.description}`,
      date: new Date().toISOString().split('T')[0],
      type: 'event',
      read: false
    };
    setNotifications(prev => [newNotify, ...prev]);

    addLog('Admin (Digvijay)', 'CREATE_EVENT', `Published event: ${newEvent.title}`);
  };

  const deleteEvent = (id: string) => {
    const evt = events.find(e => e.id === id);
    setEvents(prev => prev.filter(e => e.id !== id));
    if (evt) {
      addLog('Admin (Digvijay)', 'DELETE_EVENT', `Removed event publication: ${evt.title}`);
    }
  };

  // Holiday operations
  const addHoliday = (holidayData: Omit<PoolHoliday, 'id'>) => {
    const newHoliday: PoolHoliday = {
      ...holidayData,
      id: 'h-' + Date.now()
    };

    setHolidays(prev => [...prev, newHoliday]);

    const newNotify: SystemNotification = {
      id: 'n-hol-' + Date.now(),
      title: 'Facility Notice: ' + newHoliday.title,
      message: `Please note that from ${newHoliday.startDate} to ${newHoliday.endDate}, Baroda Swimfront will observe ${newHoliday.type} schedules. Details: ${newHoliday.description}`,
      date: new Date().toISOString().split('T')[0],
      type: 'holiday',
      read: false
    };
    setNotifications(prev => [newNotify, ...prev]);

    addLog('Admin (Digvijay)', 'CREATE_HOLIDAY', `Scheduled pool calendar notice: ${newHoliday.title}`);
  };

  const deleteHoliday = (id: string) => {
    const hol = holidays.find(h => h.id === id);
    setHolidays(prev => prev.filter(h => h.id !== id));
    if (hol) {
      addLog('Admin (Digvijay)', 'DELETE_HOLIDAY', `Removed holiday notice: ${hol.title}`);
    }
  };

  // Settings
  const updateSettings = (newSettings: SystemSettings) => {
    setSettings(newSettings);
    addLog('Admin (Digvijay)', 'UPDATE_SYSTEM_SETTINGS', 'Modified enterprise system config parameters');
  };

  const clearNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <AppStateContext.Provider value={{
      users,
      attendance,
      events,
      holidays,
      notifications,
      auditLogs,
      settings,
      currentUser,
      currentView,
      plans: INITIAL_PLANS,
      setCurrentView,
      login,
      register,
      logout,
      approveRegistration,
      rejectRegistration,
      deleteUser,
      updateUser,
      requestRenewal,
      approveRenewal,
      checkInUser,
      checkOutUser,
      addEvent,
      deleteEvent,
      addHoliday,
      deleteHoliday,
      updateSettings,
      addLog,
      clearNotifications,
      markNotificationAsRead
    }}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
