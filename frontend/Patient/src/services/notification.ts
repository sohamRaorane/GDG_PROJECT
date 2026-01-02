import { db } from '../firebase';
import { collection, query, where, getDocs, updateDoc, doc, onSnapshot } from 'firebase/firestore';
import type { Notification } from '../types/db';

const notificationsCollection = collection(db, 'notifications');

export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
    const q = query(
        notificationsCollection,
        where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
    return notifications.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
};

export const subscribeToNotifications = (userId: string, callback: (notifications: Notification[]) => void) => {
    const q = query(
        notificationsCollection,
        where('userId', '==', userId)
    );

    return onSnapshot(q, (snapshot) => {
        const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
        const sorted = notifications.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
        callback(sorted);
    }, (error) => {
        console.error("Notification subscription failed:", error);
    });
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
    const docRef = doc(db, 'notifications', notificationId);
    await updateDoc(docRef, { isRead: true });
};
