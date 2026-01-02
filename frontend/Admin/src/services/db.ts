import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    Timestamp,
    type DocumentData,
    type QueryDocumentSnapshot,
    type SnapshotOptions,
    writeBatch
} from 'firebase/firestore';
import { db } from '../firebase';
import type { UserProfile, Service, Appointment, Notification } from '../types/db';

// Firestore Data Converter
const converter = <T>() => ({
    toFirestore: (data: T) => data as DocumentData,
    fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions) => {
        const data = snapshot.data(options);
        return { id: snapshot.id, ...data } as T;
    }
});

// Collections
export const usersCollection = collection(db, 'users').withConverter(converter<UserProfile>());
export const servicesCollection = collection(db, 'services').withConverter(converter<Service>());
export const appointmentsCollection = collection(db, 'appointments').withConverter(converter<Appointment>());
export const notificationsCollection = collection(db, 'notifications').withConverter(converter<Notification>());

// --- User Services ---

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    const userDocP = doc(usersCollection, uid);
    const userSnap = await getDoc(userDocP);
    return userSnap.exists() ? userSnap.data() : null;
};

export const getAllUsers = async (): Promise<UserProfile[]> => {
    console.log("Fetching users from 'users' collection...");
    const snapshot = await getDocs(usersCollection);
    console.log("Snapshot size:", snapshot.size);
    const users = snapshot.docs.map(doc => doc.data());
    console.log("Mapped users:", users);
    return users;
};

// --- Service Management ---

export const getAllServices = async (): Promise<Service[]> => {
    const snapshot = await getDocs(servicesCollection);
    return snapshot.docs.map(doc => doc.data());
};

export const createService = async (service: Omit<Service, 'id'>): Promise<string> => {
    const docRef = await addDoc(servicesCollection, service as Service);
    return docRef.id;
};

export const updateService = async (id: string, data: Partial<Service>): Promise<void> => {
    const docRef = doc(servicesCollection, id);
    await updateDoc(docRef, { ...data, updatedAt: Timestamp.now() });
};

export const deleteService = async (id: string): Promise<void> => {
    const docRef = doc(servicesCollection, id);
    await deleteDoc(docRef);
};

// --- Appointment Management ---

export const getAllAppointments = async (): Promise<Appointment[]> => {
    const snapshot = await getDocs(appointmentsCollection);
    return snapshot.docs.map(doc => doc.data());
};

export const updateAppointmentStatus = async (id: string, status: Appointment['status']): Promise<void> => {
    const docRef = doc(appointmentsCollection, id);
    await updateDoc(docRef, {
        status,
        updatedAt: Timestamp.now()
    });

    if (status === 'completed') {
        const apptSnap = await getDoc(docRef);
        if (apptSnap.exists()) {
            const appt = apptSnap.data();
            const svcSnap = await getDoc(doc(db, 'services', appt.serviceId));
            if (svcSnap.exists()) {
                const svc = svcSnap.data() as Service;
                if (svc.postPrecautions) {
                    await createNotification({
                        userId: appt.customerId,
                        title: `Post-treatment Precautions: ${appt.serviceName}`,
                        message: svc.postPrecautions,
                        type: 'post',
                        appointmentId: id,
                        isRead: false,
                        createdAt: Timestamp.now()
                    });
                }
            }
        }
    }
};

export const createNotification = async (notification: Omit<Notification, 'id'>): Promise<string> => {
    const docRef = await addDoc(notificationsCollection, notification as Notification);
    return docRef.id;
};

export const createAppointmentBatch = async (appointments: Omit<Appointment, 'id'>[]): Promise<void> => {
    const batch = writeBatch(db);

    appointments.forEach(appt => {
        const docRef = doc(appointmentsCollection);
        batch.set(docRef, appt);
    });

    await batch.commit();
};

export const checkConflicts = async (startDate: string, days: number, startTime: string): Promise<{ date: string, conflict: boolean }[]> => {
    // Ideally this should be a cloud function or complex query. 
    // For now, client-side check against fetched appointments is simpler for prototype.
    const allAppointments = await getAllAppointments();
    const conflicts = [];

    let currentDate = new Date(startDate);

    for (let i = 0; i < days; i++) {
        const dateStr = currentDate.toISOString().split('T')[0];
        // Check if any appointment starts at the same time on this day
        // This is a basic check. Real-world would check duration overlaps.
        const hasConflict = allAppointments.some(appt => {
            const apptDate = appt.startAt.toDate().toISOString().split('T')[0];
            const apptTime = appt.startAt.toDate().toTimeString().substring(0, 5);
            return apptDate === dateStr && apptTime === startTime && appt.status !== 'cancelled';
        });

        if (hasConflict) {
            conflicts.push({ date: dateStr, conflict: true });
        }

        currentDate.setDate(currentDate.getDate() + 1);
    }

    return conflicts;
};
