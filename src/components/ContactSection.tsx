import { Mail, Globe } from "lucide-react";
import shieldBadge from "@/assets/shield-badge.png";
import QRExpandable from "@/components/ui/QRExpandable";

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 lg:py-32 bg-foreground">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-sm uppercase tracking-widest text-primary font-medium mb-4">
              যোগাযোগ করুন
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-background leading-tight mb-6">
              আজই আপনার বাড়ির<br /> নিরাপত্তা নিশ্চিত করুন
            </h2>
            <p className="text-background/70 mb-10 max-w-md leading-relaxed">
              ফ্রি পরামর্শ নিন এবং আপনার প্রয়োজন অনুযায়ী সেরা সিকিউরিটি সলিউশন বেছে নিন।
              আমাদের টিম সবসময় আপনার পাশে।
            </p>

            <div className="space-y-6">
              {/* QR Code replacing the phone number */}
              <div className="flex items-center gap-4">
                <QRExpandable size="md" dark={true} className="w-full sm:w-auto" />
              </div>

              <div className="space-y-5">
                <a
                  href="mailto:hello@sohub.com.bd"
                  className="flex items-center gap-4 text-background hover:text-primary transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-background/50">ইমেইল</p>
                    <p className="font-semibold">hello@sohub.com.bd</p>
                  </div>
                </a>

                <a
                  href="https://www.sohub.com.bd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-background hover:text-primary transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-background/50">ওয়েবসাইট</p>
                    <p className="font-semibold">www.sohub.com.bd</p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <img
              src={shieldBadge}
              alt="Protected by SOHUB Protect"
              className="w-64 lg:w-72 opacity-90"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
