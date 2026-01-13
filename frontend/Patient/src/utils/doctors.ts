import drAnjali from '../assets/doctors/dr_anjali.png';
import drRajesh from '../assets/doctors/dr_rajesh.png';
import drPriyanshu from '../assets/doctors/dr_priyanshu.png';
import drVikram from '../assets/doctors/dr_vikram.png';
import drSunita from '../assets/doctors/dr_sunita.png';
import drAryan from '../assets/doctors/dr_aryan.png';

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
        clinicIds: ['1', '2', '7'] // Available at AyurSutra, Prakriti, and Ojas
    },
    {
        id: 'dr-verma',
        name: 'Dr. Rajesh Verma',
        specialization: 'Ayurvedic Medicine',
        experience: '20 Years',
        image: drRajesh,
        rating: 4.9,
        clinicIds: ['1', '3', '5', '6'] // AyurSutra, Dhanvantari, Sushruta, NavJivan
    },
    {
        id: 'dr-gupta',
        name: 'Dr. Priyanshu Gupta',
        specialization: 'Nadi Pariksha Expert',
        experience: '8 Years',
        image: drPriyanshu,
        rating: 4.6,
        clinicIds: ['2', '4', '7'] // Prakriti, VedaLife, Ojas
    },
    {
        id: 'dr-iyer',
        name: 'Dr. Vikram Iyer',
        specialization: 'Kayachikitsa (General Medicine)',
        experience: '15 Years',
        image: drVikram,
        rating: 4.7,
        clinicIds: ['1', '3', '6']
    },
    {
        id: 'dr-mehta',
        name: 'Dr. Sunita Mehta',
        specialization: 'Stri Roga (Gynecology)',
        experience: '10 Years',
        image: drSunita,
        rating: 4.9,
        clinicIds: ['2', '5', '7']
    },
    {
        id: 'dr-singh',
        name: 'Dr. Aryan Singh',
        specialization: 'Shalya Tantra (Surgery)',
        experience: '18 Years',
        image: drAryan,
        rating: 4.8,
        clinicIds: ['4', '6']
    },
];

export const getDoctorName = (id: string): string => {
    // Check if ID matches a doctor or is generic 'admin'
    if (id === 'admin') return 'Dr. Anjali Gupta';

    const doc = DOCTORS.find(d => d.id === id);
    return doc ? doc.name : 'Unknown Doctor';
};
