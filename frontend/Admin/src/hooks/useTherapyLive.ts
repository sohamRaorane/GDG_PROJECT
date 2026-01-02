import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import type { ActiveTherapy } from "../types/db";

export const useTherapyLive = (therapyId: string) => {
    const [data, setData] = useState<ActiveTherapy | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!therapyId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        // 1. Point to the specific document
        const docRef = doc(db, "active_therapies", therapyId);

        // 2. Open the "Socket" (Listener)
        const unsubscribe = onSnapshot(docRef,
            (doc) => {
                // 3. This runs EVERY time the doctor updates the DB
                if (doc.exists()) {
                    setData({ id: doc.id, ...doc.data() } as ActiveTherapy);
                    setError(null);
                } else {
                    setError("Therapy plan not found");
                    setData(null);
                }
                setLoading(false);
            },
            (err) => {
                console.error("Error listening to therapy:", err);
                setError("Failed to connect to live updates");
                setLoading(false);
            }
        );

        // 4. Close the listener when user leaves screen (Important!)
        return () => unsubscribe();
    }, [therapyId]);

    return { data, loading, error };
};
