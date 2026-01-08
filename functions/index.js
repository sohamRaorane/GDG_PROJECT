const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Firestore trigger
exports.checkPatientVitals = functions.firestore
  .document('health_logs/{logId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    if (!data) return null;

    const { painLevel, userId, digestionQuality, mentalState } = data;

    if (painLevel >= 8) {
      console.log(`CRITICAL: High pain level (${painLevel}) reported by user ${userId}`);
      await admin.messaging().sendToTopic('doctors', {
        notification: {
          title: 'URGENT: High Pain Reported',
          body: `Patient ${userId.slice(-6)} reported pain level ${painLevel}. Please check the dashboard.`,
        },
        data: {
          type: 'RED_FLAG',
          patientId: userId,
          logId: context.params.logId,
        },
      });

      await admin.firestore().collection('notifications').add({
        userId: userId,
        title: 'Medical Alert Sent',
        message: 'Dr. Sharma has been notified about your pain level. A nurse will reach out shortly.',
        type: 'post',
        appointmentId: 'emergency',
        isRead: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    if (painLevel <= 2 && digestionQuality === 'Excellent' && mentalState === 'Calm') {
      await admin.firestore().collection('notifications').add({
        userId: userId,
        title: 'Amazing Progress!',
        message: 'Your vitals look fantastic today. You are 20% closer to your healing goal. Keep it up!',
        type: 'post',
        appointmentId: 'progress',
        isRead: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    return null;
  });

// AI proxy (Express)
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

let GEN_AI_KEY = '';
try {
  const cfg = functions.config && functions.config().genai;
  const cfgKey = cfg && cfg.key ? cfg.key : '';
  GEN_AI_KEY = cfgKey || process.env.GEN_AI_API_KEY || process.env.GEMINI_API_KEY;
} catch (e) {
  GEN_AI_KEY = process.env.GEN_AI_API_KEY || process.env.GEMINI_API_KEY || '';
}

if (!GEN_AI_KEY) {
  console.warn('GEN_AI_API_KEY is not set (checked functions.config and env). AI proxy will return an error.');
}

const genAI = GEN_AI_KEY ? new GoogleGenerativeAI(GEN_AI_KEY) : null;

const MODEL_CANDIDATES = [
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-pro',
];
const API_VERSIONS = ['v1beta', 'v1'];

app.post('/generate', async (req, res) => {
  const { history, nextMessage } = req.body || {};
  if (!genAI) return res.status(500).json({ error: 'AI API key not configured on server.' });
  if (!nextMessage) return res.status(400).json({ error: 'nextMessage is required.' });

  const safeHistory = Array.isArray(history) ? history : [];
  let detailedErrors = [];

  for (const version of API_VERSIONS) {
    for (const candidate of MODEL_CANDIDATES) {
      try {
        const model = genAI.getGenerativeModel({ model: candidate }, { apiVersion: version });
        const chat = model.startChat({ history: safeHistory, generationConfig: { maxOutputTokens: 600 } });
        const result = await chat.sendMessage(nextMessage);
        const response = await result.response;
        return res.json({ text: response.text() });
      } catch (err) {
        const msg = err && err.message ? err.message : String(err);
        detailedErrors.push(`[${version}] ${candidate}: ${msg}`);
        console.warn(`Model "${candidate}" on ${version} failed:`, msg);
      }
    }
  }

  return res.status(404).json({
    error: 'No compatible AI model found for this project.',
    details: detailedErrors.join(' | ')
  });
});

exports.aiProxy = functions.https.onRequest(app);
