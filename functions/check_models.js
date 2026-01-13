const https = require('https');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error('ERROR: GEMINI_API_KEY is not set in .env file');
    console.error('Please add GEMINI_API_KEY=your_api_key to functions/.env');
    process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.error) {
                console.log("API Error: " + json.error.message);
            } else {
                const names = json.models.map(m => m.name); // e.g. "models/gemini-pro"

                const targets = [
                    "models/gemini-1.5-flash",
                    "models/gemini-1.5-flash-001",
                    "models/gemini-pro",
                    "models/gemini-1.0-pro",
                    "models/gemini-1.5-flash-8b"
                ];

                console.log("Checking for models:");
                targets.forEach(t => {
                    const found = names.includes(t);
                    console.log(`${t}: ${found ? "FOUND" : "NOT FOUND"}`);
                });

                // Also print any gemini model found
                console.log("\nAll Gemini Models Found:");
                names.filter(n => n.includes("gemini") && !n.includes("embedding")).forEach(n => console.log(n));
            }
        } catch (e) {
            console.log("Parse Error: " + e.message);
        }
    });
}).on('error', (err) => {
    console.log("Network Error: " + err.message);
});
