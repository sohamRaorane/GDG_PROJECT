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
    type SnapshotOptions,
    onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase';
import type { UserProfile, Service, Appointment, DailyTask, DailyHealthLog, CommunityChannel, CommunityPost, CommunityMember } from '../types/db';

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
export const channelsCollection = collection(db, 'community_channels').withConverter(converter<CommunityChannel>());
export const postsCollection = collection(db, 'community_posts').withConverter(converter<CommunityPost>());
export const membersCollection = collection(db, 'community_members').withConverter(converter<CommunityMember>());

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

    // Auto-join community channel logic
    try {
        const channels = await getChannels();
        // Simple matching logic: find a channel with same name as service or 'General'
        const targetChannel = channels.find(c => c.name.toLowerCase() === appointment.serviceName.toLowerCase())
            || channels.find(c => c.id === 'general');

        if (targetChannel) {
            await joinChannel(targetChannel.id, appointment.customerId);
            console.log(`Auto-joined user ${appointment.customerId} to channel ${targetChannel.name}`);
        }
    } catch (err) {
        console.error("Failed to auto-join channel:", err);
        // Don't fail the appointment creation if this fails
    }

    // Active Therapy creation is now handled by the backend Cloud Function 'onAppointmentCreated'

    return docRef.id;
};

export const getMyAppointments = async (userId: string): Promise<Appointment[]> => {
    const q = query(appointmentsCollection, where('customerId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
};

export const cancelAppointment = async (appointmentId: string): Promise<void> => {
    const docRef = doc(appointmentsCollection, appointmentId);
    const snap = await getDoc(docRef);

    await updateDoc(docRef, {
        status: 'cancelled',
        updatedAt: Timestamp.now()
    });

    if (snap.exists()) {
        const data = snap.data() as Appointment;
        // Trigger Email Notification (mocked)
        console.log(`[MOCK EMAIL] Appointment Cancelled for ${data.customerEmail}. Service: ${data.serviceName}`);
    }
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

// --- Community Services ---

export const getChannels = async (): Promise<CommunityChannel[]> => {
    const snapshot = await getDocs(channelsCollection);
    const channels = snapshot.docs.map(doc => doc.data());

    // If no channels exist, seed a few default ones
    if (channels.length === 0) {
        const defaults = [
            { id: 'general', name: 'General Wellness', description: 'Share your wellness journey with others.', icon: 'Users' },
            { id: 'panchakarma', name: 'Panchakarma Support', description: 'Discussions for those undergoing detox.', icon: 'Sparkles' },
            { id: 'diet', name: 'Ayurvedic Diet', description: 'Recipes, tips, and diet questions.', icon: 'Utensils' },
            { id: 'yoga', name: 'Yoga & Meditation', description: 'Daily practices and mindfulness.', icon: 'Sun' }
        ];

        for (const c of defaults) {
            await setDoc(doc(channelsCollection, c.id), c);
        }
        return defaults as CommunityChannel[];
    }

    return channels;
};

export const getChannelPosts = async (channelId: string): Promise<CommunityPost[]> => {
    const q = query(postsCollection, where('channelId', '==', channelId)); // orderBy needs index, doing client sort for now
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

export const createPost = async (post: Omit<CommunityPost, 'id'>): Promise<string> => {
    const docRef = await addDoc(postsCollection, post as CommunityPost);
    return docRef.id;
};

export const joinChannel = async (channelId: string, userId: string): Promise<void> => {
    const memberId = `${channelId}_${userId}`;
    const memberRef = doc(membersCollection, memberId);

    await setDoc(memberRef, {
        id: memberId,
        channelId,
        userId,
        joinedAt: Timestamp.now()
    });
};

export const isChannelMember = async (channelId: string, userId: string): Promise<boolean> => {
    const memberId = `${channelId}_${userId}`;
    const snap = await getDoc(doc(membersCollection, memberId));
    return snap.exists();
};

// --- Settings Management ---

export const settingsCollection = collection(db, 'settings');

export const getIntakeForm = async (): Promise<any[] | null> => {
    const docRef = doc(settingsCollection, 'intake_form');
    console.log("Fetching intake form from", docRef.path);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
        console.log("Intake form found:", snap.data());
        return snap.data().fields;
    }
    console.log("Intake form not found");
    return null;
};

export const getBookingSettings = async (): Promise<any | null> => {
    const docRef = doc(settingsCollection, 'booking_conf');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
        return snap.data().settings;
    }
    return null;
};
