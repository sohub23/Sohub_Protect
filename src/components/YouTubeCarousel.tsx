import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface Video {
  id: string;
  title: string;
}

const videos: Video[] = [
  { id: "2jh58viBn2g", title: "SOHUB Protect Demo | স্মার্ট সিকিউরিটি সিস্টেম" },
  { id: "HEsKgZqQh_w", title: "চোর কখনো আগে বলে আসে না । SOHUB Protect" },
  { id: "j39ol1TT84I", title: "SOHUB Protect Installation Guide | স্মার্ট হোম সিকিউরিটি সিস্টেম সেটআপ" },
  { id: "eT_7N1VSt2k", title: "How SOHUB Protect Sensors Work | সেন্সর কিভাবে কাজ করে" },
  { id: "bLHPxZDQyPI", title: "SOHUB Protect Features | স্মার্ট হোম সিকিউরিটি" },
  { id: "4cgnmNLQSr4", title: "Customer Review - SOHUB Protect" },
  { id: "27qzsuFRGHs", title: "SOHUB Protect Short Demo" }
];

const YouTubeCarousel = () => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const isMobile = useIsMobile();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
    el.scrollBy({ left: dir === "left" ? -cardWidth : cardWidth, behavior: "smooth" });
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedVideo) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedVideo]);

  const renderVideoCard = (video: Video, i: number) => (
    <motion.div
      key={video.id}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.06 }}
      onClick={() => setSelectedVideo(video)}
      className="block rounded-2xl overflow-hidden border-2 border-border/60 hover:border-primary/40 shadow-sm hover:shadow-md transition-all group cursor-pointer"
    >
      {/* Thumbnail + Play button overlay */}
      <div className="aspect-video relative overflow-hidden bg-secondary">
        <img
          src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/80 backdrop-blur-sm flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300 shadow-md">
            <Play className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground fill-primary-foreground ml-0.5" />
          </div>
        </div>
      </div>

      {/* Title strip at bottom */}
      <div className="px-4 py-2.5 bg-primary">
        <p
          className="text-xs md:text-sm text-primary-foreground font-medium truncate"
          title={video.title}
        >
          {video.title}
        </p>
      </div>
    </motion.div>
  );

  return (
    <section className="py-16 lg:py-24 bg-card border-y border-border" id="videos">
      <div className="section-container">
        <div className="text-center mb-10">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
            ভিডিও গাইড
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            দেখুন কিভাবে কাজ করে
          </h2>
          <p className="text-muted-foreground text-base max-w-lg mx-auto">
            আপনার SOHUB Protect কিট সেটআপ এবং ব্যবহারের বিস্তারিত নির্দেশিকা
          </p>
        </div>

        {/* Carousel with side buttons */}
        <div className="relative">
          {/* Left button */}
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-card border-2 border-border flex items-center justify-center hover:bg-muted hover:border-primary transition-all shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>

          {/* Right button */}
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-card border-2 border-border flex items-center justify-center hover:bg-muted hover:border-primary transition-all shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-6 h-6 text-foreground" />
          </button>

          {/* Carousel */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {videos.map((video, i) => (
              <div key={video.id} className="w-[calc(25%-12px)] shrink-0 snap-start">
                {renderVideoCard(video, i)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
            onClick={() => setSelectedVideo(null)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            {/* Modal content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative w-full max-w-4xl z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Video player card */}
              <div className="rounded-2xl overflow-hidden shadow-2xl border-2 border-border/30">
                <div className="aspect-video bg-black">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1&rel=0`}
                    title={selectedVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                {/* Title strip */}
                <div className="px-5 py-3 bg-primary">
                  <p className="text-sm md:text-base text-primary-foreground font-medium">
                    {selectedVideo.title}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default YouTubeCarousel;
