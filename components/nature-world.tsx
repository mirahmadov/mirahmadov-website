"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import CvContent from "./cv-content";
import NatureParticles from "./nature-particles";
import RainPlayer from "./rain-player";

export type Mood = "day" | "sunset" | "night";

const moodFromHour = (h: number): Mood => (h >= 6 && h < 17 ? "day" : h >= 17 && h < 20 ? "sunset" : "night");

// One plain tint per mood on top of the already-rainy picture: no blend modes, no backdrop blur.
const TINT: Record<Mood, string> = {
    day: "rgba(0, 0, 0, 0)",
    sunset: "rgba(35, 22, 30, 0.2)",
    night: "rgba(5, 10, 25, 0.4)",
};

export default function NatureWorld() {
    // Mood depends on the visitor's clock, so it is set after mount to avoid a hydration mismatch.
    const [mood, setMood] = useState<Mood | null>(null);
    const cvRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const tick = () => setMood(moodFromHour(new Date().getHours()));
        tick();
        const id = setInterval(tick, 60_000);
        return () => clearInterval(id);
    }, []);

    return (
        <main className="relative h-dvh w-screen overflow-hidden bg-[#0b0f14]">
            <Image
                src="/rain-photo.webp"
                alt=""
                fill
                priority
                sizes="100vw"
                className="drift object-cover"
            />

            <div
                className="pointer-events-none absolute inset-0 transition-[background-color] duration-[3000ms]"
                style={{ backgroundColor: mood ? TINT[mood] : "rgba(11, 15, 20, 1)" }}
            />

            {mood && <NatureParticles mood={mood} />}

            <button
                onClick={() => cvRef.current?.showModal()}
                className="absolute top-4 left-4 rounded-full bg-black/30 px-4 py-2 text-sm tracking-widest text-white/85 shadow-lg transition-colors duration-700 hover:bg-black/45 hover:text-white"
            >
                mirahmadov
            </button>

            {/* Native dialog: Escape, focus trap and backdrop for free. Click on the backdrop closes it. */}
            <dialog
                ref={cvRef}
                className="cv-sheet"
                aria-label="CV"
                onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
            >
                <div className="px-6 py-10">
                    <CvContent />
                </div>
            </dialog>

            <RainPlayer />
        </main>
    );
}
