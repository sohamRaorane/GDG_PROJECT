import { useState, useEffect } from 'react';
import { Save, Loader2, Calendar, Clock, DollarSign, AlertCircle } from 'lucide-react';
import type { BookingSettings } from '../../types/db';
import { updateClinicSettings, subscribeToClinicSettings } from '../../services/db';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface Props {
    clinicId: string;
}

const BookingSettingsPanel = ({ clinicId }: Props) => {
    const [settings, setSettings] = useState<BookingSettings>({
        maxBookingsPerSlot: 1,
        slotDurationMinutes: 60,
        bookingCutoffHours: 24,
        allowSameDayBooking: false,
        requiresManualConfirmation: false,
        requiresAdvancePayment: false,
        advancePaymentPercent: 50,
        cancellationWindowHours: 48,
        rescheduleAllowed: true,
        noShowPenaltyEnabled: false
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const unsubscribe = subscribeToClinicSettings(clinicId, 'booking', (data) => {
            if (data) {
                setSettings(prev => ({ ...prev, ...data }));
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [clinicId]);

    const handleChange = (key: keyof BookingSettings, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        if (settings.slotDurationMinutes < 15) {
            alert("Slot duration must be at least 15 minutes.");
            return;
        }

        setSaving(true);
        try {
            await updateClinicSettings(clinicId, 'booking', settings);
            alert("Booking rules updated. New slots will reflect these changes.");
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
                    <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
                        <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Booking Rules</h3>
                        <p className="text-sm text-slate-500">Configure scheduling logic and constraints</p>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Capacity & Timing */}
                    <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Capacity & Timing</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="text-sm font-semibold text-slate-700 mb-1 block">Max Patients per Slot</label>
                                <input
                                    type="number"
                                    min={1}
                                    value={settings.maxBookingsPerSlot}
                                    onChange={(e) => handleChange('maxBookingsPerSlot', parseInt(e.target.value))}
                                    className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-700 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-700 mb-1 block">Slot Duration (min)</label>
                                <input
                                    type="number"
                                    min={15}
                                    step={15}
                                    value={settings.slotDurationMinutes}
                                    onChange={(e) => handleChange('slotDurationMinutes', parseInt(e.target.value))}
                                    className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-700 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-700 mb-1 block">Cut-off Time (hours)</label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    <input
                                        type="number"
                                        min={0}
                                        value={settings.bookingCutoffHours}
                                        onChange={(e) => handleChange('bookingCutoffHours', parseInt(e.target.value))}
                                        className="w-full rounded-lg border border-slate-200 pl-10 pr-4 py-2.5 text-slate-700 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Booking Policies */}
                    <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Policies</h4>
                        <div className="space-y-4">
                            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors">
                                <div>
                                    <span className="font-semibold text-slate-700 block">Allow Same-Day Booking</span>
                                    <span className="text-xs text-slate-500">Patients can book for today if slots available</span>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings.allowSameDayBooking}
                                    onChange={(e) => handleChange('allowSameDayBooking', e.target.checked)}
                                    className="h-5 w-5 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                                />
                            </label>

                            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors">
                                <div>
                                    <span className="font-semibold text-slate-700 block">Require Manual Confirmation</span>
                                    <span className="text-xs text-slate-500">Staff must approve appointments before confirmation</span>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings.requiresManualConfirmation}
                                    onChange={(e) => handleChange('requiresManualConfirmation', e.target.checked)}
                                    className="h-5 w-5 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                                />
                            </label>

                            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors">
                                <div>
                                    <span className="font-semibold text-slate-700 block">Allow Rescheduling</span>
                                    <span className="text-xs text-slate-500">Patients can move their appointment</span>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings.rescheduleAllowed}
                                    onChange={(e) => handleChange('rescheduleAllowed', e.target.checked)}
                                    className="h-5 w-5 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Payments & Penalties */}
                    <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Financials</h4>
                        <div className="space-y-4">
                            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors">
                                <div className="flex items-center gap-3">
                                    <DollarSign className="h-5 w-5 text-green-600" />
                                    <div>
                                        <span className="font-semibold text-slate-700 block">Require Advance Payment</span>
                                        <span className="text-xs text-slate-500">Collect partial or full amount upfront</span>
                                    </div>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings.requiresAdvancePayment}
                                    onChange={(e) => handleChange('requiresAdvancePayment', e.target.checked)}
                                    className="h-5 w-5 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                                />
                            </label>

                            {settings.requiresAdvancePayment && (
                                <div className="ml-8 p-4 bg-green-50 rounded-lg border border-green-100">
                                    <label className="text-sm font-semibold text-green-800 mb-1 block">Advance Percentage (%)</label>
                                    <input
                                        type="number"
                                        min={1}
                                        max={100}
                                        value={settings.advancePaymentPercent}
                                        onChange={(e) => handleChange('advancePaymentPercent', parseInt(e.target.value))}
                                        className="w-32 rounded-lg border border-green-200 px-4 py-2 text-green-800 outline-none focus:border-green-500 bg-white"
                                    />
                                </div>
                            )}

                            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors">
                                <div className="flex items-center gap-3">
                                    <AlertCircle className="h-5 w-5 text-red-600" />
                                    <div>
                                        <span className="font-semibold text-slate-700 block">No-Show Penalty</span>
                                        <span className="text-xs text-slate-500">Flag users who miss appointments</span>
                                    </div>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings.noShowPenaltyEnabled}
                                    onChange={(e) => handleChange('noShowPenaltyEnabled', e.target.checked)}
                                    className="h-5 w-5 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
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
                            {saving ? 'Saving...' : 'Update Rules'}
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default BookingSettingsPanel;
