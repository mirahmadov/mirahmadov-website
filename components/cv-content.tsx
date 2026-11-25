import { cv } from "@/lib/cv";

const link = "underline decoration-[#2b2620]/25 underline-offset-4 transition-colors hover:decoration-[#2b2620]";

// The paper sheet, shared by the panel on / and the /cv page.
export default function CvContent() {
    return (
        <article className="font-serif text-[15px] leading-relaxed text-[#2b2620]">
            <h1 className="text-2xl">{cv.name}</h1>
            <p className="mt-2 text-[#2b2620]/70">
                Works at{" "}
                <a className={link} href={cv.nexuraUrl} target="_blank" rel="noreferrer">
                    Nexura
                </a>
                .
            </p>
            <p className="mt-8 flex gap-6">
                {cv.links.map((l) => (
                    <a key={l.label} className={link} href={l.url} target="_blank" rel="noreferrer">
                        {l.label}
                    </a>
                ))}
            </p>
        </article>
    );
}
