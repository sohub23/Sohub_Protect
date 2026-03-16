import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const TermsAndPrivacy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Terms & Privacy — SOHUB Protect";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-24">
        <div className="section-container max-w-4xl">
          {/* Header */}
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-primary font-bold mb-4">
              Policies
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
              Terms & Privacy
            </h1>
          </div>

          <div className="space-y-16">
            {/* Terms & Conditions Section */}
            <section className="bg-muted/30 rounded-3xl p-8 md:p-12 border border-border/50">
              <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-base">
                  01
                </span>
                Terms & Conditions
              </h2>

              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p className="font-semibold text-foreground italic">
                  By using this website, you agree to the following terms:
                </p>

                <ul className="space-y-4 list-none">
                  {[
                    "All content, products, and materials on this website are the property of Sohub Protect.",
                    "We reserve the right to update, modify, or change any content, product details, or pricing without prior notice.",
                    "Our goal is to provide high-quality products at a fair and transparent price.",
                    "If you experience any issues with our products or services, please contact our support team."
                  ].map((item, idx) => (
                    <li key={idx} className="flex gap-3">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Privacy Policy Section */}
            <section className="bg-muted/30 rounded-3xl p-8 md:p-12 border border-border/50">
              <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-base">
                  02
                </span>
                Privacy Policy
              </h2>

              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p className="font-semibold text-foreground italic">
                  At Sohub Protect, we respect and protect your privacy.
                </p>

                <div className="space-y-4">
                  {[
                    "Any personal information such as your name, email, phone number, or address is collected only to process your order and improve our services.",
                    "We do not sell, rent, or share your personal information with any third parties.",
                    "All payments are processed through secure and trusted payment gateways to ensure your safety.",
                    "Your information is kept confidential and used only for business operations related to your order."
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-3">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      <p>{item}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-10 pt-8 border-t border-border/50">
                  <p className="text-foreground font-medium text-center">
                    If you have any questions about these terms or our privacy policy,
                    please feel free to contact with us.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsAndPrivacy;
