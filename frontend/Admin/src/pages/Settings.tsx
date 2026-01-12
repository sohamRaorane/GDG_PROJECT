import { useState } from 'react';
import {
    Settings as SettingsIcon,
    Database
} from 'lucide-react';

import GeneralSettingsPanel from '../components/settings/GeneralSettingsPanel';

import SystemSettingsPanel from '../components/settings/SystemSettingsPanel';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('general');
    // In a real app, this comes from AuthContext
    const CLINIC_ID = "clinic_1";

    const tabs = [
        { id: 'general', label: 'General', icon: SettingsIcon },

        { id: 'system', label: 'System', icon: Database },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30">
            <div className="space-y-6 pb-8">
                {/* Header */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 shadow-xl border border-white/5">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

                    <div className="relative flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-emerald-100 bg-clip-text text-transparent">
                                Settings
                            </h1>
                            <p className="text-slate-400 text-sm mt-1">Manage your clinic preferences and policies</p>
                        </div>
                    </div>
                </div>

                {/* Settings Content */}
                <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
                    {/* Sidebar Tabs */}
                    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm h-fit">
                        <nav className="space-y-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === tab.id
                                        ? 'bg-gradient-to-r from-[#1C4E46] to-[#0F766E] text-white shadow-lg shadow-teal-500/20'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    <tab.icon className="h-5 w-5" />
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </nav>

                        {/* Clinic Info Stub */}
                        <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Clinic ID</p>
                            <p className="text-xs font-mono bg-white px-2 py-1 rounded border border-slate-200 text-slate-600 truncate">
                                {CLINIC_ID}
                            </p>
                        </div>
                    </div>

                    {/* Settings Panels */}
                    <div className="space-y-6">
                        {activeTab === 'general' && <GeneralSettingsPanel clinicId={CLINIC_ID} />}

                        {activeTab === 'system' && <SystemSettingsPanel clinicId={CLINIC_ID} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
