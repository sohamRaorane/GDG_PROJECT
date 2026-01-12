import { db } from '../firebase';
import { doc, runTransaction, collection, Timestamp, addDoc, getDoc, query, where, getDocs, writeBatch } from 'firebase/firestore';
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
        intakeValues?: Record<string, any>;
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
                endAt: Timestamp.fromDate(endDateTime),
                status: 'confirmed',
                intakeValues: params.intakeValues,
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
            const svcRef = doc(db, 'services', params.serviceId);
            const svcSnap = await getDoc(svcRef);
            if (svcSnap.exists()) {
                const svc = svcSnap.data() as Service;
                if (svc.prePrecautions) {
                    await createNotification({
                        userId: params.customerId,
                        title: `Pre-treatment Precautions: ${params.serviceName}`,
                        message: svc.prePrecautions,
                        type: 'pre',
                        appointmentId: 'multi-day',
                        isRead: false,
                        createdAt: Timestamp.now()
                    });
                }
            }
        } catch (notifierErr) {
            console.error("Failed to trigger pre-notification", notifierErr);
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

export const rescheduleAppointment = async (
    appointmentId: string,
    newDate: string,
    newTime: string,
    doctorId: string,
    roomId: string,
    serviceId: string
): Promise<string> => {
    // 1. Check Availability
    const slotId = `${doctorId}_${roomId}_${newDate}_${newTime}`;
    const slotTickRef = doc(db, 'slots', slotId);
    const slotSnap = await getDoc(slotTickRef);
    if (slotSnap.exists()) {
        throw new Error(`Time slot ${newTime} is already booked.`);
    }

    // 2. Get Old Slots
    const qSlots = query(collection(db, 'slots'), where('appointmentId', '==', appointmentId));
    const oldSlotsSnap = await getDocs(qSlots);

    // 3. Write Batch
    const batch = writeBatch(db);

    // Delete old
    oldSlotsSnap.docs.forEach(d => {
        batch.delete(d.ref);
    });

    // Create new
    const newSlot: Slot = {
        id: slotId,
        doctorId: doctorId,
        roomId: roomId,
        date: newDate,
        time: newTime,
        serviceId: serviceId,
        appointmentId: appointmentId,
        lockedAt: Timestamp.now()
    };
    batch.set(slotTickRef, newSlot);

    // Update Appointment
    const aptRef = doc(db, 'appointments', appointmentId);
    const startDateTime = new Date(`${newDate}T${newTime}`);
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 60 min default

    batch.update(aptRef, {
        startAt: Timestamp.fromDate(startDateTime),
        endAt: Timestamp.fromDate(endDateTime),
        roomId: roomId,
        updatedAt: Timestamp.now(),
        status: 'rescheduled'
    });

    await batch.commit();

    // Trigger Notification (Mock)
    console.log(`[MOCK EMAIL] Appointment Rescheduled for ${appointmentId}. New Date: ${newDate}, Time: ${newTime}`);

    return "Rescheduled Successfully";
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
