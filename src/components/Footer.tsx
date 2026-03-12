import QRExpandable from "@/components/ui/QRExpandable";
import logoWithIcon from "@/assets/logo-with-icon.png";

const Footer = () => {
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
