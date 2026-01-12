import { useState, useEffect } from 'react';
import { Save, Loader2, Globe, Mail, Clock } from 'lucide-react';
import type { GeneralSettings } from '../../types/db';
import { updateClinicSettings, subscribeToClinicSettings } from '../../services/db';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface Props {
    clinicId: string;
}

const GeneralSettingsPanel = ({ clinicId }: Props) => {
    const [settings, setSettings] = useState<GeneralSettings>({
        platformName: '',
        contactEmail: '',
        timezone: 'Asia/Kolkata',
        language: 'en',
        dateFormat: 'DD/MM/YYYY',
        currency: 'INR'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const unsubscribe = subscribeToClinicSettings(clinicId, 'general', (data) => {
            if (data) {
                setSettings(prev => ({
                    ...prev,
                    ...data
                }));
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [clinicId]);

    const handleChange = (key: keyof GeneralSettings, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };



    const handleSave = async () => {
        setSaving(true);
        try {
            await updateClinicSettings(clinicId, 'general', settings);
            // In a real app, show toast here
            alert("General settings saved successfully.");
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
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                        <Globe className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">General Information</h3>
                        <p className="text-sm text-slate-500">Platform identity and localization</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm font-semibold text-slate-700 mb-1 block">Platform Name</label>
                            <input
                                type="text"
                                value={settings.platformName}
                                onChange={(e) => handleChange('platformName', e.target.value)}
                                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                                placeholder="E.g. AyurSutra"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-700 mb-1 block">Contact Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <input
                                    type="email"
                                    value={settings.contactEmail}
                                    onChange={(e) => handleChange('contactEmail', e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 pl-10 pr-4 py-2.5 text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                                    placeholder="admin@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-slate-700 mb-1 block">Timezone</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <select
                                    value={settings.timezone}
                                    onChange={(e) => handleChange('timezone', e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 pl-10 pr-4 py-2.5 text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 bg-white"
                                >
                                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                                    <option value="America/New_York">America/New_York (EST)</option>
                                    <option value="Europe/London">Europe/London (GMT)</option>
                                </select>
                            </div>
                            <p className="text-xs text-slate-400 mt-1">Affects booking slots and reminders.</p>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-slate-700 mb-1 block">Language</label>
                            <select
                                value={settings.language}
                                onChange={(e) => handleChange('language', e.target.value)}
                                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 bg-white"
                            >
                                <option value="en">English</option>
                                <option value="hi">Hindi (हिंदी)</option>
                                <option value="mr">Marathi (मराठी)</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-2"
                        >
                            {saving ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
                            {saving ? 'Saving...' : 'Save General Settings'}
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default GeneralSettingsPanel;
