import { Bell, Phone, FileText, ClipboardCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const QuickActions = () => {
    const navigate = useNavigate();

    const actions = [
        {
            icon: <Bell size={20} />,
            label: 'Notifications',
            onClick: () => { },
            color: 'bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-100',
            count: 3
        },
        {
            icon: <Phone size={20} />,
            label: 'Call Clinic',
            onClick: () => window.open('tel:+1234567890'),
            color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100'
        },
        {
            icon: <FileText size={20} />,
            label: 'Prescriptions',
            onClick: () => navigate('/profile'),
            color: 'bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-100'
        },
        {
            icon: <ClipboardCheck size={20} />,
            label: 'Check-in',
            onClick: () => navigate('/progress'),
            color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100'
        }
    ];

    return (
        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-lg">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
                {actions.map((action, idx) => (
                    <button
                        key={idx}
                        onClick={action.onClick}
                        className={`${action.color} rounded-2xl p-4 flex flex-col items-center gap-2 transition-all duration-300 ease-out hover:scale-105 hover:shadow-md active:scale-95 relative group`}
                    >
                        {action.count && (
                            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                {action.count}
                            </span>
                        )}
                        <div className="p-2 rounded-lg bg-white/50 group-hover:bg-white transition-colors">
                            {action.icon}
                        </div>
                        <span className="text-xs font-semibold">{action.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};
