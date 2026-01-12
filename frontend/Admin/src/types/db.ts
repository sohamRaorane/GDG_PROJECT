import { Timestamp } from 'firebase/firestore';

export type UserRole = 'customer' | 'admin' | 'organiser' | 'doctor';

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    role: UserRole;
    phoneNumber?: string;
    photoURL?: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface WorkingHour {
    dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday
    startTime: string; // "09:00"
    endTime: string; // "17:00"
    isAvailable: boolean;
}

export interface DaySchedule {
    day: string;
    enabled: boolean;
    slots: { start: string; end: string }[];
}

export interface BookingRules {
    maxAdvanceBookingDays: number; // e.g., 30 days
    minAdvanceBookingHours: number; // e.g., 2 hours
    requiresManualConfirmation: boolean;
}

// --- Settings Interfaces ---

export interface GeneralSettings {
    platformName: string;
    contactEmail: string;
    timezone: string;
    language: string;
    dateFormat: string;
    currency: string;

}

export interface BookingSettings {
    maxBookingsPerSlot: number;
    slotDurationMinutes: number;
    bookingCutoffHours: number;
    allowSameDayBooking: boolean;
    requiresManualConfirmation: boolean;
    requiresAdvancePayment: boolean;
    advancePaymentPercent: number;
    cancellationWindowHours: number;
    rescheduleAllowed: boolean;
    noShowPenaltyEnabled: boolean;
}

export interface NotificationSettings {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    appointmentReminders: boolean;
    reminderTimingHours: number[]; // e.g. [24, 2]
    criticalAlerts: boolean; // Red Flags / SOS
}

export interface SecuritySettings {
    enable2FA: boolean;
    sessionTimeoutMinutes: number;
    passwordExpiryDays: number;
    ipRestrictionEnabled: boolean;
    auditLoggingEnabled: boolean;
}

export interface SystemSettings {
    maintenanceMode: boolean;
    maintenanceMessage: string;
    automaticBackup: boolean;
    apiRateLimitPerHour: number;
    dataRetentionDays: number;
}


export interface IntakeFormField {
    id: string;
    type: "text" | "textarea" | "select" | "checkbox";
    label: string;
    required: boolean;
    options?: string[];
}

export interface Service {
    id: string;
    name: string;
    description: string;
    durationMinutes: number;
    price: number;
    currency: string;
    isActive: boolean;
    providerId: string; // The organiser/admin who offers this service
    workingHours: WorkingHour[];
    bookingRules: BookingRules;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    prePrecautions?: string;
    postPrecautions?: string;
}

export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: 'pre' | 'post';
    appointmentId: string;
    isRead: boolean;
    createdAt: Timestamp;
}


export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show';

export interface Appointment {
    id: string;
    customerId: string;
    customerName: string;
    customerEmail: string;
    serviceId: string;
    serviceName: string;
    providerId: string;
    startAt: Timestamp;
    endAt: Timestamp;
    status: AppointmentStatus;
    roomId?: string;
    notes?: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface DailyTask {
    id: string;
    userId: string;
    date: string; // YYYY-MM-DD
    title: string; // "Drink hot water"
    isCompleted: boolean;
    category?: 'diet' | 'activity' | 'sleep' | 'medication';
    createdAt: Timestamp;
}

export interface DailyHealthLog {
    id: string;
    userId: string;
    date: string; // YYYY-MM-DD
    painLevel: number; // 1-10
    appetiteLevel: number; // 1-10
    sleepQuality: number; // 1-10
    digestionQuality?: 'Poor' | 'Moderate' | 'Excellent';
    mentalState?: 'Agitated' | 'Calm' | 'Lethargic';
    notes?: string;
    isFlagged?: boolean;
    flaggedReason?: string;
    userName?: string;
    createdAt: Timestamp;
}

export interface TherapyLog {
    date: string; // "2024-01-01" or "day_1" key
    painLevel: number | null;
    status: 'Pending' | 'In_Progress' | 'Done';
    notes: string;
}

export interface ActiveTherapy {
    id: string; // document ID
    patientId: string;
    therapyName: string;
    startDate: string; // "YYYY-MM-DD"
    totalDays: number;
    status: 'IN_PROGRESS' | 'PAUSED' | 'COMPLETED';
    currentDay: number;
    logs: Record<string, TherapyLog>; // Keyed by "day_1", "day_2", etc.
    timeline?: {
        day: number;
        title: string;
        subTitle: string;
        description: string;
    }[];
}
