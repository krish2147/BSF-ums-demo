import { User, MembershipPlan, AttendanceRecord, PoolEvent, PoolHoliday, SystemNotification, AuditLog, SystemSettings } from './types';

export const INITIAL_PLANS: MembershipPlan[] = [
  {
    id: 'monthly',
    name: 'Standard Monthly',
    durationMonths: 1,
    price: 60,
    features: ['Unlimited Pool Access', 'Locker Room Access', '1 Guest Pass / Month', 'Standard Coaching Support'],
    color: 'from-blue-500 to-indigo-500'
  },
  {
    id: 'quarterly',
    name: 'Quarterly Premium',
    durationMonths: 3,
    price: 150,
    features: ['Unlimited Pool Access', 'Locker Room Access', 'Premium Lane Reservation', '5 Guest Passes', 'Weekly Coach Consultation', '10% Discount on Events'],
    color: 'from-cyan-500 to-blue-600'
  },
  {
    id: 'semi-annual',
    name: 'Semi-Annual Elite',
    durationMonths: 6,
    price: 280,
    features: ['Unlimited Pool Access', 'Private Locker Assignment', 'Lane Reservation Priority', 'Unlimited Guest Passes (1 per visit)', 'Personal Training (2 sessions)', 'Free Event Registrations (2 events)'],
    color: 'from-teal-500 to-emerald-600'
  },
  {
    id: 'annual',
    name: 'Annual SwimPro Ultimate',
    durationMonths: 12,
    price: 500,
    features: ['24/7 Priority Pool Access', 'Dedicated Locker Assignment', 'Complimentary SwimPro Gear Kit', 'Unlimited Guest Passes', 'Dedicated Personal Coach (Weekly)', 'All Event Registrations Included', 'Free Towel Service'],
    color: 'from-amber-500 to-orange-600'
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'm1',
    name: 'Aarav Patel',
    email: 'aarav.patel@gmail.com',
    role: 'member',
    status: 'approved',
    phone: '+91 98765 43210',
    joinDate: '2026-01-10',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    planId: 'quarterly',
    membershipStart: '2026-04-15',
    membershipExpiry: '2026-07-15',
    gender: 'Male',
    dateOfBirth: '1998-05-24',
    emergencyContactName: 'Rajesh Patel',
    emergencyContactPhone: '+91 98765 11111',
    medicalInformation: 'None',
    attendanceCount: 42,
    lastVisit: '2026-06-25'
  },
  {
    id: 'm2',
    name: 'Pooja Shah',
    email: 'pooja.shah@outlook.com',
    role: 'member',
    status: 'approved',
    phone: '+91 91234 56789',
    joinDate: '2025-11-20',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    planId: 'annual',
    membershipStart: '2025-11-20',
    membershipExpiry: '2026-11-20',
    gender: 'Female',
    dateOfBirth: '1995-12-14',
    emergencyContactName: 'Amit Shah',
    emergencyContactPhone: '+91 91234 22222',
    medicalInformation: 'Mild Asthmatic - keeps inhaler in locker',
    attendanceCount: 89,
    lastVisit: '2026-06-26'
  },
  {
    id: 'm3',
    name: 'Kabir Mehta',
    email: 'kabir.mehta@yahoo.com',
    role: 'member',
    status: 'approved',
    phone: '+91 88888 77777',
    joinDate: '2026-05-01',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    planId: 'monthly',
    membershipStart: '2026-06-01',
    membershipExpiry: '2026-07-01', // Expiring soon!
    gender: 'Male',
    dateOfBirth: '2001-09-02',
    emergencyContactName: 'Sushila Mehta',
    emergencyContactPhone: '+91 88888 11111',
    medicalInformation: 'Allergy to penicillin',
    attendanceCount: 15,
    lastVisit: '2026-06-24'
  },
  {
    id: 'm4',
    name: 'Ananya Desai',
    email: 'ananya.desai@gmail.com',
    role: 'member',
    status: 'approved',
    phone: '+91 77777 66666',
    joinDate: '2026-02-15',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    planId: 'monthly',
    membershipStart: '2026-05-10',
    membershipExpiry: '2026-06-10', // Expired
    gender: 'Female',
    dateOfBirth: '2000-03-30',
    emergencyContactName: 'Vijay Desai',
    emergencyContactPhone: '+91 77777 22222',
    medicalInformation: 'None',
    attendanceCount: 18,
    lastVisit: '2026-06-09'
  },
  {
    id: 'm5',
    name: 'Rohan Joshi',
    email: 'rohan.joshi@gmail.com',
    role: 'member',
    status: 'approved',
    phone: '+91 99009 90099',
    joinDate: '2026-06-12',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    planId: 'quarterly',
    membershipStart: '2026-06-12',
    membershipExpiry: '2026-09-12',
    gender: 'Male',
    dateOfBirth: '1992-07-15',
    emergencyContactName: 'Preeti Joshi',
    emergencyContactPhone: '+91 99009 11111',
    medicalInformation: 'Slight lower back sensitivity',
    attendanceCount: 8,
    lastVisit: '2026-06-25'
  },
  // Pending registration users
  {
    id: 'p1',
    name: 'Meera Trivedi',
    email: 'meera.trivedi@gmail.com',
    role: 'member',
    status: 'pending',
    phone: '+91 95432 10987',
    joinDate: '2026-06-25',
    gender: 'Female',
    dateOfBirth: '1997-11-05',
    emergencyContactName: 'Sanjay Trivedi',
    emergencyContactPhone: '+91 95432 00000',
    medicalInformation: 'No medical history',
    attendanceCount: 0
  },
  {
    id: 'p2',
    name: 'Devang Vaghela',
    email: 'devang.v@gmail.com',
    role: 'member',
    status: 'pending',
    phone: '+91 94222 33333',
    joinDate: '2026-06-26',
    gender: 'Male',
    dateOfBirth: '1994-01-21',
    emergencyContactName: 'Kajal Vaghela',
    emergencyContactPhone: '+91 94222 11111',
    medicalInformation: 'None',
    attendanceCount: 0
  },
  // Rejected user
  {
    id: 'r1',
    name: 'Vikram Rathod',
    email: 'vikram.rathod@spammail.com',
    role: 'member',
    status: 'rejected',
    phone: '+91 90000 00001',
    joinDate: '2026-06-20',
    gender: 'Male',
    dateOfBirth: '1990-08-10',
    emergencyContactName: 'Shanti Rathod',
    emergencyContactPhone: '+91 90000 00002',
    medicalInformation: 'Highly incomplete form / suspicious email',
    attendanceCount: 0
  },
  // Admin user
  {
    id: 'a1',
    name: 'Commander Digvijay Singh',
    email: 'admin@swimfront.com',
    role: 'admin',
    status: 'approved',
    phone: '+91 90000 90000',
    joinDate: '2025-01-01',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    gender: 'Male',
    dateOfBirth: '1974-04-12',
    emergencyContactName: 'Baroda Swimfront Board',
    emergencyContactPhone: '+91 90000 00000',
    medicalInformation: 'None',
    attendanceCount: 0
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  { id: 'a-1', userId: 'm1', userName: 'Aarav Patel', date: '2026-06-20', checkInTime: '06:15', checkOutTime: '07:30', status: 'Present' },
  { id: 'a-2', userId: 'm2', userName: 'Pooja Shah', date: '2026-06-20', checkInTime: '07:00', checkOutTime: '08:15', status: 'Present' },
  { id: 'a-3', userId: 'm3', userName: 'Kabir Mehta', date: '2026-06-20', checkInTime: '18:30', checkOutTime: '19:45', status: 'Present' },
  
  { id: 'a-4', userId: 'm1', userName: 'Aarav Patel', date: '2026-06-21', checkInTime: '06:20', checkOutTime: '07:35', status: 'Present' },
  { id: 'a-5', userId: 'm2', userName: 'Pooja Shah', date: '2026-06-21', checkInTime: '07:05', checkOutTime: '08:30', status: 'Present' },
  
  { id: 'a-6', userId: 'm1', userName: 'Aarav Patel', date: '2026-06-22', checkInTime: '06:10', checkOutTime: '07:20', status: 'Present' },
  { id: 'a-7', userId: 'm2', userName: 'Pooja Shah', date: '2026-06-22', checkInTime: '07:00', checkOutTime: '08:10', status: 'Present' },
  { id: 'a-8', userId: 'm3', userName: 'Kabir Mehta', date: '2026-06-22', checkInTime: '18:40', checkOutTime: '19:50', status: 'Present' },
  { id: 'a-9', userId: 'm5', userName: 'Rohan Joshi', date: '2026-06-22', checkInTime: '08:00', checkOutTime: '09:00', status: 'Present' },
  
  { id: 'a-10', userId: 'm1', userName: 'Aarav Patel', date: '2026-06-23', checkInTime: '06:05', checkOutTime: '07:15', status: 'Present' },
  { id: 'a-11', userId: 'm2', userName: 'Pooja Shah', date: '2026-06-23', checkInTime: '19:00', checkOutTime: '20:15', status: 'Present' },
  { id: 'a-12', userId: 'm5', userName: 'Rohan Joshi', date: '2026-06-23', checkInTime: '08:05', checkOutTime: '09:15', status: 'Present' },
  
  { id: 'a-13', userId: 'm1', userName: 'Aarav Patel', date: '2026-06-24', checkInTime: '06:12', checkOutTime: '07:30', status: 'Present' },
  { id: 'a-14', userId: 'm2', userName: 'Pooja Shah', date: '2026-06-24', checkInTime: '07:02', checkOutTime: '08:20', status: 'Present' },
  { id: 'a-15', userId: 'm3', userName: 'Kabir Mehta', date: '2026-06-24', checkInTime: '18:15', checkOutTime: '19:30', status: 'Present' },
  
  { id: 'a-16', userId: 'm1', userName: 'Aarav Patel', date: '2026-06-25', checkInTime: '06:30', checkOutTime: '07:45', status: 'Present' },
  { id: 'a-17', userId: 'm2', userName: 'Pooja Shah', date: '2026-06-25', checkInTime: '07:10', checkOutTime: '08:30', status: 'Present' },
  { id: 'a-18', userId: 'm5', userName: 'Rohan Joshi', date: '2026-06-25', checkInTime: '08:15', checkOutTime: '09:30', status: 'Present' },
  
  { id: 'a-19', userId: 'm2', userName: 'Pooja Shah', date: '2026-06-26', checkInTime: '06:45', status: 'Present' } // Active session today!
];

export const INITIAL_EVENTS: PoolEvent[] = [
  {
    id: 'e1',
    title: 'Baroda Monsoon Swim Gala 2026',
    type: 'competition',
    date: '2026-07-12',
    time: '08:00 AM',
    description: 'The annual flagship state-level swimming tournament featuring freestyle, breaststroke, and butterfly relays. Over 50 external swim clubs are participating.',
    registrationDeadline: '2026-07-05',
    maxCapacity: 100,
    registeredCount: 78,
    status: 'open'
  },
  {
    id: 'e2',
    title: 'Olympic-Grade Breathing & Speed Clinic',
    type: 'camp',
    date: '2026-07-20',
    time: '10:00 AM',
    description: '3-day rigorous camp hosted by ex-national coach Rajendra Prasad. Focuses on explosive diving starts, flip-turn efficiency, and respiratory recovery under load.',
    registrationDeadline: '2026-07-18',
    maxCapacity: 30,
    registeredCount: 12,
    status: 'open'
  },
  {
    id: 'e3',
    title: 'Night Swim & Aqua Aerobics Fiesta',
    type: 'special_session',
    date: '2026-08-01',
    time: '07:30 PM',
    description: 'An interactive underwater LED-lit rhythm swimming and light physical aerobic event. Families and members are all welcome.',
    registrationDeadline: '2026-07-30',
    maxCapacity: 150,
    registeredCount: 145,
    status: 'open'
  }
];

export const INITIAL_HOLIDAYS: PoolHoliday[] = [
  {
    id: 'h1',
    title: 'Annual Filter Replacement & Tiling Maintenance',
    type: 'maintenance',
    startDate: '2026-07-01',
    endDate: '2026-07-03',
    description: 'Complete water drainage, deep sanitization, filter replacements, and replacement of broken lane grids. Pool is closed for these 3 days.'
  },
  {
    id: 'h2',
    title: 'Guru Purnima Celebration',
    type: 'festival',
    startDate: '2026-07-29',
    endDate: '2026-07-29',
    description: 'Morning coaches tribute event from 09:00 to 11:30 AM. Casual swim lanes will be closed, but members are invited to attend the celebration.'
  },
  {
    id: 'h3',
    title: 'Independence Day Pool Closure',
    type: 'national',
    startDate: '2026-08-15',
    endDate: '2026-08-15',
    description: 'National public holiday. Facilities closed all day except for flag hoisting ceremony at 08:00 AM.'
  }
];

export const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'n1',
    title: 'Upcoming Filter Maintenance Shutdown',
    message: 'Baroda Swimfront pool will remain closed for mandatory deep maintenance and premium grade filter replacement from July 1st to July 3rd, 2026.',
    date: '2026-06-25',
    type: 'holiday',
    read: false
  },
  {
    id: 'n2',
    title: 'Monsoon Swim Gala Registrations Open',
    message: 'Members are requested to register early for the Baroda Monsoon Swim Gala on July 12th. Lanes are filling up quickly!',
    date: '2026-06-24',
    type: 'event',
    read: false
  },
  {
    id: 'n3',
    title: 'Membership Status Notice',
    message: 'Your membership is active. Renewal discounts are active if paid via Baroda Bank Cards.',
    date: '2026-06-26',
    type: 'membership',
    read: true,
    userId: 'm1'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  { id: 'l1', timestamp: '2026-06-26 09:12:05', actor: 'Admin (Commander Digvijay)', action: 'APPROVED_REGISTRATION', details: 'Approved membership request for Rohan Joshi', ipAddress: '192.168.1.4' },
  { id: 'l2', timestamp: '2026-06-25 18:30:10', actor: 'm3 (Kabir Mehta)', action: 'CHECK_IN_QR', details: 'Scanned QR and checked into Pool Lanes', ipAddress: '157.44.2.110' },
  { id: 'l3', timestamp: '2026-06-25 08:15:00', actor: 'Admin (Commander Digvijay)', action: 'UPDATE_HOLIDAY', details: 'Scheduled filter replacement from July 1st - 3rd', ipAddress: '192.168.1.4' },
  { id: 'l4', timestamp: '2026-06-24 14:02:55', actor: 'm1 (Aarav Patel)', action: 'REGISTER_EVENT', details: 'Registered for Monsoon Swim Gala Relay', ipAddress: '122.180.4.12' }
];

export const DEFAULT_SETTINGS: SystemSettings = {
  poolName: 'Baroda Swimfront',
  contactEmail: 'support@swimfront.com',
  contactPhone: '+91 90000 90000',
  address: 'Akota Gardens, Near Alkapuri, Vadodara, Gujarat - 390007',
  capacityLimit: 120,
  monthlyFee: 60,
  maintenanceSchedule: 'First Wednesday of every Quarter',
  offlineMode: false
};
