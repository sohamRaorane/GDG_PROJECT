import { db } from '../firebase';
import type { TreatmentRoom, Service } from '../types/db';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

const TIME_SLOTS = [
    "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"
];

// Helper: Check if a specific slot is booked in the 'slots' collection
const isSlotBooked = async (resourceId: string, date: string, time: string): Promise<boolean> => {
    // We strictly check the 'slots' collection for existence
    // ID format: doctorId_roomId_date_time -> This is too specific.
    // We need to query: "Is there ANY slot document where (doctorId == X OR roomId == X) AND date == Y AND time == Z?"

    // Actually, our 'slots' IDs are specific: "resourceId_date_time" won't work significantly if we mix ID types.
    // Better Strategy:
    // Slot Document ID: `${resourceId}_${date}_${time}`
    // We create TWO slot documents per booking? One for Doctor, One for Room?
    // OR, we query the 'slots' collection where `doctorId == X` OR `roomId == X`.

    const slotsRef = collection(db, 'slots');

    // Check Room Availability

    const qRoom = query(
        slotsRef,
        where('date', '==', date),
        where('time', '==', time),
        where('roomId', '==', resourceId)
    );
    const snapRoom = await getDocs(qRoom);
    if (!snapRoom.empty) return true;

    const qDoc = query(
        slotsRef,
        where('date', '==', date),
        where('time', '==', time),
        where('doctorId', '==', resourceId)
    );
    const snapDoc = await getDocs(qDoc);
    return !snapDoc.empty;
};

import { getBookingSettings } from './db';

export const getAvailableSlotsForService = async (
    serviceId: string,
    date: string,
    preferredDoctorId?: string
): Promise<{ time: string; availableRoomId: string; availableDoctorId: string }[]> => {
    console.log(`[Scheduling] Fetching slots for Service:${serviceId} on Date:${date} (Doc:${preferredDoctorId})`);

    // 0. Check Booking Rules (Cut-off Time)
    const settings = await getBookingSettings();

    // 1. Get Service Details to know compatible rooms
    const serviceDoc = await getDoc(doc(db, 'services', serviceId));
    if (!serviceDoc.exists()) {
        console.error("[Scheduling] Service not found:", serviceId);
        return [];
    }
    const service = serviceDoc.data() as Service;

    // 2. Get All Active Rooms confirming to Service
    const roomsRef = collection(db, 'rooms');
    const roomsSnap = await getDocs(query(roomsRef, where('isActive', '==', true)));
    console.log(`[Scheduling] Found ${roomsSnap.size} active rooms in DB`);

    const compatibleRooms = roomsSnap.docs
        .map(d => ({ ...d.data(), id: d.id } as TreatmentRoom))
        .filter(r =>
            r.supportedTherapies.includes('All') ||
            r.supportedTherapies.includes(service.name) ||
            r.supportedTherapies.some(st => service.name.toLowerCase().includes(st.toLowerCase()))
        );

    console.log(`[Scheduling] Compatible rooms for "${service.name}":`, compatibleRooms.length);

    if (compatibleRooms.length === 0) {
        console.warn("[Scheduling] No compatible rooms found for service:", service.name);
        return [];
    }

    // 3. Determine the doctor to check availability for
    const doctorId = preferredDoctorId || service.providerId;
    console.log(`[Scheduling] Checking availability for Doctor:${doctorId}`);

    // 4. Check Availability for each Time Slot
    const availableSlots = [];
    const cutoffHours = settings?.cutoffTime ? parseInt(settings.cutoffTime) : 0;
    const now = new Date();

    for (const time of TIME_SLOTS) {
        // Cut-off Check
        if (cutoffHours > 0) {
            const slotDateTime = new Date(`${date}T${time}`);
            const diffInHours = (slotDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

            if (diffInHours < cutoffHours) {
                console.log(`[Scheduling] Slot ${time} filtered due to cutoff rule (${cutoffHours}h required)`);
                continue;
            }
        }

        // A. Check Doctor Availability
        const isDoctorBooked = await isSlotBooked(doctorId, date, time);
        if (isDoctorBooked) {
            console.log(`[Scheduling] Slot ${time}: Doctor ${doctorId} is booked`);
            continue;
        }

        // B. Find *First* Available Room
        let bestRoomId = null;
        for (const room of compatibleRooms) {
            const isRoomBooked = await isSlotBooked(room.id, date, time);
            if (!isRoomBooked) {
                bestRoomId = room.id;
                break; // Found a room!
            } else {
                console.log(`[Scheduling] Slot ${time}: Room ${room.id} is booked`);
            }
        }

        if (bestRoomId) {
            availableSlots.push({
                time,
                availableRoomId: bestRoomId,
                availableDoctorId: doctorId
            });
        }
    }

    console.log(`[Scheduling] Complete. Found ${availableSlots.length} available slots.`);
    return availableSlots;
};
