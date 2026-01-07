
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
dotenv.config();


const API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyDlotWPwtaNmy0PeN32hQeJrTvgqbMdZUI';
const MODELS_TO_TEST = ['gemini-1.5-flash', 'gemini-2.0-flash-lite-001'];

async function testGemini() {
    console.log(`Testing Gemini API with Key Length: ${API_KEY.length}`);

    for (const modelName of MODELS_TO_TEST) {
        console.log(`\nTesting Model: ${modelName}`);
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: modelName });

        try {
            const result = await model.generateContent("Say 'Hello'");
            const response = await result.response;
            console.log(`SUCCESS [${modelName}]: ${response.text().trim()}`);
        } catch (error: any) {
            console.error(`FAILURE [${modelName}]: ${error.message}`);
        }
    }
}

testGemini();

