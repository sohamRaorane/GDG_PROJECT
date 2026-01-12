import { useState, useEffect } from 'react';
import { Save, Loader2, Shield, Lock, Activity, Eye, Key } from 'lucide-react';
import type { SecuritySettings } from '../../types/db';
import { updateClinicSettings, subscribeToClinicSettings } from '../../services/db';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface Props {
    clinicId: string;
}

const SecuritySettingsPanel = ({ clinicId }: Props) => {
    const [settings, setSettings] = useState<SecuritySettings>({
        enable2FA: false,
        sessionTimeoutMinutes: 30,
        passwordExpiryDays: 90,
        ipRestrictionEnabled: false,
        auditLoggingEnabled: true
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const unsubscribe = subscribeToClinicSettings(clinicId, 'security', (data) => {
            if (data) {
                setSettings(prev => ({ ...prev, ...data }));
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [clinicId]);

    const handleChange = (key: keyof SecuritySettings, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateClinicSettings(clinicId, 'security', settings);
            alert("Security policies updated.");
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
                    <div className="p-2.5 bg-red-50 text-red-600 rounded-lg">
                        <Shield className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Security Policies</h3>
                        <p className="text-sm text-slate-500">Access control and compliance</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Authentication */}
                    <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Authentication</h4>
                        <div className="space-y-4">
                            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors">
                                <div className="flex items-center gap-3">
                                    <Key className="h-4 w-4 text-slate-500" />
                                    <div>
                                        <span className="font-semibold text-slate-700 block">Two-Factor Authentication (2FA)</span>
                                        <span className="text-xs text-slate-500">Require OTP for all admin logins</span>
                                    </div>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings.enable2FA}
                                    onChange={(e) => handleChange('enable2FA', e.target.checked)}
                                    className="h-5 w-5 rounded border-slate-300 text-red-600 focus:ring-red-500"
                                />
                            </label>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-semibold text-slate-700 mb-1 block">Session Timeout (min)</label>
                                    <input
                                        type="number"
                                        min={5}
                                        value={settings.sessionTimeoutMinutes}
                                        onChange={(e) => handleChange('sessionTimeoutMinutes', parseInt(e.target.value))}
                                        className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-700 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-slate-700 mb-1 block">Password Expiry (days)</label>
                                    <input
                                        type="number"
                                        min={30}
                                        value={settings.passwordExpiryDays}
                                        onChange={(e) => handleChange('passwordExpiryDays', parseInt(e.target.value))}
                                        className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-700 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Monitoring */}
                    <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Monitoring & Restrictions</h4>
                        <div className="space-y-3">
                            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors">
                                <div className="flex items-center gap-3">
                                    <Lock className="h-4 w-4 text-slate-500" />
                                    <div>
                                        <span className="font-semibold text-slate-700 block">IP Restriction</span>
                                        <span className="text-xs text-slate-500">Allow access only from whitelisted IPs</span>
                                    </div>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings.ipRestrictionEnabled}
                                    onChange={(e) => handleChange('ipRestrictionEnabled', e.target.checked)}
                                    className="h-5 w-5 rounded border-slate-300 text-red-600 focus:ring-red-500"
                                />
                            </label>

                            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors">
                                <div className="flex items-center gap-3">
                                    <Eye className="h-4 w-4 text-slate-500" />
                                    <div>
                                        <span className="font-semibold text-slate-700 block">Audit Logging</span>
                                        <span className="text-xs text-slate-500">Record all sensitive actions</span>
                                    </div>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings.auditLoggingEnabled}
                                    onChange={(e) => handleChange('auditLoggingEnabled', e.target.checked)}
                                    className="h-5 w-5 rounded border-slate-300 text-red-600 focus:ring-red-500"
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
                            {saving ? 'Saving...' : 'Update Policies'}
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default SecuritySettingsPanel;
