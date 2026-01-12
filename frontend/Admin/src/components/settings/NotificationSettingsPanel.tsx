import { useState, useEffect } from 'react';
import { Save, Loader2, Bell, Smartphone, Mail, AlertTriangle } from 'lucide-react';
import type { NotificationSettings } from '../../types/db';
import { updateClinicSettings, subscribeToClinicSettings } from '../../services/db';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface Props {
    clinicId: string;
}

const NotificationSettingsPanel = ({ clinicId }: Props) => {
    const [settings, setSettings] = useState<NotificationSettings>({
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        appointmentReminders: true,
        reminderTimingHours: [24, 2],
        criticalAlerts: true
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const unsubscribe = subscribeToClinicSettings(clinicId, 'notifications', (data) => {
            if (data) {
                setSettings(prev => ({ ...prev, ...data }));
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [clinicId]);

    const handleChange = (key: keyof NotificationSettings, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleTimingChange = (value: string) => {
        // Parse "24, 2" into [24, 2]
        const hours = value.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
        handleChange('reminderTimingHours', hours);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateClinicSettings(clinicId, 'notifications', settings);
            alert("Notification preferences updated.");
        } catch (error) {
            console.error("Failed to save:", error);
            alert("Failed to save settings.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

    return (
        <Card className="border-none shadow-lg">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg">
                        <Bell className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Notifications</h3>
                        <p className="text-sm text-slate-500">Manage alerts and communication channels</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Channels */}
                    <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Channels</h4>
                        <div className="space-y-3">
                            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors">
                                <div className="flex items-center gap-3">
                                    <Mail className="h-4 w-4 text-slate-500" />
                                    <span className="font-semibold text-slate-700">Email Notifications</span>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings.emailNotifications}
                                    onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                                    className="h-5 w-5 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                                />
                            </label>
                            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors">
                                <div className="flex items-center gap-3">
                                    <Smartphone className="h-4 w-4 text-slate-500" />
                                    <span className="font-semibold text-slate-700">SMS Alerts</span>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings.smsNotifications}
                                    onChange={(e) => handleChange('smsNotifications', e.target.checked)}
                                    className="h-5 w-5 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                                />
                            </label>
                            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors">
                                <div className="flex items-center gap-3">
                                    <Bell className="h-4 w-4 text-slate-500" />
                                    <span className="font-semibold text-slate-700">Push Notifications (FCM)</span>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings.pushNotifications}
                                    onChange={(e) => handleChange('pushNotifications', e.target.checked)}
                                    className="h-5 w-5 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Reminders & Alerts */}
                    <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Reminders & Alerts</h4>
                        <div className="space-y-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <label className="text-sm font-semibold text-slate-700 block mb-1">Appointment Reminders</label>
                                    <p className="text-xs text-slate-500 mb-2">Send automated reminders to patients.</p>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={settings.reminderTimingHours.join(', ')}
                                            onChange={(e) => handleTimingChange(e.target.value)}
                                            className="w-48 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-500"
                                            placeholder="e.g. 24, 2"
                                        />
                                        <span className="text-xs text-slate-400">hours before</span>
                                    </div>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings.appointmentReminders}
                                    onChange={(e) => handleChange('appointmentReminders', e.target.checked)}
                                    className="h-5 w-5 rounded border-slate-300 text-purple-600 focus:ring-purple-500 mt-1"
                                />
                            </div>

                            <label className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100 cursor-pointer transition-colors">
                                <div className="flex items-center gap-3">
                                    <AlertTriangle className="h-5 w-5 text-red-600" />
                                    <div>
                                        <span className="font-semibold text-red-900">Critical Red Flag Alerts</span>
                                        <span className="text-xs text-red-700 block">Immediate SOS and high-risk notifications</span>
                                    </div>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings.criticalAlerts}
                                    onChange={(e) => handleChange('criticalAlerts', e.target.checked)}
                                    className="h-5 w-5 rounded border-red-300 text-red-600 focus:ring-red-500"
                                />
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-2"
                        >
                            {saving ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
                            {saving ? 'Saving...' : 'Save Preferences'}
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default NotificationSettingsPanel;
