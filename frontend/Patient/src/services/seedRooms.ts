import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import type { TreatmentRoom } from '../types/db';

export const seedTreatmentRooms = async () => {
    const rooms: TreatmentRoom[] = [
        {
            id: 'room-dhanvantari',
            name: 'Dhanvantari Hall',
            supportedTherapies: ['Abhyanga', 'Shirodhara', 'Panchakarma', 'All'],
            capacity: 1,
            isActive: true
        },
        {
            id: 'room-sushruta',
            name: 'Sushruta Chamber',
            supportedTherapies: ['Consultation', 'Rejuvenation'],
            capacity: 1,
            isActive: true
        },
        {
            id: 'room-vagbhata',
            name: 'Vagbhata Suite',
            supportedTherapies: ['Steam', 'Abhyanga'],
            capacity: 1,
            isActive: true
        }
    ];

    try {
        for (const room of rooms) {
            await setDoc(doc(db, 'rooms', room.id), room, { merge: true });
        }
        console.log("Treatment Rooms Seeded Successfully!");
        return true;
    } catch (error) {
        console.error("Error seeding rooms:", error);
        return false;
    }
};
