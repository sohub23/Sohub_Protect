import QRExpandable from "@/components/ui/QRExpandable";
import logoWithIcon from "@/assets/logo-with-icon.png";
import { FileText, ChevronDown } from "lucide-react";

const Footer = () => {
  const brochures = [
    { 
      name: "SOHUB Protect", 
      url: "/PowerPoint_Presentation.pdf" 
    }
  ];

  return (
    <footer className="bg-foreground border-t border-background/10 py-12 md:py-16">
      <div className="section-container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex flex-col items-center md:items-start gap-4">
            <img
              src={logoWithIcon}
              alt="SOHUB Protect"
              className="h-10 opacity-80"
            />
            <div className="flex flex-col gap-1 items-center md:items-start">
              <p className="text-sm text-background/60 font-medium">
                SOHUB Protect — Smart Sohub Bangladesh
              </p>
              <p className="text-xs text-background/40">
                © {new Date().getFullYear()} All rights reserved.
              </p>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="flex items-center justify-center">
            <QRExpandable size="md" dark={true} />
          </div>

          <div className="flex flex-col items-center md:items-end gap-2">
            <p className="text-sm font-semibold text-primary tracking-wide uppercase">
              Secure Your Peace of Mind
            </p>

            {/* Brochures Dropdown */}
            <div id="brochures" className="relative group">
              <button className="text-sm font-medium text-background/60 hover:text-primary transition-colors flex items-center gap-2 justify-center md:justify-end">
                <FileText className="w-4 h-4" />
                Brochures
                <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" />
              </button>
              <div className="absolute top-full right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {brochures.map((b) => (
                  <a
                    key={b.name}
                    href={b.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#202124] hover:bg-[#fff7e6] hover:text-[#fb8a09] transition-colors whitespace-nowrap"
                  >
                    <FileText className="w-4 h-4 text-[#fb8a09]/60" />
                    {b.name}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex gap-6 mt-2">
              <a href="/privacy-policy" className="text-xs text-background/40 hover:text-primary transition-colors">Privacy</a>
              <a href="/terms-of-service" className="text-xs text-background/40 hover:text-primary transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

