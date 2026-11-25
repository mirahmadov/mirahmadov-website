"use client";

import { useEffect, useRef, useState } from "react";

const FADE_MS = 2500;
const fmt = (s: number) => (Number.isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}` : "--:--");

// Rain recording player. preload="metadata" fetches only the header (for the duration);
// the audio itself streams once play is pressed.
export default function RainPlayer() {
    const audioRef = useRef<HTMLAudioElement>(null);
    const fadeRef = useRef<ReturnType<typeof setInterval>>(undefined);
    const [playing, setPlaying] = useState(false);
    const [time, setTime] = useState(0);
    const [duration, setDuration] = useState(NaN);

    useEffect(() => () => clearInterval(fadeRef.current), []);

    // Volume fade (ignored on iOS, where volume is read-only; it just starts/stops there).
    const fade = (to: number, done?: () => void) => {
        const a = audioRef.current!;
        clearInterval(fadeRef.current);
        const from = a.volume;
        const start = performance.now();
        fadeRef.current = setInterval(() => {
            const k = Math.min(1, (performance.now() - start) / FADE_MS);
            a.volume = from + (to - from) * k;
            if (k === 1) {
                clearInterval(fadeRef.current);
                done?.();
            }
        }, 50);
    };

    const toggle = () => {
        const a = audioRef.current!;
        if (playing) {
            setPlaying(false);
            fade(0, () => a.pause());
        } else {
            setPlaying(true);
            a.volume = 0;
            a.play()
                .then(() => fade(1))
                .catch((e) => {
                    console.warn("rain sound failed to play", e);
                    setPlaying(false);
                });
        }
    };

    return (
        <div className="absolute right-4 bottom-4 flex items-center gap-3 rounded-full bg-black/30 py-1 pr-4 pl-1 text-white/85 shadow-lg">
            <audio
                ref={audioRef}
                src="/rain-full.m4a"
                preload="metadata"
                loop
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
            />
            <button
                onClick={toggle}
                aria-label={playing ? "Pause rain" : "Play rain"}
                className="flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-500 hover:bg-white/10 hover:text-white"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    {playing ? <path d="M7 5h3v14H7zM14 5h3v14h-3z" /> : <path d="M8 5v14l11-7z" />}
                </svg>
            </button>
            <input
                type="range"
                aria-label="Rain position"
                min={0}
                max={Number.isFinite(duration) ? duration : 0}
                step={1}
                value={time}
                onChange={(e) => {
                    const t = Number(e.target.value);
                    audioRef.current!.currentTime = t;
                    setTime(t);
                }}
                className="h-1 w-24 cursor-pointer accent-white sm:w-40"
            />
            <span className="text-xs tabular-nums text-white/70">
                {fmt(time)} / {fmt(duration)}
            </span>
        </div>
    );
}
