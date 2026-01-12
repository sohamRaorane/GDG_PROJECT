
// Doctor Portraits (commented out as unused for now)
// import drAnjali from '../../../assets/doctors/dr_anjali.png';
// import drRajesh from '../../../assets/doctors/dr_rajesh.png';
// import drPriyanshu from '../../../assets/doctors/dr_priyanshu.png';

// Note: Images might not resolve if they are not active in Admin project. 
// However, we primarily need the map for ID -> Name.

export interface DoctorResource {
    id: string;
    name: string;
    specialization: string;
    experience: string;
    // image: string; // Commented out to avoid asset issues for now
    rating: number;
    clinicIds: string[];
}

export const DOCTORS: DoctorResource[] = [
    {
        id: 'dr-sharma',
        name: 'Dr. Anjali Sharma',
        specialization: 'Panchakarma Specialist',
        experience: '12 Years',
        rating: 4.8,
        clinicIds: ['1', '2']
    },
    {
        id: 'dr-verma',
        name: 'Dr. Rajesh Verma',
        specialization: 'Ayurvedic Medicine',
        experience: '20 Years',
        rating: 4.9,
        clinicIds: ['1', '3', '5']
    },
    {
        id: 'dr-gupta',
        name: 'Dr. Priyanshu Gupta',
        specialization: 'Nadi Pariksha Expert',
        experience: '8 Years',
        rating: 4.6,
        clinicIds: ['2', '4']
    },
];

export const getDoctorName = (id: string): string => {
    const doc = DOCTORS.find(d => d.id === id);
    return doc ? doc.name : 'Unknown Doctor';
};
