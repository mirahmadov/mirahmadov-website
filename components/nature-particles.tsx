"use client";

import { useEffect, useRef } from "react";
import type { Mood } from "./nature-world";

// Soft, slanted rain. Pauses when the tab is hidden; off for reduced-motion users.
export default function NatureParticles({ mood }: { mood: Mood }) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        let w = 0;
        let h = 0;
        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = window.innerWidth;
            h = window.innerHeight;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();
        window.addEventListener("resize", resize);

        // Fewer drops on small screens so density looks the same.
        const count = Math.round(Math.min(140, (w * h) / 12000));
        const drops = Array.from({ length: count }, () => {
            const z = 0.4 + Math.random() * 0.6; // depth: far drops are shorter, slower, fainter
            return { x: Math.random() * w, y: Math.random() * h, z };
        });
        const SLANT = -0.18;
        ctx.strokeStyle = mood === "night" ? "rgb(170, 185, 215)" : "rgb(200, 215, 235)";
        ctx.lineWidth = 1;
        ctx.lineCap = "round";

        let raf = 0;
        const draw = () => {
            ctx.clearRect(0, 0, w, h);
            for (const d of drops) {
                const speed = 9 * d.z;
                const len = 16 * d.z;
                d.y += speed;
                d.x += speed * SLANT;
                if (d.y > h) {
                    d.y = -len;
                    d.x = Math.random() * (w + 100);
                }
                ctx.globalAlpha = 0.12 + 0.2 * d.z;
                ctx.beginPath();
                ctx.moveTo(d.x, d.y);
                ctx.lineTo(d.x - len * SLANT, d.y - len);
                ctx.stroke();
            }
            raf = requestAnimationFrame(draw);
        };
        const onVisibility = () => {
            cancelAnimationFrame(raf);
            if (!document.hidden) raf = requestAnimationFrame(draw);
        };
        document.addEventListener("visibilitychange", onVisibility);
        raf = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", resize);
            document.removeEventListener("visibilitychange", onVisibility);
        };
    }, [mood]);

    return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />;
}
