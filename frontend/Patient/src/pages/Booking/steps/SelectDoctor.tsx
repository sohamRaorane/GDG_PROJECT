
import { cn } from '../../../utils/cn';

export interface Resource {
    id: string;
    label: string; // "A1/R1"
    subLabel: string; // e.g. "Dr. Sharma - Room 1"
}

const RESOURCES: Resource[] = [
    {
        id: 'r1',
        label: 'A1 / R1',
        subLabel: 'Available'
    },
    {
        id: 'r2',
        label: 'A2 / R2',
        subLabel: 'Available'
    },
];

interface SelectDoctorProps {
    selectedDoctorId: string;
    onSelect: (doctorId: string) => void;
}

export const SelectDoctor: React.FC<SelectDoctorProps> = ({ selectedDoctorId, onSelect }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
            <h3 className="text-xl font-display font-medium mb-8 text-center w-full">Select User / Resource</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
                {RESOURCES.map((resource) => (
                    <div
                        key={resource.id}
                        onClick={() => onSelect(resource.id)}
                        className={cn(
                            "group cursor-pointer aspect-square md:aspect-video rounded-xl border-4 flex flex-col items-center justify-center transition-all duration-300",
                            selectedDoctorId === resource.id
                                ? "border-primary bg-primary/10 scale-105 shadow-xl"
                                : "border-gray-800/10 hover:border-primary/50 hover:bg-gray-50 bg-neutral-900/5"
                        )}
                    >
                        <h2 className={cn(
                            "text-5xl md:text-7xl font-display font-bold tracking-tighter transition-colors",
                            selectedDoctorId === resource.id ? "text-primary" : "text-gray-300 group-hover:text-primary/70"
                        )}>
                            {resource.label}
                        </h2>
                        {selectedDoctorId === resource.id && (
                            <span className="mt-4 text-sm font-medium text-primary animate-pulse">
                                Selected
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
