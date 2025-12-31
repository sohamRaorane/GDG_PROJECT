import { useState } from "react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import { Plus, Trash2, GripVertical } from "lucide-react";

interface Question {
    id: number;
    text: string;
    type: "text" | "select" | "checkbox";
    required: boolean;
    options?: string[]; // For select type
}

const IntakeFormBuilder = () => {
    const [questions, setQuestions] = useState<Question[]>([
        { id: 1, text: "Reason for visit?", type: "text", required: true },
    ]);

    const addQuestion = () => {
        setQuestions([
            ...questions,
            { id: Date.now(), text: "", type: "text", required: false },
        ]);
    };

    const updateQuestion = (id: number, field: keyof Question, value: any) => {
        setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
    };

    const removeQuestion = (id: number) => {
        setQuestions(questions.filter(q => q.id !== id));
    };

    return (
        <Card title="Booking Intake Form" description="Add questions for the user to answer during booking.">
            <div className="space-y-4">
                {questions.map((q) => (
                    <div key={q.id} className="group relative flex items-start gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 transition-all hover:shadow-sm">
                        <div className="mt-3 cursor-move text-slate-400 hover:text-slate-600">
                            <GripVertical className="h-5 w-5" />
                        </div>

                        <div className="flex-1 space-y-3">
                            <input
                                type="text"
                                placeholder="Question Text"
                                className="w-full border-b border-transparent bg-transparent text-lg font-medium placeholder-slate-400 focus:border-deep-forest focus:outline-none"
                                value={q.text}
                                onChange={(e) => updateQuestion(q.id, "text", e.target.value)}
                            />

                            <div className="flex items-center gap-4">
                                <select
                                    value={q.type}
                                    onChange={(e) => updateQuestion(q.id, "type", e.target.value)}
                                    className="rounded border border-slate-300 px-2 py-1 text-sm text-slate-600 focus:border-deep-forest focus:outline-none"
                                >
                                    <option value="text">Text Input</option>
                                    <option value="select">Dropdown Selection</option>
                                    <option value="checkbox">Checkbox</option>
                                </select>

                                <label className="flex items-center gap-2 text-sm text-slate-600">
                                    <input
                                        type="checkbox"
                                        checked={q.required}
                                        onChange={(e) => updateQuestion(q.id, "required", e.target.checked)}
                                        className="rounded border-slate-300 text-deep-forest focus:ring-deep-forest"
                                    />
                                    Required
                                </label>
                            </div>
                        </div>

                        <button
                            onClick={() => removeQuestion(q.id)}
                            className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 className="h-5 w-5" />
                        </button>
                    </div>
                ))}

                <Button variant="outline" onClick={addQuestion} className="w-full border-dashed">
                    <Plus className="mr-2 h-4 w-4" /> Add Question
                </Button>
            </div>
            <div className="mt-6 flex justify-end">
                <Button>Save Form</Button>
            </div>
        </Card>
    );
};

export default IntakeFormBuilder;
