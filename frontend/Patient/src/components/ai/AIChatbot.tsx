import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, User, Bot, Loader2 } from 'lucide-react';
import { getChatResponse } from '../../services/gemini';

interface Message {
    role: 'user' | 'model';
    parts: { text: string }[];
}

export const AIChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            role: 'user',
            parts: [{ text: input }]
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const history = [...messages, userMessage].map(m => ({ role: m.role, parts: m.parts }));
            const aiResponse = await getChatResponse(history, input);

            const modelMessage: Message = {
                role: 'model',
                parts: [{ text: aiResponse }]
            };

            setMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            console.error("Chat error:", error);
            const errorMessage: Message = {
                role: 'model',
                parts: [{ text: "I'm having trouble connecting to the server. Please check your internet connection." }]
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-8 right-8 z-50 bg-primary text-white p-4 rounded-full shadow-2xl hover:bg-primary-hover transition-all flex items-center gap-2 group"
            >
                <div className="relative">
                    <Sparkles className="animate-pulse" size={24} />
                    <div className="absolute inset-0 bg-white/20 rounded-full blur-md animate-ping"></div>
                </div>
                {/* <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-bold whitespace-nowrap">AyurBot</span> */}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.8 }}
                        className="fixed bottom-28 right-8 z-50 w-[400px] h-[600px] bg-white/80 backdrop-blur-xl rounded-[32px] shadow-2xl border border-white/20 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 bg-primary text-white flex items-center justify-between shadow-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                                    <Bot size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg leading-tight">AyurBot</h3>
                                    <div className="text-[10px] text-white/70 uppercase tracking-widest font-black flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse inline-block" aria-hidden="true" />
                                        <span>AI Health Assistant</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
                            {messages.map((m, i) => (
                                <motion.div
                                    initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={i}
                                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[80%] p-4 rounded-2xl flex gap-3 ${m.role === 'user'
                                        ? 'bg-primary text-white rounded-tr-none'
                                        : 'bg-slate-100 text-slate-800 rounded-tl-none'
                                        }`}>
                                        <div className="shrink-0 mt-1">
                                            {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                                        </div>
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.parts[0].text}</p>
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-slate-100 text-slate-800 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                                        <Loader2 size={16} className="animate-spin text-primary" />
                                        <span className="text-xs font-medium text-slate-500">AyurBot is thinking...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-6 bg-slate-50/50 border-t border-slate-100">
                            <div className="relative flex items-center gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask about Shirodhara, Abhyanga..."
                                    className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all pr-12"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={isLoading || !input.trim()}
                                    className="absolute right-2 p-3 bg-primary text-white rounded-xl hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                            <p className="text-[10px] text-center text-slate-400 mt-4 leading-relaxed">
                                AyurBot is an AI assistant. Consult a doctor for medical advice.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
