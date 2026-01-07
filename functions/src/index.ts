import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

/**
 * checkPatientVitals
 * Triggers on creation of a new health log.
 * Analyzes pain level and other metrics to determine if a "Red Flag" should be raised.
 */
export const checkPatientVitals = functions.firestore
    .document('health_logs/{logId}')
    .onCreate(async (snap, context) => {
        const data = snap.data();
        if (!data) return null;

        const { painLevel, userId, digestionQuality, mentalState } = data;

        // 1. Check for High Pain (Red Flag)
        if (painLevel >= 8) {
            console.log(`CRITICAL: High pain level (${painLevel}) reported by user ${userId}`);

            // Logic to send notification to Doctor
            // In a real app, this would use FCM or an SMS service like Twilio
            await admin.messaging().sendToTopic('doctors', {
                notification: {
                    title: 'URGENT: High Pain Reported',
                    body: `Patient ${userId.slice(-6)} reported pain level ${painLevel}. Please check the dashboard.`,
                },
                data: {
                    type: 'RED_FLAG',
                    patientId: userId,
                    logId: context.params.logId
                }
            });

            // Reassurance to Patient
            await admin.firestore().collection('notifications').add({
                userId: userId,
                title: 'Medical Alert Sent',
                message: 'Dr. Sharma has been notified about your pain level. A nurse will reach out shortly.',
                type: 'post',
                appointmentId: 'emergency', // Mock ID
                isRead: false,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });
        }

        // 2. Trend Analysis (Close the loop)
        // If everything is excellent, send positive reinforcement
        if (painLevel <= 2 && digestionQuality === 'Excellent' && mentalState === 'Calm') {
            await admin.firestore().collection('notifications').add({
                userId: userId,
                title: 'Amazing Progress!',
                message: 'Your vitals look fantastic today. You are 20% closer to your healing goal. Keep it up!',
                type: 'post',
                appointmentId: 'progress',
                isRead: false,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });
        }

        return null;
    });

// --- AI Proxy Endpoint (server-side) ---
import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Prefer Firebase Functions config if set (functions.config().genai.key), otherwise fall back to env var
let GEN_AI_KEY = '';
try {
    const cfgKey = (functions.config && (functions.config() as any).genai && (functions.config() as any).genai.key) || '';
    GEN_AI_KEY = cfgKey || process.env.GEN_AI_API_KEY || process.env.GEMINI_API_KEY;
} catch (e) {
    GEN_AI_KEY = process.env.GEN_AI_API_KEY || process.env.GEMINI_API_KEY || '';
}

console.log("DEBUG: Env Keys:", Object.keys(process.env));
console.log("DEBUG: GEN_AI_KEY length:", GEN_AI_KEY ? GEN_AI_KEY.length : 0);

if (!GEN_AI_KEY) {
    console.warn('GEN_AI_API_KEY is not set (checked functions.config and env). AI proxy will return an error.');
}

const genAI = GEN_AI_KEY ? new GoogleGenerativeAI(GEN_AI_KEY) : null;

// Use Gemini 1.5 flash to avoid the 2.0 free-tier quota if configured
const MODEL_NAME = 'gemini-1.5-flash';

app.post('/generate', async (req, res) => {
    const { history, nextMessage } = req.body as { history?: any[]; nextMessage?: string };
    if (!genAI) return res.status(500).json({ error: 'AI API key not configured on server.' });
    if (!nextMessage) return res.status(400).json({ error: 'nextMessage is required.' });

    const safeHistory = Array.isArray(history) ? history : [];

    try {
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });
        const chat = model.startChat({ history: safeHistory });
        const result = await chat.sendMessage(nextMessage);
        const response = await result.response;
        return res.json({ text: response.text() });
    } catch (err: any) {
        console.error(`Gemini Error on ${MODEL_NAME}:`, err);
        const status = err?.status || 500;

        // If quota/rate-limit is exceeded, advise client with Retry-After and helpful links
        if (status === 429) {
            // Prefer an explicit retry delay if provided by the error, otherwise fall back to 30s
            const retrySeconds = (() => {
                try {
                    const rd = err?.details?.[0]?.retryDelay || err?.retryDelay || err?.response?.retryDelay;
                    if (typeof rd === 'string') {
                        const m = rd.match(/(\d+)(?:\.?\d*)/);
                        if (m) return Number(m[1]);
                    }
                } catch (e) {}
                return 30;
            })();

            res.set('Retry-After', String(retrySeconds));
            return res.status(429).json({
                error: 'AI Generation Failed - quota exceeded',
                details: err?.message || String(err),
                retryAfterSeconds: retrySeconds,
                helpUrl: 'https://ai.google.dev/gemini-api/docs/rate-limits'
            });
        }

        return res.status(status).json({
            error: 'AI Generation Failed',
            details: err?.message || String(err),
            code: status
        });
    }
});

export const aiProxy = functions.https.onRequest(app);
