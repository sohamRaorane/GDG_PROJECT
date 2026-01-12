import { cn } from '../../utils/cn';

interface NatureBackgroundProps {
    className?: string;
}

export const NatureBackground = ({ className }: NatureBackgroundProps) => (
    <div className={cn("fixed inset-0 z-0 overflow-hidden pointer-events-none select-none bg-[#FFF9F2]", className)}>
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#D1E8D5] rounded-full mix-blend-multiply filter blur-[80px] opacity-80 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#CDE0D0] rounded-full mix-blend-multiply filter blur-[80px] opacity-80 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] bg-[#D9EBE0] rounded-full mix-blend-multiply filter blur-[80px] opacity-80 animate-blob animation-delay-4000"></div>
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05]"></div>
    </div>
);
