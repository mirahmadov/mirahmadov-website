import type { Metadata } from "next";
import Link from "next/link";
import CvContent from "@/components/cv-content";
import { cv } from "@/lib/cv";

export const metadata: Metadata = {
    title: `${cv.name} · CV`,
    description: `${cv.name} works at Nexura.`,
};

export default function CvPage() {
    return (
        <main className="min-h-dvh bg-[#f4efe6] px-4 py-12 sm:py-20 print:p-0">
            <div className="mx-auto max-w-xl">
                <CvContent />
                <Link href="/" className="mt-12 inline-block font-serif text-sm text-[#2b2620]/50 hover:text-[#2b2620] print:hidden">
                    ← back to the quiet place
                </Link>
            </div>
        </main>
    );
}
