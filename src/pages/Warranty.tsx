import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ShieldCheck, ClipboardList, AlertCircle, Info } from "lucide-react";

const Warranty = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Warranty Policy — SOHUB Protect";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-24">
        <div className="section-container max-w-4xl">
          {/* Header */}
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-primary font-bold mb-4">
              Commitment to Quality
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
              Warranty Policy
            </h1>
            <p className="mt-6 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              At Sohub Protect, we are committed to providing high-quality products and reliable customer support.
              If you experience any issues with your product, you may request a warranty claim under the following conditions.
            </p>
          </div>

          <div className="space-y-12">
            {/* Warranty Coverage */}
            <section className="bg-muted/30 rounded-3xl p-8 md:p-12 border border-border/50">
              <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-primary" />
                Warranty Coverage
              </h2>

              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p className="font-semibold text-foreground">
                  Our products come with a 1-Year Limited Warranty against manufacturing defects.
                </p>
                <ul className="space-y-4">
                  {[
                    "The warranty covers issues related to product functionality or quality defects under normal use.",
                    "The warranty period starts from the date of purchase."
                  ].map((item, idx) => (
                    <li key={idx} className="flex gap-3">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Warranty Claim Process */}
            <section className="bg-muted/30 rounded-3xl p-8 md:p-12 border border-border/50">
              <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
                <ClipboardList className="w-6 h-6 text-primary" />
                Warranty Claim Process
              </h2>

              <div className="space-y-6">
                <p className="text-muted-foreground">To claim your warranty, please follow these steps:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { step: "01", text: "Contact our support team with your order number and a clear description of the issue." },
                    { step: "02", text: "Provide photos or videos showing the defect or problem." },
                    { step: "03", text: "Our team will review your request and respond within 1–3 business days." },
                    { step: "04", text: "If the claim is approved, we will offer a replacement, repair, or appropriate solution." }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-background border border-border/40">
                      <span className="text-lg font-bold text-primary/40">{item.step}</span>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Warranty Does Not Cover */}
            <section className="bg-muted/30 rounded-3xl p-8 md:p-12 border border-border/50">
              <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-primary" />
                Warranty Does Not Cover
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Damage caused by misuse, accidents, or improper handling",
                  "Physical damage, scratches, or wear and tear from normal use",
                  "Damage caused by unauthorized repair or modification",
                  "Loss or damage caused by external factors (water, fire, etc.)"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-4 rounded-xl bg-background/50 border border-border/30">
                    <XCircle className="w-4 h-4 text-red-500/70 shrink-0" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Important Notes */}
            <section className="bg-primary/5 rounded-3xl p-8 border border-primary/20">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                <Info className="w-5 h-5 text-primary" />
                Important Notes
              </h2>

              <ul className="space-y-4 text-sm text-muted-foreground mb-8">
                <li className="flex gap-3">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-primary shrink-0" />
                  <span>The product may need to be returned for inspection before the warranty claim is approved.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-primary shrink-0" />
                  <span>Shipping costs for warranty claims may vary depending on the situation.</span>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const XCircle = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="m15 9-6 6" />
    <path d="m9 9 6 6" />
  </svg>
);

export default Warranty;
