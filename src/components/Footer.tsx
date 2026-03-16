import QRExpandable from "@/components/ui/QRExpandable";
import logoWithIcon from "@/assets/logo-with-icon.png";
import { FileText, ChevronDown, Mail, Globe, ExternalLink, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const brochures = [
    {
      name: "SOHUB Protect",
      url: "/Sohub Protect.pdf"
    }
  ];

  return (
    <footer className="bg-foreground border-t border-background/10 pt-6 md:pt-10 pb-4 md:pb-6">
      <div className="section-container">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-y-10 lg:gap-x-12 items-start mb-12">
          {/* Left Column — Logo & CTA */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-6 w-full lg:col-span-4">
            <div className="flex flex-col items-center lg:items-start gap-4 w-full">
              <img
                src={logoWithIcon}
                alt="SOHUB Protect"
                className="h-8 md:h-10 w-auto object-contain opacity-90"
              />
              <h2 className="text-xl md:text-2xl font-bold text-background leading-tight">
                আজই আপনার বাড়ির<br /> নিরাপত্তা নিশ্চিত করুন
              </h2>
              <p className="text-xs md:text-sm text-background/60 max-w-xs mt-1 md:mt-3 leading-relaxed mx-auto lg:mx-0">
                ফ্রি পরামর্শ নিন এবং আপনার প্রয়োজন অনুযায়ী সেরা সিকিউরিটি সলিউশন বেছে নিন। আমাদের টিম সবসময় আপনার পাশে।
              </p>
            </div>
          </div>

          {/* Middle Row for Mobile — Support & Quick Links side by side */}
          <div className="flex flex-row lg:contents gap-4 w-full lg:col-span-5">
            {/* Support */}
            <div className="flex-[1.2] flex flex-col items-start lg:items-center lg:col-span-3">
              <div className="text-left lg:text-center w-full">
                <p className="text-[10px] md:text-xs uppercase tracking-widest text-primary font-bold mb-4 md:mb-6 lg:text-center">
                  Support
                </p>
                <div className="space-y-3 md:space-y-4">
                  <a
                    href="mailto:hello@sohub.com.bd"
                    className="flex lg:flex-row items-center gap-2 md:gap-4 text-background hover:text-primary transition-colors group"
                  >
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                      <Mail className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="hidden md:block text-[10px] text-background/40 font-medium">ইমেইল</p>
                      <p className="text-[10px] md:text-sm font-semibold truncate max-w-[130px] xs:max-w-[150px] md:max-w-none">hello@sohub.com.bd</p>
                    </div>
                  </a>

                  <a
                    href="https://www.sohub.com.bd"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex lg:flex-row items-center gap-2 md:gap-4 text-background hover:text-primary transition-colors group"
                  >
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                      <Globe className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="hidden md:block text-[10px] text-background/40 font-medium">ওয়েবসাইট</p>
                      <p className="text-[10px] md:text-sm font-semibold whitespace-nowrap">www.sohub.com.bd</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex-1 flex flex-col items-end lg:items-center lg:col-span-2 pl-2">
              <div className="text-left lg:text-center w-full">
                <p className="text-[10px] md:text-xs uppercase tracking-widest text-primary font-bold mb-4 md:mb-6 lg:text-center">
                  Quick Links
                </p>
                <div className="space-y-3 md:space-y-4">
                  <Link
                    to="/terms-and-privacy"
                    className="flex lg:flex-row items-center gap-2 md:gap-4 text-background hover:text-primary transition-colors group"
                  >
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                      <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="hidden md:block text-[10px] text-background/40 font-medium">Legal</p>
                      <p className="text-[10px] md:text-[13px] font-semibold whitespace-nowrap">Terms & Privacy</p>
                    </div>
                  </Link>

                  <Link
                    to="/warranty"
                    className="flex lg:flex-row items-center gap-2 md:gap-4 text-background hover:text-primary transition-colors group"
                  >
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="hidden md:block text-[10px] text-background/40 font-medium">Support</p>
                      <p className="text-[10px] md:text-[13px] font-semibold whitespace-nowrap">Warranty Policy</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column — Brochures & QR Row on Mobile */}
          <div className="flex flex-col items-center lg:items-end lg:col-span-3 gap-6 w-full lg:h-full justify-between">
            <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-4 w-full lg:text-right">
              <div className="flex flex-col items-start lg:items-end gap-2 md:gap-4">
                <p className="text-[10px] md:text-sm font-bold text-primary tracking-wide uppercase">
                  Secure Your Peace of Mind
                </p>

                {/* Brochures Dropdown */}
                <div id="brochures" className="relative group">
                  <button className="text-[11px] md:text-sm font-medium text-background/60 hover:text-primary transition-colors flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    Brochures
                    <ChevronDown className="w-3 h-3 md:w-3.5 md:h-3.5 transition-transform duration-200 group-hover:rotate-180" />
                  </button>
                  <div className="absolute bottom-full md:top-full md:bottom-auto left-0 md:left-auto md:right-0 w-44 md:w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    {brochures.map((b) => (
                      <a
                        key={b.name}
                        href={b.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-2 text-xs md:text-sm text-foreground hover:bg-primary/5 hover:text-primary transition-colors whitespace-nowrap"
                      >
                        <FileText className="w-4 h-4 text-primary/60" />
                        {b.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* QR Code (HotScan) */}
              <div className="shrink-0">
                <QRExpandable size="md" dark={true} />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar — All in one line */}
        <div className="border-t border-background/10 pt-8 mt-1">
          <div className="flex flex-col md:flex-row justify-between items-center gap-y-4 text-xs text-background/50 font-medium tracking-tight">
            <span>A product of SOHUB — Solution Hub Technologies</span>
            <span>© {new Date().getFullYear()} SOHUB. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

