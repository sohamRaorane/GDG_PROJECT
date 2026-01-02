const PROXY_URL = import.meta.env.VITE_AI_PROXY_URL || '/api/generate';

export const getChatResponse = async (history: { role: "user" | "model"; parts: { text: string }[] }[], nextMessage: string) => {
    try {
        const resp = await fetch(PROXY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ history, nextMessage }),
        });

        if (!resp.ok) {
            const text = await resp.text();
            console.error('AI proxy error:', resp.status, text);
            return "I'm having a bit of trouble connecting to my healing wisdom right now. Please try again in a moment.";
        }

        const data = await resp.json();
        return data?.text || "I'm having a bit of trouble connecting to my healing wisdom right now. Please try again in a moment.";
    } catch (err) {
        console.error('AI proxy fetch failed:', err);
        return "I'm having a bit of trouble connecting to my healing wisdom right now. Please try again in a moment.";
    }
};
