export const confetti = () => {
    // Simple confetti effect using CSS animations
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background-color: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            top: -10px;
            opacity: 1;
            transform: rotate(${Math.random() * 360}deg);
            animation: confetti-fall ${2 + Math.random() * 2}s linear forwards;
            pointer-events: none;
            z-index: 9999;
        `;

        document.body.appendChild(confetti);

        setTimeout(() => {
            confetti.remove();
        }, 4000);
    }
};

// Add CSS animation if not already present
if (typeof document !== 'undefined' && !document.getElementById('confetti-styles')) {
    const style = document.createElement('style');
    style.id = 'confetti-styles';
    style.innerHTML = `
        @keyframes confetti-fall {
            to {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

export const staggeredReveal = (delay: number = 100) => {
    return {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: delay / 1000, duration: 0.4 }
    };
};
