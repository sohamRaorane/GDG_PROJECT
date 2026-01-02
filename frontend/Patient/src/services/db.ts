import {
    collection,
    doc,
    getDoc,
    setDoc,
    getDocs,
    query,
    where,
    addDoc,
    updateDoc,
    Timestamp,
    type DocumentData,
    type QueryDocumentSnapshot,
    type SnapshotOptions
} from 'firebase/firestore';
import { db } from '../firebase';
import type { UserProfile, Service, Appointment, DailyTask, DailyHealthLog } from '../types/db';

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

// --- User Services ---

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    const userDocP = doc(usersCollection, uid);
    const userSnap = await getDoc(userDocP);
    return userSnap.exists() ? userSnap.data() : null;
};

export const createUserProfile = async (user: UserProfile): Promise<void> => {
    const userDocP = doc(usersCollection, user.uid);
    await setDoc(userDocP, user, { merge: true });
};

// --- Service Services ---

export const getAllServices = async (): Promise<Service[]> => {
    const q = query(servicesCollection, where('isActive', '==', true));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
};

export const getServiceById = async (id: string): Promise<Service | null> => {
    console.log("DEBUG: getServiceById called with ID:", id);
    try {
        const docRef = doc(servicesCollection, id);
        const snap = await getDoc(docRef);
        console.log("DEBUG: getServiceById snapshot exists:", snap.exists());
        return snap.exists() ? snap.data() : null;
    } catch (error) {
        console.error("DEBUG: getServiceById Error:", error);
        throw error;
    }
};

// --- Appointment Services ---

export const createAppointment = async (appointment: Omit<Appointment, 'id'>): Promise<string> => {
    const docRef = await addDoc(appointmentsCollection, appointment as Appointment);
    return docRef.id;
};

export const getMyAppointments = async (userId: string): Promise<Appointment[]> => {
    const q = query(appointmentsCollection, where('customerId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
};

export const cancelAppointment = async (appointmentId: string): Promise<void> => {
    const docRef = doc(appointmentsCollection, appointmentId);
    await updateDoc(docRef, {
        status: 'cancelled',
        updatedAt: Timestamp.now()
    });
};

// --- Daily Task Services ---

export const usersTasksCollection = collection(db, 'daily_tasks').withConverter(converter<DailyTask>());

export const getDailyTasks = async (userId: string, date: string): Promise<DailyTask[]> => {
    const q = query(
        usersTasksCollection,
        where('userId', '==', userId),
        where('date', '==', date)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
};

export const createDailyTask = async (task: Omit<DailyTask, 'id'>): Promise<string> => {
    const docRef = await addDoc(usersTasksCollection, task as DailyTask);
    return docRef.id;
};

export const toggleTaskStatus = async (taskId: string, isCompleted: boolean): Promise<void> => {
    const docRef = doc(usersTasksCollection, taskId);
    await updateDoc(docRef, { isCompleted });
};

// Seed function for demo (if no tasks exist)
export const seedDailyTasks = async (userId: string, date: string) => {
    const existing = await getDailyTasks(userId, date);
    if (existing.length === 0) {
        const tasks = [
            { title: 'Drink warm water (500ml)', category: 'diet' },
            { title: 'Morning Yoga / Stretching', category: 'activity' },
            { title: 'Take Herbal Supplements', category: 'medication' },
            { title: 'Avoid day sleep', category: 'sleep' },
            { title: 'Reading / Meditation', category: 'activity' }
        ];

        for (const t of tasks) {
            await createDailyTask({
                userId,
                date,
                title: t.title,
                isCompleted: false,
                category: t.category as any,
                createdAt: Timestamp.now()
            });
        }
        return await getDailyTasks(userId, date);
    }
    return existing;
};

// --- Daily Health Log Services ---

export const healthLogsCollection = collection(db, 'health_logs').withConverter(converter<DailyHealthLog>());

export const getHealthLogs = async (userId: string): Promise<DailyHealthLog[]> => {
    const q = query(healthLogsCollection, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    // Sort by date manually if needed, or use orderBy if index exists
    return snapshot.docs.map(doc => doc.data()).sort((a, b) => a.date.localeCompare(b.date));
};

export const createHealthLog = async (log: Omit<DailyHealthLog, 'id'>): Promise<string> => {
    const docRef = await addDoc(healthLogsCollection, log as DailyHealthLog);
    return docRef.id;
};
