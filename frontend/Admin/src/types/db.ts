import { Timestamp } from 'firebase/firestore';

export type UserRole = 'customer' | 'admin' | 'organiser';

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
    price: number;
    currency: string;
    isActive: boolean;
    providerId: string; // The organiser/admin who offers this service
    workingHours: WorkingHour[];
    bookingRules: BookingRules;
    createdAt: Timestamp;
    updatedAt: Timestamp;
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
    notes?: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}
