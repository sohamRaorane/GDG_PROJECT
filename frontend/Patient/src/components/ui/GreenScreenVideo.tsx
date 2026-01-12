import React, { useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';

interface GreenScreenVideoProps {
    src: string;
    className?: string;
    width?: number;
    height?: number;
    threshold?: number; // Sensitivity for green removal
}

export const GreenScreenVideo: React.FC<GreenScreenVideoProps> = ({
    src,
    className,
    width = 300,
    height = 600,
    threshold = 90
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number>();

    useEffect(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        const processFrame = () => {
            if (video.paused || video.ended) return;

            // Draw video to canvas
            ctx.drawImage(video, 0, 0, width, height);

            // Get standard frame data
            const frame = ctx.getImageData(0, 0, width, height);
            const data = frame.data;
            const len = data.length;

            // Chroma Key Logic
            // Iterate over every pixel (R, G, B, A)
            for (let i = 0; i < len; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];

                // Simple Green Screen Algorithm
                // If Green is dominant and significantly brighter than Red and Blue
                // Standard green screen green is roughly (0, 177, 64) or similar pure greens

                // Condition: Green is larger than Red and Blue combined/averaged or just dominant
                // Adjust numbers based on the specific shade of green
                if (g > threshold && g > (r + b) * 0.95) {
                    // Make it transparent
                    data[i + 3] = 0;

                    // Optional: Smooth edges by setting semi-transparency for edge cases
                    // But for simple smoke, hard cut usually works if contrast is high
                }
            }

            // Put modified data back
            ctx.putImageData(frame, 0, 0);

            requestRef.current = requestAnimationFrame(processFrame);
        };

        const onPlay = () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            processFrame();
        };

        video.addEventListener('play', onPlay);

        // Force play if possible
        video.play().catch(e => console.log("Auto-play prevented (smoke)", e));

        return () => {
            video.removeEventListener('play', onPlay);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [src, width, height, threshold]);

    return (
        <div className={cn("relative pointer-events-none select-none", className)}>
            <video
                ref={videoRef}
                src={src}
                className="hidden"
                muted
                loop
                playsInline
                width={width}
                height={height}
                crossOrigin="anonymous"
            />
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                className="w-full h-full object-cover"
            />
        </div>
    );
};
