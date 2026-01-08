export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                admin: {
                    sidebar: '#0F172A', // Abyss Slate
                    active: '#1C4E46',  // Mountain Pine
                    bg: '#F8FAFC',      // Ice Sheet
                    surface: '#FFFFFF', // Pure White
                    text: '#334155',    // Deep Steel
                    muted: '#64748B',   // Glacier Grey
                    border: '#E2E8F0',  // Subtle Border
                    success: '#0F766E', // Series A
                    info: '#0EA5E9',    // Series B
                    alert: '#6366F1',   // Series C
                    critical: '#EF4444',// Critical Alert
                }
            }
        }
    },
    plugins: [],
}
