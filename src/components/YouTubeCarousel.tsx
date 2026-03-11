import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

const videos = [
  { id: "dQw4w9WgXcQ", title: "SOHUB Protect ইনস্টলেশন গাইড" },
  { id: "dQw4w9WgXcQ", title: "কিভাবে সেন্সর কাজ করে" },
  { id: "dQw4w9WgXcQ", title: "মোবাইল অ্যাপ ডেমো" },
  { id: "dQw4w9WgXcQ", title: "কাস্টমার রিভিউ" },
  { id: "dQw4w9WgXcQ", title: "সাইরেন সিস্টেম টেস্ট" },
  { id: "dQw4w9WgXcQ", title: "নাইট ভিশন ক্যামেরা" },
  { id: "dQw4w9WgXcQ", title: "গ্যাস সেন্সর ডেমো" },
  { id: "dQw4w9WgXcQ", title: "রিমোট মনিটরিং" },
];

const YouTubeCarousel = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [playingId, setPlayingId] = useState<number | null>(null);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll);
    checkScroll();
    return () => el.removeEventListener("scroll", checkScroll);
  }, []);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector("div")?.offsetWidth || 300;
    el.scrollBy({ left: dir === "left" ? -cardWidth * 2 : cardWidth * 2, behavior: "smooth" });
  };

  return (
    <section className="py-16 lg:py-24 bg-card border-y border-border">
      <div className="section-container">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-sm uppercase tracking-widest text-primary font-medium mb-3">ভিডিও</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">দেখুন কিভাবে কাজ করে</h2>
          </div>
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {videos.map((video, i) => (
            <div
              key={i}
              className="min-w-[calc(50%-8px)] md:min-w-[calc(25%-12px)] snap-start shrink-0"
            >
              <div className="relative aspect-video bg-foreground/5 rounded-xl overflow-hidden group cursor-pointer">
                {playingId === i ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
                    title={video.title}
                    className="w-full h-full"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                ) : (
                  <>
                    <img
                      src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div
                      className="absolute inset-0 bg-foreground/20 flex items-center justify-center group-hover:bg-foreground/30 transition-colors"
                      onClick={() => setPlayingId(i)}
                    >
                      <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 text-primary-foreground ml-1" />
                      </div>
                    </div>
                  </>
                )}
              </div>
              <p className="text-sm font-medium text-foreground mt-3 line-clamp-1">{video.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default YouTubeCarousel;
