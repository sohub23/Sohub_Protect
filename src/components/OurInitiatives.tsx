import { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';

interface Initiative {
    id: string;
    name: string;
    description: string;
    logo: string;
    href: string | null;
    order: number;
    isActive: boolean;
}

const BASE_URL = 'https://sohub.com.bd';
const CURRENT_SITE_ID = 'protect';

/* ──────────────────────────────────────────────
   DESKTOP VERSION
   ────────────────────────────────────────────── */
const DesktopOurInitiatives = ({ initiatives }: { initiatives: Initiative[] }) => {
    return (
        <section id="initiatives" className="py-20 bg-[#f8f9fa] relative overflow-hidden">
            <div className="section-container relative z-10">
                {/* Header */}
                <div className="text-center mb-14">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
                        Our Initiatives
                    </h2>
                </div>

                {/* Grid — 4 columns */}
                <div className="max-w-[1200px] mx-auto grid grid-cols-4 gap-5">
                    {initiatives.map((item) => {
                        const isCurrent = item.id === CURRENT_SITE_ID;

                        const CardContent = (
                            <>
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <img
                                        src={`${BASE_URL}${item.logo}`}
                                        alt={item.name}
                                        className="w-12 h-12 object-contain flex-shrink-0"
                                    />
                                    <span className="text-[16px] font-medium text-[#3c4043] truncate">
                                        {item.name}
                                    </span>
                                </div>
                                {item.href && !isCurrent && (
                                    <ExternalLink className="w-5 h-5 text-[#9aa0a6] flex-shrink-0 group-hover:text-[#5f6368] transition-colors" />
                                )}
                            </>
                        );

                        return (
                            <div key={item.id}>
                                {isCurrent ? (
                                    <a
                                        href="/"
                                        className="group flex items-center gap-4 bg-white border border-[#e8eaed] rounded-2xl px-6 py-5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:border-primary/30 transition-all duration-200 cursor-pointer"
                                    >
                                        {CardContent}
                                    </a>
                                ) : item.href ? (
                                    <a
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex items-center gap-4 bg-white border border-[#e8eaed] rounded-2xl px-6 py-5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:border-primary/30 transition-all duration-200 cursor-pointer"
                                    >
                                        {CardContent}
                                    </a>
                                ) : (
                                    <div className="flex items-center gap-4 bg-white border border-[#e8eaed] rounded-2xl px-6 py-5">
                                        {CardContent}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

/* ──────────────────────────────────────────────
   MOBILE VERSION
   ────────────────────────────────────────────── */
const MobileOurInitiatives = ({ initiatives }: { initiatives: Initiative[] }) => {
    return (
        <section id="initiatives" className="py-10 bg-[#f8f9fa]">
            <div className="px-4">
                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
                        Our Initiatives
                    </h2>
                </div>

                {/* List — single column */}
                <div className="flex flex-col gap-2">
                    {initiatives.map((item) => {
                        const isCurrent = item.id === CURRENT_SITE_ID;

                        const CardContent = (
                            <div className="flex items-center w-full px-4 py-4">
                                <img
                                    src={`${BASE_URL}${item.logo}`}
                                    alt={item.name}
                                    className="w-10 h-10 object-contain flex-shrink-0"
                                />
                                <span className="text-[15px] font-medium text-[#3c4043] ml-4 flex-1 truncate">
                                    {item.name}
                                </span>
                                {item.href && !isCurrent && (
                                    <ExternalLink className="w-[18px] h-[18px] text-[#9aa0a6] flex-shrink-0 ml-3" />
                                )}
                            </div>
                        );

                        return isCurrent ? (
                            <a
                                key={item.id}
                                href="/"
                                className="block bg-white border border-[#e8eaed] rounded-2xl active:bg-gray-50 transition-colors"
                            >
                                {CardContent}
                            </a>
                        ) : item.href ? (
                            <a
                                key={item.id}
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block bg-white border border-[#e8eaed] rounded-2xl active:bg-gray-50 transition-colors"
                            >
                                {CardContent}
                            </a>
                        ) : (
                            <div
                                key={item.id}
                                className="block bg-white border border-[#e8eaed] rounded-2xl"
                            >
                                {CardContent}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

/* ──────────────────────────────────────────────
   MAIN EXPORT
   ────────────────────────────────────────────── */
const OurInitiatives = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [initiatives, setInitiatives] = useState<Initiative[]>([]);

    useEffect(() => {
        const mq = window.matchMedia('(max-width: 767px)');
        const update = () => setIsMobile(mq.matches);
        update();
        mq.addEventListener('change', update);
        return () => mq.removeEventListener('change', update);
    }, []);

    useEffect(() => {
        fetch('https://sohub.com.bd/api/initiatives.json')
            .then((res) => res.json())
            .then((data) => {
                const active = (data.initiatives || [])
                    .filter((i: Initiative) => i.isActive)
                    .sort((a: Initiative, b: Initiative) => a.order - b.order);
                setInitiatives(active);
            })
            .catch(() => { });
    }, []);

    if (initiatives.length === 0) return null;

    if (isMobile) {
        return <MobileOurInitiatives initiatives={initiatives} />;
    }

    return <DesktopOurInitiatives initiatives={initiatives} />;
};

export default OurInitiatives;
