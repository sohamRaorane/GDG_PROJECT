import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import backgroundMusic from '../assets/Calming_Meditation.mp3';

interface AudioContextType {
    isPlaying: boolean;
    toggleAudio: () => void;
    volume: number;
    setVolume: (volume: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Default to true, or load from localStorage if you prefer persistence across sessions
    const [isPlaying, setIsPlaying] = useState<boolean>(() => {
        const saved = localStorage.getItem('bg_audio_playing');
        return saved !== null ? JSON.parse(saved) : true;
    });
    const [volume, setVolume] = useState(0.5);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Save preference
        localStorage.setItem('bg_audio_playing', JSON.stringify(isPlaying));

        if (audioRef.current) {
            if (isPlaying) {
                // Play with catch for autoplay policies
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.log("Autoplay prevented:", error);
                        // Optional: setIsPlaying(false) if we want to reflect reality, 
                        // but keeping it true allows it to start on next interaction
                    });
                }
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    // Fade in effect on mount
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0;
            let vol = 0;
            const interval = setInterval(() => {
                if (vol < volume) {
                    vol += 0.05;
                    audioRef.current!.volume = Math.min(vol, volume);
                } else {
                    clearInterval(interval);
                }
            }, 200);
            return () => clearInterval(interval);
        }
    }, []);

    const toggleAudio = () => {
        setIsPlaying(prev => !prev);
    };

    return (
        <AudioContext.Provider value={{ isPlaying, toggleAudio, volume, setVolume }}>
            <audio
                ref={audioRef}
                src={backgroundMusic}
                loop
                style={{ display: 'none' }}
            />
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (context === undefined) {
        throw new Error('useAudio must be used within an AudioProvider');
    }
    return context;
};
