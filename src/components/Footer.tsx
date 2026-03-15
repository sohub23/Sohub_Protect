import QRExpandable from "@/components/ui/QRExpandable";
import logoWithIcon from "@/assets/logo-with-icon.png";
import { FileText, ChevronDown, Mail, Globe } from "lucide-react";

const Footer = () => {
  const brochures = [
    {
      name: "SOHUB Protect",
      url: "/PowerPoint_Presentation.pdf"
    }
  ];

  return (
    <footer className="bg-foreground border-t border-background/10 py-12 md:py-20">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start mb-8">
          {/* Left Column — Logo & CTA */}
          <div className="flex flex-col items-start text-left gap-6 w-full">
            <div className="flex flex-col items-start gap-4 w-full">
              <img
                src={logoWithIcon}
                alt="SOHUB Protect"
                className="h-10 w-auto object-contain opacity-90"
              />
              <h2 className="text-2xl font-bold text-background leading-tight">
                আজই আপনার বাড়ির<br /> নিরাপত্তা নিশ্চিত করুন
              </h2>
              <p className="text-sm text-background/60 max-w-xs mt-3 leading-relaxed">
                ফ্রি পরামর্শ নিন এবং আপনার প্রয়োজন অনুযায়ী সেরা সিকিউরিটি সলিউশন বেছে নিন। আমাদের টিম সবসময় আপনার পাশে।
              </p>
            </div>
          </div>

          {/* Center Column — Contact Us */}
          <div className="flex flex-col items-center">
            <div className="text-center w-full max-w-[240px]">
              <p className="text-xs uppercase tracking-widest text-primary font-bold mb-6">
                যোগাযোগ করুন
              </p>
              <div className="space-y-4">
                <a
                  href="mailto:hello@sohub.com.bd"
                  className="flex items-center gap-4 text-background hover:text-primary transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-background/40 font-medium">ইমেইল</p>
                    <p className="text-sm font-semibold">hello@sohub.com.bd</p>
                  </div>
                </a>

                <a
                  href="https://www.sohub.com.bd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-background hover:text-primary transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Globe className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-background/40 font-medium">ওয়েবসাইট</p>
                    <p className="text-sm font-semibold">www.sohub.com.bd</p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column — Brochures & Policies */}
          <div className="flex flex-col items-center md:items-end gap-6 h-full justify-between">
            <div className="flex flex-col items-center md:items-end gap-4 text-right">
              <p className="text-sm font-bold text-primary tracking-wide uppercase">
                Secure Your Peace of Mind
              </p>

              {/* Brochures Dropdown */}
              <div id="brochures" className="relative group">
                <button className="text-sm font-medium text-background/60 hover:text-primary transition-colors flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Brochures
                  <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" />
                </button>
                <div className="absolute bottom-full md:top-full md:bottom-auto right-1/2 translate-x-1/2 md:right-0 md:translate-x-0 mb-2 md:mb-0 md:mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {brochures.map((b) => (
                    <a
                      key={b.name}
                      href={b.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-primary/5 hover:text-primary transition-colors whitespace-nowrap"
                    >
                      <FileText className="w-4 h-4 text-primary/60" />
                      {b.name}
                    </a>
                  ))}
                </div>
              </div>

              {/* QR Code (HotScan) */}
              <div className="mt-4">
                <QRExpandable size="md" dark={true} />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar — All in one line */}
        <div className="border-t border-background/10 pt-8 mt-8">
          <div className="flex flex-wrap justify-center items-center gap-x-2.5 gap-y-2 text-xs text-background/50 font-medium tracking-tight">
            <span>© {new Date().getFullYear()} All rights reserved.</span>
            <span className="text-background/10">|</span>
            <span>SOHUB Protect — Powered by Solution Hub Technologies</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

