import { useState } from "react";
import { Maximize2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import hotscanQR from "@/assets/sohub_protect_hotscan.png";

interface QRExpandableProps {
  size?: "sm" | "md";
  className?: string;
  dark?: boolean;
}

const QRExpandable = ({ size = "md", className = "", dark = false }: QRExpandableProps) => {
  const [expanded, setExpanded] = useState(false);
  const imgSize = size === "sm" ? "w-16 h-16" : "w-20 h-20";
  const containerPad = size === "sm" ? "p-2" : "p-2.5";

  return (
    <div className={className}>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setExpanded(true)}
          className={`bg-white rounded-xl ${containerPad} shadow-[0_2px_12px_rgba(0,0,0,0.1)] border border-white/10 relative group cursor-pointer transition-transform hover:scale-105`}
        >
          <img
            src={hotscanQR}
            alt="Scan to Call SOHUB"
            className={`${imgSize} object-contain`}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 rounded-xl transition-colors flex items-center justify-center">
            <Maximize2 className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </button>
        <div className="text-left">
          <p
            className={`${
              size === "sm" ? "text-[10px]" : "text-xs"
            } font-medium ${dark ? "text-white/60" : "text-foreground/60"} leading-tight`}
          >
            Call With
            <br />
            Hotscan
          </p>
          <p
            className={`${
              size === "sm" ? "text-[8px]" : "text-[9px]"
            } ${dark ? "text-white/40" : "text-muted-foreground/60"} mt-0.5`}
          >
            Tap to enlarge
          </p>
        </div>
      </div>

      {/* Expanded Modal */}
      <AnimatePresence>
        {expanded && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setExpanded(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-zoom-out"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-white rounded-3xl p-6 md:p-10 shadow-2xl max-w-xs md:max-w-md w-full mx-auto flex flex-col items-center z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setExpanded(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors shadow-sm"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
              <div className="text-center w-full">
                <p className="text-xl font-bold text-[#202124] mb-2">
                  Call With Hotscan
                </p>
                <p className="text-sm text-[#5f6368] mb-8 leading-relaxed">
                  আপনার ফোনের ক্যামেরা এই কিউআর কোডের দিকে ধরুন সরাসরি আমাদের কল দিতে।
                </p>
                <div className="bg-white rounded-2xl p-4 md:p-6 inline-block border-[12px] border-[#f8f9fa]">
                  <img
                    src={hotscanQR}
                    alt="Scan to Call SOHUB"
                    className="w-48 h-48 md:w-64 md:h-64 object-contain"
                  />
                </div>
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <p className="text-sm font-medium text-[#202124]">
                    SOHUB Powering Protect
                  </p>
                  <p className="text-xs text-[#5f6368] mt-1">
                    Solution Hub Technologies
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QRExpandable;
