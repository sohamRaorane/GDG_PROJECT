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
    writeBatch,
    query,
    where,
    onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase';
import type { UserProfile, Service, Appointment, Notification } from '../types/db';

export interface CommunityChannel {
    id: string;
    name: string;
    description: string;
    icon: string;
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

export const createUser = async (userData: Omit<UserProfile, 'uid' | 'createdAt' | 'updatedAt' | 'photoURL' | 'phoneNumber'>): Promise<string> => {
    const docRef = await addDoc(usersCollection, {
        ...userData,
        uid: '', // Placeholder, will be updated with doc id
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
    } as UserProfile);

    // Update the doc with its own ID as uid, which is a common pattern when not using Auth UIDs
    await updateDoc(docRef, { uid: docRef.id });
    return docRef.id;
};

export const deleteUser = async (uid: string): Promise<void> => {
    const docRef = doc(usersCollection, uid);
    await deleteDoc(docRef);
};

export const updateUserRole = async (uid: string, role: string): Promise<void> => {
    const docRef = doc(usersCollection, uid);
    await updateDoc(docRef, { role, updatedAt: Timestamp.now() });
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

// --- Settings Management ---

export const settingsCollection = collection(db, 'settings');

export const saveGlobalSchedule = async (schedule: any[]): Promise<void> => {
    // We use a fixed ID 'global_availability' for this singleton setting
    const docRef = doc(settingsCollection, 'global_availability');
    // Using set with merge: true or just set to overwrite
    await updateDoc(docRef, { schedule, updatedAt: Timestamp.now() }).catch(async (err) => {
        // If doc doesn't exist, create it (updateDoc fails if doc missing)
        // using setDoc would be cleaner but imported as setDoc would change imports. 
        // Let's us setDoc (which is effectively set on collection reference with ID)
        // Actually, let's use setDoc if I imported it, but I didn't. 
        // I'll add setDoc to imports or just use existing tools.
        // Wait, I can't easily change imports in this block. 
        // Fallback: try create if update fails? No, specific ID requires setDoc logic.
        // Let's assume standard updateDoc pattern or use setDoc if I add import.
        // Re-checking imports: addDoc, updateDoc, deleteDoc, getDoc... NO setDoc.
        // I will use a work-around: getDoc first, if matches, update, else set (requires setDoc).
        // I will add setDoc to the imports in a separate edit or just use setDoc if it was imported (it wasn't).
        // Let's use a wrapper or just add it to imports in a separate step? 
        // Actually, I can allow writeBatch to do it? batch.set() works with doc ref.
        const batch = writeBatch(db);
        batch.set(docRef, { schedule, updatedAt: Timestamp.now() });
        await batch.commit();
    });
};

export const getGlobalSchedule = async (): Promise<any[] | null> => {
    const docRef = doc(settingsCollection, 'global_availability');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
        return snap.data().schedule;
    }
    return null;
};

export const saveBookingSettings = async (settings: any): Promise<void> => {
    const docRef = doc(settingsCollection, 'booking_conf');
    const batch = writeBatch(db);
    batch.set(docRef, { settings, updatedAt: Timestamp.now() });
    await batch.commit();
};

export const getBookingSettings = async (): Promise<any | null> => {
    const docRef = doc(settingsCollection, 'booking_conf');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
        return snap.data().settings;
    }
    return null;
};

export const saveIntakeForm = async (fields: any[]): Promise<void> => {
    const docRef = doc(settingsCollection, 'intake_form');
    const batch = writeBatch(db);
    batch.set(docRef, { fields, updatedAt: Timestamp.now() });
    await batch.commit();
};

export const getIntakeForm = async (): Promise<any[] | null> => {
    const docRef = doc(settingsCollection, 'intake_form');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
        return snap.data().fields;
    }
    return null;
};

// --- Community Management ---

export const channelsCollection = collection(db, 'community_channels').withConverter(converter<CommunityChannel>());
export const postsCollection = collection(db, 'community_posts').withConverter(converter<CommunityPost>());

export const getChannels = async (): Promise<CommunityChannel[]> => {
    const snapshot = await getDocs(channelsCollection);
    return snapshot.docs.map(doc => doc.data());
};

export const getChannelPosts = async (channelId: string): Promise<CommunityPost[]> => {
    const q = query(postsCollection, where('channelId', '==', channelId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data()).sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis());
};

export const subscribeToChannelPosts = (channelId: string, callback: (posts: CommunityPost[]) => void) => {
    const q = query(postsCollection, where('channelId', '==', channelId));
    return onSnapshot(q, (snapshot) => {
        const posts = snapshot.docs
            .map(doc => doc.data())
            .sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis());
        callback(posts);
    });
};
