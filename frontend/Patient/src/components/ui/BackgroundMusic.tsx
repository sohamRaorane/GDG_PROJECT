import { useState, useRef, useEffect } from 'react';
import { Music, Volume2, VolumeX } from 'lucide-react';
import musicFile from '../../assets/Calming_Meditation.mp3';

export const BackgroundMusic = () => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false); // Default to false initially to avoid auto-play blocking issues until user interacts
    const [isMuted, setIsMuted] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);

    useEffect(() => {
        // Attempt to play on mount
        const audio = audioRef.current;
        if (!audio) return;

        audio.loop = true;
        audio.volume = 0.4; // Set a gentle initial volume

        // Try to play automatically
        const playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                setIsPlaying(true);
            }).catch((error) => {
                // Auto-play was prevented
                console.log("Auto-play prevented:", error);
                setIsPlaying(false);
            });
        }
    }, []);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play().catch(e => console.error("Play failed:", e));
        }
        setIsPlaying(!isPlaying);
        setHasInteracted(true);
    };

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering the parent click if buttons overlap
        const audio = audioRef.current;
        if (!audio) return;

        audio.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-2 group">
            <audio ref={audioRef} src={musicFile} />

            {/* Main Music Control Button */}
            <button
                onClick={togglePlay}
                className={`
                    w-12 h-12 rounded-full shadow-lg backdrop-blur-md border border-white/20
                    flex items-center justify-center transition-all duration-300
                    ${isPlaying
                        ? 'bg-primary/80 text-white animate-[spin_10s_linear_infinite]'
                        : 'bg-white/80 text-primary hover:bg-white'
                    }
                `}
                title={isPlaying ? "Pause Music" : "Play Music"}
            >
                <Music size={20} className={isPlaying ? "" : "ml-0.5"} />
            </button>

            {/* Mute/Volume (Visible on hover of group or when playing) */}
            <div className={`
                absolute bottom-14 transition-all duration-300 transform
                ${isPlaying || hasInteracted ? 'translate-y-0 opacity-0 group-hover:opacity-100 group-hover:translate-y-[-5px]' : 'translate-y-2 opacity-0 pointer-events-none'}
             `}>
                <button
                    onClick={toggleMute}
                    className="w-8 h-8 rounded-full bg-slate-800/80 text-white flex items-center justify-center shadow-md hover:bg-slate-700 transition-colors"
                    title={isMuted ? "Unmute" : "Mute"}
                >
                    {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
            </div>
        </div>
    );
};
