import { useState } from 'react';
import {
    Settings as SettingsIcon,
    Bell,
    Shield,
    Database,
    Save,
    Mail,
    Globe,
    Clock,
    Lock,
    Key,
    Server,
    HardDrive,
    Wrench
} from 'lucide-react';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [settings, setSettings] = useState({
        // General Settings
        platformName: 'AyurSutra',
        contactEmail: 'admin@ayursutra.com',
        timezone: 'Asia/Kolkata',
        language: 'English',

        // Notification Settings
        emailNotifications: true,
        smsAlerts: false,
        pushNotifications: true,
        appointmentReminders: true,

        // Security Settings
        twoFactorAuth: false,
        sessionTimeout: 30,
        passwordExpiry: 90,

        // System Settings
        autoBackup: true,
        maintenanceMode: false,
        apiRateLimit: 1000,
    });

    const handleToggle = (key: string) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
    };

    const handleInputChange = (key: string, value: string | number) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const tabs = [
        { id: 'general', label: 'General', icon: SettingsIcon },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
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
                            <p className="text-slate-400 text-sm mt-1">Manage your admin dashboard preferences</p>
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
                    </div>

                    {/* Settings Panels */}
                    <div className="space-y-6">
                        {/* General Settings */}
                        {activeTab === 'general' && (
                            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2.5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                                        <SettingsIcon size={20} className="text-blue-700" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900">General Settings</h2>
                                        <p className="text-sm text-slate-600">Configure basic platform settings</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                            <Globe className="h-4 w-4" />
                                            Platform Name
                                        </label>
                                        <input
                                            type="text"
                                            value={settings.platformName}
                                            onChange={(e) => handleInputChange('platformName', e.target.value)}
                                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                            <Mail className="h-4 w-4" />
                                            Contact Email
                                        </label>
                                        <input
                                            type="email"
                                            value={settings.contactEmail}
                                            onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                                <Clock className="h-4 w-4" />
                                                Timezone
                                            </label>
                                            <select
                                                value={settings.timezone}
                                                onChange={(e) => handleInputChange('timezone', e.target.value)}
                                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                            >
                                                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                                                <option value="America/New_York">America/New York (EST)</option>
                                                <option value="Europe/London">Europe/London (GMT)</option>
                                                <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                                <Globe className="h-4 w-4" />
                                                Language
                                            </label>
                                            <select
                                                value={settings.language}
                                                onChange={(e) => handleInputChange('language', e.target.value)}
                                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                            >
                                                <option value="English">English</option>
                                                <option value="Hindi">Hindi</option>
                                                <option value="Spanish">Spanish</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4 border-t border-slate-200">
                                        <button className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#1C4E46] to-[#0F766E] text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium">
                                            <Save className="h-4 w-4" />
                                            Save Changes
                                        </button>
                                        <button className="bg-slate-100 text-slate-700 px-6 py-2.5 rounded-lg hover:bg-slate-200 font-medium transition-colors">
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notification Settings */}
                        {activeTab === 'notifications' && (
                            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2.5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl">
                                        <Bell size={20} className="text-amber-700" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900">Notification Settings</h2>
                                        <p className="text-sm text-slate-600">Manage how you receive notifications</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive updates via email' },
                                        { key: 'smsAlerts', label: 'SMS Alerts', description: 'Get important alerts via SMS' },
                                        { key: 'pushNotifications', label: 'Push Notifications', description: 'Browser push notifications' },
                                        { key: 'appointmentReminders', label: 'Appointment Reminders', description: 'Reminders for upcoming appointments' },
                                    ].map((item) => (
                                        <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all">
                                            <div>
                                                <p className="font-semibold text-slate-900">{item.label}</p>
                                                <p className="text-sm text-slate-600">{item.description}</p>
                                            </div>
                                            <button
                                                onClick={() => handleToggle(item.key)}
                                                className={`relative w-14 h-7 rounded-full transition-all duration-300 ${settings[item.key as keyof typeof settings]
                                                        ? 'bg-gradient-to-r from-[#1C4E46] to-[#0F766E]'
                                                        : 'bg-slate-300'
                                                    }`}
                                            >
                                                <span
                                                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${settings[item.key as keyof typeof settings] ? 'translate-x-7' : ''
                                                        }`}
                                                />
                                            </button>
                                        </div>
                                    ))}

                                    <div className="flex gap-3 pt-4 border-t border-slate-200">
                                        <button className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#1C4E46] to-[#0F766E] text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium">
                                            <Save className="h-4 w-4" />
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Security Settings */}
                        {activeTab === 'security' && (
                            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2.5 bg-gradient-to-br from-red-50 to-rose-50 rounded-xl">
                                        <Shield size={20} className="text-red-700" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900">Security Settings</h2>
                                        <p className="text-sm text-slate-600">Protect your account and data</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <Key className="h-5 w-5 text-slate-600" />
                                            <div>
                                                <p className="font-semibold text-slate-900">Two-Factor Authentication</p>
                                                <p className="text-sm text-slate-600">Add an extra layer of security</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleToggle('twoFactorAuth')}
                                            className={`relative w-14 h-7 rounded-full transition-all duration-300 ${settings.twoFactorAuth
                                                    ? 'bg-gradient-to-r from-[#1C4E46] to-[#0F766E]'
                                                    : 'bg-slate-300'
                                                }`}
                                        >
                                            <span
                                                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${settings.twoFactorAuth ? 'translate-x-7' : ''
                                                    }`}
                                            />
                                        </button>
                                    </div>

                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                            <Clock className="h-4 w-4" />
                                            Session Timeout (minutes)
                                        </label>
                                        <input
                                            type="number"
                                            value={settings.sessionTimeout}
                                            onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
                                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                            <Lock className="h-4 w-4" />
                                            Password Expiry (days)
                                        </label>
                                        <input
                                            type="number"
                                            value={settings.passwordExpiry}
                                            onChange={(e) => handleInputChange('passwordExpiry', parseInt(e.target.value))}
                                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-4 border-t border-slate-200">
                                        <button className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#1C4E46] to-[#0F766E] text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium">
                                            <Save className="h-4 w-4" />
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* System Settings */}
                        {activeTab === 'system' && (
                            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2.5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl">
                                        <Database size={20} className="text-emerald-700" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900">System Settings</h2>
                                        <p className="text-sm text-slate-600">Configure system-level options</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <HardDrive className="h-5 w-5 text-slate-600" />
                                            <div>
                                                <p className="font-semibold text-slate-900">Automatic Backup</p>
                                                <p className="text-sm text-slate-600">Daily automated backups</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleToggle('autoBackup')}
                                            className={`relative w-14 h-7 rounded-full transition-all duration-300 ${settings.autoBackup
                                                    ? 'bg-gradient-to-r from-[#1C4E46] to-[#0F766E]'
                                                    : 'bg-slate-300'
                                                }`}
                                        >
                                            <span
                                                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${settings.autoBackup ? 'translate-x-7' : ''
                                                    }`}
                                            />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <Wrench className="h-5 w-5 text-slate-600" />
                                            <div>
                                                <p className="font-semibold text-slate-900">Maintenance Mode</p>
                                                <p className="text-sm text-slate-600">Disable public access temporarily</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleToggle('maintenanceMode')}
                                            className={`relative w-14 h-7 rounded-full transition-all duration-300 ${settings.maintenanceMode
                                                    ? 'bg-gradient-to-r from-red-500 to-rose-500'
                                                    : 'bg-slate-300'
                                                }`}
                                        >
                                            <span
                                                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${settings.maintenanceMode ? 'translate-x-7' : ''
                                                    }`}
                                            />
                                        </button>
                                    </div>

                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                            <Server className="h-4 w-4" />
                                            API Rate Limit (requests/hour)
                                        </label>
                                        <input
                                            type="number"
                                            value={settings.apiRateLimit}
                                            onChange={(e) => handleInputChange('apiRateLimit', parseInt(e.target.value))}
                                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-4 border-t border-slate-200">
                                        <button className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#1C4E46] to-[#0F766E] text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium">
                                            <Save className="h-4 w-4" />
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
