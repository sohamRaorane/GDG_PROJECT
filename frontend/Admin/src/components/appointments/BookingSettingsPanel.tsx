import { useState, useEffect } from "react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import { Settings, Users, Clock, Save, Loader2 } from "lucide-react";
import { saveBookingSettings, getBookingSettings } from "../../services/db";
import type { BookingSettings } from "../../types/db";

const BookingSettingsPanel = () => {
    const [settings, setSettings] = useState<BookingSettings>({
        maxBookingsPerSlot: 1,
        cutOffTime: 24,
        requiresManualConfirmation: false,
        requiresAdvancePayment: false
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            try {
                const saved = await getBookingSettings();
                if (saved && mounted) {
                    setSettings(saved);
                }
            } catch (error) {
                console.error("Failed to load booking settings", error);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        load();
        return () => { mounted = false };
    }, []);

    const handleChange = (key: keyof BookingSettings, value: any) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await saveBookingSettings(settings);
            alert("Settings saved successfully!");
        } catch (error) {
            console.error("Failed to save settings", error);
            alert("Failed to save settings.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12 bg-white rounded-xl shadow-lg">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <Card className="border-none shadow-lg">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                        <Settings className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Booking Rules</h3>
                        <p className="text-sm text-slate-500">Configure constraints and requirements for new bookings</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Max Bookings Per Slot</label>
                            <div className="relative">
                                <Users className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <input
                                    type="number"
                                    className="w-full pl-9 rounded-xl border border-slate-200 py-2.5 text-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none"
                                    value={settings.maxBookingsPerSlot}
                                    onChange={(e) => handleChange('maxBookingsPerSlot', parseInt(e.target.value))}
                                />
                            </div>
                            <p className="text-xs text-slate-400">Limit specific number of people per time slot.</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Cut-off Time (hours before)</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <input
                                    type="number"
                                    className="w-full pl-9 rounded-xl border border-slate-200 py-2.5 text-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none"
                                    value={settings.cutOffTime}
                                    onChange={(e) => handleChange('cutOffTime', parseInt(e.target.value))}
                                />
                            </div>
                            <p className="text-xs text-slate-400">Minimum notice required for bookings.</p>
                        </div>
                    </div>

                    <div className="space-y-3 pt-2">
                        <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                            <input
                                type="checkbox"
                                className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                id="manual-confirm"
                                checked={settings.requiresManualConfirmation}
                                onChange={(e) => handleChange('requiresManualConfirmation', e.target.checked)}
                            />
                            <div>
                                <p className="font-semibold text-slate-700">Require Manual Confirmation</p>
                                <p className="text-xs text-slate-500">Admin must approve appointments before they are confirmed.</p>
                            </div>
                        </label>

                        <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                            <input
                                type="checkbox"
                                className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                id="advance-pay"
                                checked={settings.requiresAdvancePayment}
                                onChange={(e) => handleChange('requiresAdvancePayment', e.target.checked)}
                            />
                            <div>
                                <p className="font-semibold text-slate-700">Require Advance Payment</p>
                                <p className="text-xs text-slate-500">Collect payment at the time of booking.</p>
                            </div>
                        </label>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-900/10 flex items-center gap-2"
                        >
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            {saving ? "Saving..." : "Save Configuration"}
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default BookingSettingsPanel;
