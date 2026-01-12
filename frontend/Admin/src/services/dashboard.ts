import { collection, query, where, onSnapshot, doc, updateDoc, writeBatch, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { DailyHealthLog } from '../types/db';

export const subscribeToRedFlags = (callback: (flags: DailyHealthLog[]) => void) => {
    // Query for all flagged logs. In production, you might restrict this to 'today' or 'unresolved' status.
    const q = query(
        collection(db, 'health_logs'),
        where('isFlagged', '==', true)
    );

    return onSnapshot(q, (snapshot) => {
        const flags = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                // Ensure timestamp is converted if needed or handled by UI
            };
        }) as DailyHealthLog[];

        // Sort client-side to avoid "index required" errors during dev
        // Newest first
        flags.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());

        callback(flags);
    });
};

export const resolveRedFlag = async (id: string) => {
    // Determine if we should delete or just unflag. 
    // Since these are "test" data the user wants removed, deleting or unflagging works.
    // Unflagging preserves the log but removes it from the "Active" list.
    const docRef = doc(db, 'health_logs', id);
    await updateDoc(docRef, {
        isFlagged: false,
        flaggedReason: null
    });
};

export const clearAllRedFlags = async () => {
    const q = query(
        collection(db, 'health_logs'),
        where('isFlagged', '==', true)
    );
    const snapshot = await getDocs(q);
    const batch = writeBatch(db);

    snapshot.docs.forEach((doc) => {
        batch.update(doc.ref, { isFlagged: false, flaggedReason: null });
    });

    await batch.commit();
};
