import panelImage from "@/assets/how-devices.png";
import { Smartphone, Wifi, BellRing, Settings } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: Settings,
      num: "০১",
      title: "স্মার্ট কন্ট্রোল প্যানেল",
      desc: "সিস্টেমের মূল ডিভাইস — সেন্সর, অ্যালার্ম ও ইন্টারনেটের সাথে সংযুক্ত থাকে।",
    },
    {
      icon: Wifi,
      num: "০২",
      title: "সেন্সর এবং এক্সেসরিজ",
      desc: "দরজা, জানালা, মোশন ও গ্লাস ব্রেক সেন্সর দিয়ে সুরক্ষিত করুন।",
    },
    {
      icon: BellRing,
      num: "০৩",
      title: "অ্যালার্ম অ্যাক্টিভেশন",
      desc: "অনুপ্রবেশ সনাক্ত করলে তাৎক্ষণিক সাইরেন ও মোবাইল অ্যালার্ট।",
    },
    {
      icon: Smartphone,
      num: "০৪",
      title: "মোবাইল অ্যাপ কন্ট্রোল",
      desc: "যেকোনো জায়গা থেকে সিস্টেম মনিটরিং, নিয়ন্ত্রণ ও রিয়েল-টাইম আপডেট।",
    },
  ];

  return (
    <section id="how" className="py-24 lg:py-32 terracotta-section">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Product image */}
          <div className="flex justify-center">
            <img
              src={panelImage}
              alt="SOHUB Protect Smart Panel"
              className="w-full max-w-md"
            />
          </div>

          {/* Steps */}
          <div>
            <p className="text-sm uppercase tracking-widest text-primary font-medium mb-4">
              কিভাবে কাজ করে
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-12">
              কিভাবে SOHUB Protect<br /> নিরাপত্তা নিশ্চিত করে?
            </h2>

            <div className="space-y-8">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-5">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-primary font-semibold mb-1">{step.num}</div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
