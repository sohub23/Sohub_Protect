import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, ChevronLeft, ChevronRight } from "lucide-react";

interface Video {
  id: string;
  title: string;
}

const API_KEY = "AIzaSyBWGorxS2K4lutpZc1bR2uJhWATQfwMvZM";
const CHANNEL_ID = "UCfMyX0fJd8tINcEDAvcCgAg";

const fallbackVideos: Video[] = [
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
  const [videos, setVideos] = useState<Video[]>(fallbackVideos);
  const [category, setCategory] = useState<"All" | "Video Guide">("All");
  const [visibleCount, setVisibleCount] = useState(4);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=50&type=video`);
        const data = await response.json();
        if (data.items) {
          const fetchedVideos = data.items
            .filter((item: any) => item.id.kind === 'youtube#video')
            .map((item: any) => ({
              id: item.id.videoId,
              title: item.snippet.title,
            }));
          if (fetchedVideos.length > 0) {
            setVideos(fetchedVideos);
          }
        }
      } catch (error) {
        console.error("Error fetching YouTube videos:", error);
      }
    };
    fetchVideos();
  }, []);

  const filteredVideos = videos.filter(video => {
    if (category === "All") return true;
    const t = video.title.toLowerCase();
    return t.includes('guide') || 
           t.includes('installation') || 
           t.includes('setup') || 
           t.includes('tutorial') ||
           t.includes('pairing') ||
           t.includes('কীভাবে') ||
           t.includes('কিভাবে');
  });

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
      className="block rounded-2xl overflow-hidden border-2 border-border/60 hover:border-primary/40 shadow-sm hover:shadow-md transition-all group cursor-pointer h-full"
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
      <div className="px-4 py-2.5 bg-primary h-full">
        <p
          className="text-xs md:text-sm text-primary-foreground font-medium line-clamp-2"
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
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            দেখুন কিভাবে কাজ করে
          </h2>
          <p className="text-muted-foreground text-base max-w-lg mx-auto">
            আপনার SOHUB Protect কিট সেটআপ এবং ব্যবহারের বিস্তারিত নির্দেশিকা
          </p>
        </div>

        {/* Categories */}
        <div className="flex justify-center gap-3 mb-10">
          <button
            onClick={() => setCategory("All")}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
              category === "All"
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setCategory("Video Guide")}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
              category === "Video Guide"
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
            }`}
          >
            Video Guide
          </button>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {filteredVideos.slice(0, visibleCount).map((video, i) => (
            <div key={video.id} className="h-full">
              {renderVideoCard(video, i)}
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {visibleCount < filteredVideos.length && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setVisibleCount((prev) => prev + 4)}
              className="px-8 py-3 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold shadow-sm transition-all border border-border"
            >
              আরো দেখুন
            </button>
          </div>
        )}
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
                className="absolute -top-12 right-0 md:-right-12 xl:-top-12 xl:-right-12 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
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
