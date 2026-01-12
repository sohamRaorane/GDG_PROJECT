import drAnjali from '../assets/doctors/dr_anjali.png';
import drRajesh from '../assets/doctors/dr_rajesh.png';
import drPriyanshu from '../assets/doctors/dr_priyanshu.png';

export interface DoctorResource {
    id: string;
    name: string;
    specialization: string;
    experience: string;
    image: string;
    rating: number;
    clinicIds: string[];
}

export const DOCTORS: DoctorResource[] = [
    {
        id: 'dr-sharma',
        name: 'Dr. Anjali Sharma',
        specialization: 'Panchakarma Specialist',
        experience: '12 Years',
        image: drAnjali,
        rating: 4.8,
        clinicIds: ['1', '2'] // Available at AyurSutra and Prakriti
    },
    {
        id: 'dr-verma',
        name: 'Dr. Rajesh Verma',
        specialization: 'Ayurvedic Medicine',
        experience: '20 Years',
        image: drRajesh,
        rating: 4.9,
        clinicIds: ['1', '3', '5'] // AyurSutra, Dhanvantari, Sushruta
    },
    {
        id: 'dr-gupta',
        name: 'Dr. Priyanshu Gupta',
        specialization: 'Nadi Pariksha Expert',
        experience: '8 Years',
        image: drPriyanshu,
        rating: 4.6,
        clinicIds: ['2', '4'] // Prakriti and VedaLife
    },
    {
        id: 'dr-iyer',
        name: 'Dr. Vikram Iyer',
        specialization: 'Kayachikitsa (General Medicine)',
        experience: '15 Years',
        image: drRajesh, // Placeholder
        rating: 4.7,
        clinicIds: ['1', '3']
    },
    {
        id: 'dr-mehta',
        name: 'Dr. Sunita Mehta',
        specialization: 'Stri Roga (Gynecology)',
        experience: '10 Years',
        image: drAnjali, // Placeholder
        rating: 4.9,
        clinicIds: ['2', '5']
    },
    {
        id: 'dr-singh',
        name: 'Dr. Aryan Singh',
        specialization: 'Shalya Tantra (Surgery)',
        experience: '18 Years',
        image: drRajesh, // Placeholder
        rating: 4.8,
        clinicIds: ['4']
    },
];

export const getDoctorName = (id: string): string => {
    // Check if ID matches a doctor or is generic 'admin'
    if (id === 'admin') return 'Dr. Anjali Gupta';

    const doc = DOCTORS.find(d => d.id === id);
    return doc ? doc.name : 'Unknown Doctor';
};
