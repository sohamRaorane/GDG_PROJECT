import { useState, useEffect } from 'react';
import { Save, Loader2, Server, Database, Activity, AlertOctagon } from 'lucide-react';
import type { SystemSettings } from '../../types/db';
import { updateClinicSettings, subscribeToClinicSettings } from '../../services/db';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface Props {
    clinicId: string;
}

const SystemSettingsPanel = ({ clinicId }: Props) => {
    const [settings, setSettings] = useState<SystemSettings>({
        maintenanceMode: false,
        maintenanceMessage: "We are currently undergoing maintenance. Please check back later.",
        automaticBackup: true,
        apiRateLimitPerHour: 1000,
        dataRetentionDays: 365
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const unsubscribe = subscribeToClinicSettings(clinicId, 'system', (data) => {
            if (data) {
                setSettings(prev => ({ ...prev, ...data }));
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [clinicId]);

    const handleChange = (key: keyof SystemSettings, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateClinicSettings(clinicId, 'system', settings);
            alert("System configuration updated.");
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
                    <div className="p-2.5 bg-slate-100 text-slate-600 rounded-lg">
                        <Server className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">System Configuration</h3>
                        <p className="text-sm text-slate-500">Infrastructure and maintenance controls</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Maintenance */}
                    <div className={`p-4 rounded-xl border transition-all ${settings.maintenanceMode ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-100'}`}>
                        <label className="flex items-start justify-between cursor-pointer mb-4">
                            <div className="flex items-center gap-3">
                                <AlertOctagon className={`h-5 w-5 ${settings.maintenanceMode ? 'text-red-600' : 'text-slate-500'}`} />
                                <div>
                                    <span className={`font-bold block ${settings.maintenanceMode ? 'text-red-700' : 'text-slate-700'}`}>Maintenance Mode</span>
                                    <span className={`text-xs block ${settings.maintenanceMode ? 'text-red-600' : 'text-slate-500'}`}>Blocks patient access immediately</span>
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                checked={settings.maintenanceMode}
                                onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                                className="h-6 w-6 rounded border-slate-300 text-red-600 focus:ring-red-500"
                            />
                        </label>

                        {settings.maintenanceMode && (
                            <textarea
                                value={settings.maintenanceMessage}
                                onChange={(e) => handleChange('maintenanceMessage', e.target.value)}
                                className="w-full rounded-lg border border-red-200 bg-white p-3 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/10 outline-none"
                                rows={3}
                                placeholder="Enter message for users..."
                            />
                        )}
                    </div>

                    {/* Infrastructure */}
                    <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Infrastructure</h4>
                        <div className="space-y-4">
                            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors">
                                <div className="flex items-center gap-3">
                                    <Database className="h-4 w-4 text-slate-500" />
                                    <div>
                                        <span className="font-semibold text-slate-700 block">Automatic Backups</span>
                                        <span className="text-xs text-slate-500">Daily snapshot of all data</span>
                                    </div>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings.automaticBackup}
                                    onChange={(e) => handleChange('automaticBackup', e.target.checked)}
                                    className="h-5 w-5 rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                                />
                            </label>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-semibold text-slate-700 mb-1 block">API Rate Limit (per hour)</label>
                                    <input
                                        type="number"
                                        min={100}
                                        step={100}
                                        value={settings.apiRateLimitPerHour}
                                        onChange={(e) => handleChange('apiRateLimitPerHour', parseInt(e.target.value))}
                                        className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-700 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500/10"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-slate-700 mb-1 block">Data Retention (days)</label>
                                    <input
                                        type="number"
                                        min={30}
                                        value={settings.dataRetentionDays}
                                        onChange={(e) => handleChange('dataRetentionDays', parseInt(e.target.value))}
                                        className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-700 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500/10"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-2"
                        >
                            {saving ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
                            {saving ? 'Saving...' : 'Update Config'}
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default SystemSettingsPanel;
