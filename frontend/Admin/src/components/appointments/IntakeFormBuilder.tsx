import { useState, useEffect } from "react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import { Plus, Trash2, GripVertical, FileText, CheckSquare, Type, List, Save, Loader2 } from "lucide-react";
import { saveIntakeForm, getIntakeForm } from "../../services/db";
import type { IntakeFormField } from "../../types/db";

const IntakeFormBuilder = () => {
    const [fields, setFields] = useState<IntakeFormField[]>([
        { id: "1", type: "text", label: "Medical History", required: true },
        { id: "2", type: "text", label: "Current Medications", required: false },
        { id: "3", type: "select", label: "Do you have allergies?", required: true, options: ["Yes", "No"] },
    ]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            try {
                const saved = await getIntakeForm();
                if (saved && mounted) {
                    setFields(saved);
                }
            } catch (error) {
                console.error("Failed to load intake form", error);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        load();
        return () => { mounted = false };
    }, []);

    const addField = () => {
        const newField: IntakeFormField = {
            id: Date.now().toString(),
            type: "text",
            label: "New Question",
            required: false,
        };
        setFields([...fields, newField]);
    };

    const removeField = (id: string) => {
        setFields(fields.filter((f) => f.id !== id));
    };

    const updateField = (id: string, updates: Partial<IntakeFormField>) => {
        setFields(fields.map((f) => (f.id === id ? { ...f, ...updates } : f)));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await saveIntakeForm(fields);
            alert("Form saved successfully!");
        } catch (error) {
            console.error("Failed to save form", error);
            alert("Failed to save form.");
        } finally {
            setSaving(false);
        }
    };

    const getIconForType = (type: IntakeFormField["type"]) => {
        switch (type) {
            case "text": return <Type className="h-4 w-4" />;
            case "textarea": return <FileText className="h-4 w-4" />;
            case "checkbox": return <CheckSquare className="h-4 w-4" />;
            case "select": return <List className="h-4 w-4" />;
            default: return <Type className="h-4 w-4" />;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12 bg-white rounded-xl shadow-lg">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <Card className="border-none shadow-lg overflow-hidden">
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
                            <FileText className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Intake Form Questions</h3>
                            <p className="text-sm text-slate-500">Customize the questions patients answer during booking</p>
                        </div>
                    </div>
                    <Button
                        onClick={addField}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Add Question
                    </Button>
                </div>

                <div className="space-y-4">
                    {fields.length === 0 ? (
                        <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                            <FileText className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500 font-medium">No questions added yet</p>
                            <p className="text-slate-400 text-sm mt-1">Click "Add Question" to start building your form</p>
                        </div>
                    ) : (
                        fields.map((field) => (
                            <div
                                key={field.id}
                                className="group bg-white border border-slate-200 rounded-xl p-4 transition-all duration-200 hover:shadow-md hover:border-indigo-200 flex items-start gap-4"
                            >
                                <div className="mt-3 text-slate-300 cursor-move hover:text-indigo-400 transition-colors">
                                    <GripVertical className="h-5 w-5" />
                                </div>

                                <div className="flex-1 space-y-4">
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <div className="flex-1">
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
                                                Question Label
                                            </label>
                                            <input
                                                type="text"
                                                value={field.label}
                                                onChange={(e) => updateField(field.id, { label: e.target.value })}
                                                className="w-full font-medium text-slate-700 border-none p-0 focus:ring-0 placeholder:text-slate-300 text-lg bg-transparent"
                                                placeholder="Enter your question here..."
                                            />
                                        </div>
                                        <div className="w-full md:w-48">
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
                                                Answer Type
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-2.5 text-slate-400 pointer-events-none">
                                                    {getIconForType(field.type)}
                                                </div>
                                                <select
                                                    value={field.type}
                                                    onChange={(e) => updateField(field.id, { type: e.target.value as IntakeFormField["type"] })}
                                                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none appearance-none cursor-pointer hover:bg-white transition-colors"
                                                >
                                                    <option value="text">Short Text</option>
                                                    <option value="textarea">Long Text</option>
                                                    <option value="select">Dropdown Selection</option>
                                                    <option value="checkbox">Checkbox</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Options for Select Type */}
                                    {field.type === "select" && (
                                        <div className="pl-4 border-l-2 border-indigo-100 bg-indigo-50/30 p-3 rounded-r-lg">
                                            <label className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2 block">
                                                Dropdown Options
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {field.options?.map((opt, idx) => (
                                                    <span key={idx} className="bg-white border border-indigo-100 text-indigo-700 px-2 py-1 rounded-md text-sm font-medium shadow-sm">
                                                        {opt}
                                                    </span>
                                                ))}
                                                <button
                                                    className="px-2 py-1 rounded-md text-sm font-medium text-indigo-500 border border-dashed border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-400 transition-colors"
                                                    onClick={() => {
                                                        const newOpt = prompt("Enter option name:");
                                                        if (newOpt) {
                                                            const currentOpts = field.options || [];
                                                            updateField(field.id, { options: [...currentOpts, newOpt] });
                                                        }
                                                    }}
                                                >
                                                    + Add Option
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-2 flex items-center justify-between border-t border-slate-50">
                                        <label className="flex items-center gap-2 cursor-pointer group/req">
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${field.required ? 'bg-indigo-500 border-indigo-500' : 'bg-white border-slate-300 group-hover/req:border-indigo-400'}`}>
                                                {field.required && <CheckSquare className="h-3.5 w-3.5 text-white" />}
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={field.required}
                                                onChange={(e) => updateField(field.id, { required: e.target.checked })}
                                            />
                                            <span className={`text-sm font-medium transition-colors ${field.required ? 'text-indigo-700' : 'text-slate-600'}`}>
                                                Required Field
                                            </span>
                                        </label>

                                        <button
                                            onClick={() => removeField(field.id)}
                                            className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                            title="Remove Question"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="mt-6 flex justify-end">
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-900/10 flex items-center gap-2"
                    >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {saving ? "Saving..." : "Save Form"}
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default IntakeFormBuilder;
