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

export const getAllUsers = async (): Promise<UserProfile[]> => {
    const snapshot = await getDocs(usersCollection);
    return snapshot.docs.map(doc => doc.data());
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
};
