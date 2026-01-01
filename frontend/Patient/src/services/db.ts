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
import type { UserProfile, Service, Appointment } from '../types/db';

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
