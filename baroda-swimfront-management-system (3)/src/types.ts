export type UserRole = 'admin' | 'member';
export type UserStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  phone: string;
  joinDate: string;
  photoUrl?: string;
  planId?: string; // e.g. 'quarterly'
  membershipStart?: string;
  membershipExpiry?: string;
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  medicalInformation: string;
  attendanceCount: number;
  lastVisit?: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  durationMonths: number;
  price: number;
  features: string[];
  color: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  date: string; // YYYY-MM-DD
  checkInTime: string;
  checkOutTime?: string;
  status: 'Present' | 'Absent' | 'Excused';
}

export interface PoolEvent {
  id: string;
  title: string;
  type: 'competition' | 'camp' | 'special_session' | 'training';
  date: string;
  time: string;
  description: string;
  registrationDeadline: string;
  maxCapacity: number;
  registeredCount: number;
  status: 'open' | 'closed' | 'completed';
}

export interface PoolHoliday {
  id: string;
  title: string;
  type: 'maintenance' | 'festival' | 'national' | 'weather';
  startDate: string;
  endDate: string;
  description: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'membership' | 'event' | 'holiday' | 'system';
  read: boolean;
  userId?: string; // undefined means global notification
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  details: string;
  ipAddress: string;
}

export interface SystemSettings {
  poolName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  capacityLimit: number;
  monthlyFee: number;
  maintenanceSchedule: string;
  offlineMode: boolean;
}
