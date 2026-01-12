import { db } from '../firebase';
import { doc, runTransaction, collection, Timestamp, addDoc, getDoc } from 'firebase/firestore';
import type { Appointment, Slot, Notification, Service } from '../types/db';

export const bookMultiDayAppointment = async (
    params: {
        customerId: string;
        customerName: string;
        customerEmail: string;
        serviceId: string;
        serviceName: string;
        providerId: string;
        roomId: string;
        startDate: string; // YYYY-MM-DD
        startTime: string; // HH:MM
        days: number;
        durationMinutes: number;
    }
): Promise<string> => {
    // 1. Generate Required Slot IDs
    const slotsToLock: { id: string, date: string, time: string }[] = [];
    const startObj = new Date(params.startDate);

    for (let i = 0; i < params.days; i++) {
        const currentDate = new Date(startObj);
        currentDate.setDate(startObj.getDate() + i);
        const dateStr = currentDate.toISOString().split('T')[0];

        // ID Format: doctorId_roomId_date_time
        // This ensures uniqueness for critical resources
        const slotId = `${params.providerId}_${params.roomId}_${dateStr}_${params.startTime}`;
        slotsToLock.push({ id: slotId, date: dateStr, time: params.startTime });
    }

    try {
        await runTransaction(db, async (transaction) => {
            // 2. READ: Check all slots availability
            for (const slot of slotsToLock) {
                const slotRef = doc(db, 'slots', slot.id);
                const slotDoc = await transaction.get(slotRef);
                if (slotDoc.exists()) {
                    throw new Error(`Slot conflict on ${slot.date} at ${slot.time}. Please choose another time.`);
                }
            }

            // 3. WRITE: Create Appointment (Parent)
            const appointmentRef = doc(collection(db, 'appointments'));
            const startDateTime = new Date(`${params.startDate}T${params.startTime}`);
            // End Date is (StartDate + Days) ? Or just session duration?
            // Usually appointment record tracks the "First Session" or valid range.
            // Let's store the full range.
            const endDateTime = new Date(startDateTime);
            endDateTime.setDate(endDateTime.getDate() + params.days);

            const newAppointment: Appointment = {
                id: appointmentRef.id,
                customerId: params.customerId,
                customerName: params.customerName,
                customerEmail: params.customerEmail,
                serviceId: params.serviceId,
                serviceName: params.serviceName,
                providerId: params.providerId,
                roomId: params.roomId,
                startAt: Timestamp.fromDate(startDateTime),
                endAt: Timestamp.fromDate(endDateTime), // Represents the full course duration?
                status: 'confirmed',
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            };

            transaction.set(appointmentRef, newAppointment);

            // 4. WRITE: Create Slots (Children)
            for (const slot of slotsToLock) {
                const slotRef = doc(db, 'slots', slot.id);
                const newSlot: Slot = {
                    id: slot.id,
                    doctorId: params.providerId,
                    roomId: params.roomId,
                    date: slot.date,
                    time: slot.time,
                    serviceId: params.serviceId,
                    appointmentId: appointmentRef.id,
                    lockedAt: Timestamp.now()
                };
                transaction.set(slotRef, newSlot);
            }
        });

        // 5. Trigger Notification for Pre-precautions
        try {
            console.log("DEBUG: Triggering notification for serviceId:", params.serviceId);
            const svcRef = doc(db, 'services', params.serviceId);
            const svcSnap = await getDoc(svcRef);
            if (svcSnap.exists()) {
                const svc = svcSnap.data() as Service;
                console.log("DEBUG: Service found. prePrecautions:", svc.prePrecautions);
                if (svc.prePrecautions) {
                    const nid = await createNotification({
                        userId: params.customerId,
                        title: `Pre-treatment Precautions: ${params.serviceName}`,
                        message: svc.prePrecautions,
                        type: 'pre',
                        appointmentId: 'multi-day',
                        isRead: false,
                        createdAt: Timestamp.now()
                    });
                    console.log("DEBUG: Pre-notification created with ID:", nid);
                } else {
                    console.log("DEBUG: No prePrecautions defined for this service.");
                }
            } else {
                console.warn("DEBUG: Service document not found for notification trigger.");
            }
        } catch (notifierErr) {
            console.error("DEBUG: Failed to trigger pre-notification", notifierErr);
        }

        // 6. Active Therapy Creation (Client-Side Fallback)
        try {
            console.log("Creating Active Therapy record client-side...");
            const therapyId = await createActiveTherapyRecord({
                customerId: params.customerId,
                serviceName: params.serviceName,
                startDate: params.startDate,
                durationDays: params.days
            });
            console.log("Active Therapy created with ID:", therapyId);
        } catch (atError) {
            console.error("Failed to create Active Therapy record:", atError);
            // Non-blocking error, booking still succeeds
            // In production, we might want to alert admin or retry
        }

        return "Success";
    } catch (e: any) {
        console.error("Multi-Day Booking Failed:", e);
        throw e;
    }
};

export const createNotification = async (notification: Omit<Notification, 'id'>): Promise<string> => {
    const docRef = await addDoc(collection(db, 'notifications'), notification as Notification);
    return docRef.id;
};

// Client-side helper to create Active Therapy (Replaces Cloud Function)
const createActiveTherapyRecord = async (params: {
    customerId: string;
    serviceName: string;
    startDate: string;
    durationDays: number;
}) => {
    // Generate default timeline
    const timeline = Array.from({ length: params.durationDays }, (_, i) => ({
        day: i + 1,
        title: `Day ${i + 1}`,
        subTitle: i === 0 ? "Preparation Phase" : "Treatment Phase",
        description: "Follow standard daily protocol. Consult your doctor for specific instructions."
    }));

    const docRef = await addDoc(collection(db, 'active_therapies'), {
        patientId: params.customerId,
        therapyName: params.serviceName,
        startDate: params.startDate,
        totalDays: params.durationDays,
        currentDay: 1,
        status: 'IN_PROGRESS',
        logs: {},
        timeline: timeline
    });

    return docRef.id;
};
