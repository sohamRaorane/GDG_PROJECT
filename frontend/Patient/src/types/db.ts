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

export interface BookingRules {
    maxAdvanceBookingDays: number; // e.g., 30 days
    minAdvanceBookingHours: number; // e.g., 2 hours
    requiresManualConfirmation: boolean;
}

export interface Service {
    id: string;
    name: string;
    description: string;
    durationMinutes: number;
    durationDays?: number; // Default 1 if undefined
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
    // UI specific fields (optional for now to allow seamless transition)
    type?: 'Free' | 'Paid';
    users?: string[];
    location?: string;
    resources?: string[];
    intro?: string;
    imageColor?: string;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show';

export interface TreatmentRoom {
    id: string;
    name: string; // "Dhanvantari Room"
    supportedTherapies: string[]; // ["Abhyanga", "Shirodhara"]
    capacity: number;
    isActive: boolean;
}

export interface Slot {
    id: string; // Format: "doctorId_roomId_date_time"
    doctorId: string;
    roomId: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:MM
    serviceId: string;
    appointmentId: string; // Link to parent appointment
    lockedAt: Timestamp;
}

export interface Appointment {
    id: string;
    customerId: string;
    customerName: string;
    customerEmail: string;
    serviceId: string;
    serviceName: string;
    providerId: string;
    roomId?: string; // Assigned Room
    startAt: Timestamp;
    endAt: Timestamp;
    status: AppointmentStatus;
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
    createdAt: Timestamp;
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

export interface TherapyLog {
    painLevel: number;
    status: string;
    notes?: string;
    [key: string]: any;
}

export interface ActiveTherapy {
    id: string;
    patientId: string;
    therapyName: string;
    startDate: string;
    currentDay: number;
    status: string;
    logs: Record<string, TherapyLog>;
}

export interface CommunityChannel {
    id: string;
    name: string;
    description: string;
    icon: string; // lucide icon name or emoji
    participantCount?: number;
}

export interface CommunityPost {
    id: string;
    channelId: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    content: string;
    createdAt: Timestamp;
    likes: number;
}

export interface CommunityMember {
    id: string; // composite: channelId_userId
    channelId: string;
    userId: string;
    joinedAt: Timestamp;
}
