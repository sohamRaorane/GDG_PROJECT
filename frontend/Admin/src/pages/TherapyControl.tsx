
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTherapyLive } from '../hooks/useTherapyLive';
import { VitalsGraph } from '../components/dashboard/VitalsGraph';
import { RecoveryTimeline } from '../components/dashboard/RecoveryTimeline';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { Save, CheckCircle, AlertTriangle, ArrowLeft, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const TherapyControl = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: therapy, loading, error } = useTherapyLive(id || '');

    // Local state for the form
    const [painLevel, setPainLevel] = useState(5);
    const [notes, setNotes] = useState('');
    const [saving, setSaving] = useState(false);

    // Sync form with current day's log when therapy loads or day changes
    useEffect(() => {
        if (therapy) {
            const currentLog = therapy.logs[`day_${therapy.currentDay}`];
            if (currentLog) {
                setPainLevel(currentLog.painLevel || 5);
                setNotes(currentLog.notes || '');
            } else {
                // Default for new day
                setPainLevel(5);
                setNotes('');
            }
        }
    }, [therapy?.currentDay, therapy?.id]); // Only reset when day changes or new therapy loads

    const handleUpdateLog = async () => {
        if (!therapy || !id) return;
        setSaving(true);
        try {
            await updateDoc(doc(db, 'active_therapies', id), {
                [`logs.day_${therapy.currentDay}`]: {
                    painLevel,
                    notes,
                    status: 'In_Progress',
                    date: new Date().toISOString().split('T')[0]
                }
            });
            alert('Log updated successfully');
        } catch (e) {
            console.error(e);
            alert('Error updating log');
        } finally {
            setSaving(false);
        }
    };

    const handleCompleteDay = async () => {
        if (!therapy || !id) return;

        const confirm = window.confirm(`Are you sure you want to complete Day ${therapy.currentDay} and move to Day ${therapy.currentDay + 1}?`);
        if (!confirm) return;

        setSaving(true);
        try {
            const nextDay = Math.min(therapy.currentDay + 1, therapy.totalDays);
            const isFinished = therapy.currentDay === therapy.totalDays;

            await updateDoc(doc(db, 'active_therapies', id), {
                [`logs.day_${therapy.currentDay}.status`]: 'Done',
                currentDay: isFinished ? therapy.currentDay : nextDay,
                status: isFinished ? 'COMPLETED' : 'IN_PROGRESS'
            });

            if (isFinished) {
                alert('Therapy Completed!');
                navigate('/active-therapies');
            }
        } catch (e) {
            console.error(e);
            alert('Error completing day');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading patient data...</div>;
    if (error || !therapy) return <div className="p-8 text-center text-red-500">Error: {error || 'Therapy not found'}</div>;

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/active-therapies" className="p-2 hover:bg-slate-100 rounded-full transition">
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">{therapy.therapyName}</h1>
                        <p className="text-sm text-slate-500">Patient Control Center</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">Current Day:</span>
                    <span className="bg-teal-100 text-teal-700 text-sm font-bold px-3 py-1 rounded-full">
                        {therapy.currentDay} / {therapy.totalDays}
                    </span>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT COLUMN: Controls */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-teal-600" /> Daily Check-in
                        </h2>

                        <div className="space-y-6">
                            {/* Pain Level Input */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Reported Pain/Discomfort Level (1-10)
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="10"
                                    value={painLevel}
                                    onChange={(e) => setPainLevel(parseInt(e.target.value))}
                                    className="w-full accent-teal-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="flex justify-between text-xs text-slate-500 mt-2">
                                    <span>No Pain (0)</span>
                                    <span className="font-bold text-slate-900 text-base">{painLevel}</span>
                                    <span>Extreme (10)</span>
                                </div>
                            </div>

                            {/* Notes Input */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Doctor's Observations / Notes
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Patient responded well to..."
                                    className="w-full h-32 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-slate-700"
                                />
                            </div>

                            {/* Actions */}
                            <div className="pt-4 space-y-3">
                                <button
                                    onClick={handleUpdateLog}
                                    disabled={saving}
                                    className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition disabled:opacity-50"
                                >
                                    <Save className="w-4 h-4" /> Save Updates
                                </button>

                                <button
                                    onClick={handleCompleteDay}
                                    disabled={saving}
                                    className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition disabled:opacity-50"
                                >
                                    <CheckCircle className="w-4 h-4" /> Complete Day {therapy.currentDay}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-bold text-yellow-800">Note for Staff</h4>
                            <p className="text-xs text-yellow-700 mt-1">
                                Updating inputs above sends real-time data to the patient's dashboard. Ensure accuracy before saving.
                            </p>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Visuals (What the patient sees) */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Patient View Preview</h3>

                    {/* Graph */}
                    <VitalsGraph logs={therapy.logs} />

                    {/* Timeline */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                        <RecoveryTimeline therapy={therapy} />
                    </div>
                </div>

            </main>
        </div>
    );
};

export default TherapyControl;
