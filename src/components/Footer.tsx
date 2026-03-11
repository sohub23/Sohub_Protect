import logoWhite from "@/assets/logo-white.png";

const Footer = () => {
  return (
    <footer className="bg-foreground border-t border-background/10 py-10">
      <div className="section-container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <img src={logoWhite} alt="SOHUB Protect" className="h-7 opacity-70" />
          <p className="text-sm text-background/40 text-center">
            © {new Date().getFullYear()} SOHUB Protect — Smart Sohub Bangladesh. All rights reserved.
          </p>
          <p className="text-sm text-background/40">
            Secure Your Peace of Mind
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
