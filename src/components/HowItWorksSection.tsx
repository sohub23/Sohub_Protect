import panelImage from "@/assets/full_combo.png";
import { Smartphone, Wifi, BellRing, Settings } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: Settings,
      num: "০১",
      title: "স্মার্ট কন্ট্রোল প্যানেল",
      desc: "এটাই পুরো সিস্টেমের মূল ডিভাইস। এখান থেকেই সব সেন্সর, অ্যালার্ম এবং ইন্টারনেট সংযোগ একসাথে পরিচালিত হয়।",
    },
    {
      icon: Wifi,
      num: "০২",
      title: "সেন্সর ও এক্সেসরিজ",
      desc: "দরজা, জানালা, মোশন ,গ্যাস লিক Etc. সেন্সরের মাধ্যমে আপনার বাড়ির গুরুত্বপূর্ণ জায়গাগুলো সবসময় নজরদারিতে থাকে।",
    },
    {
      icon: BellRing,
      num: "০৩",
      title: "সাথে সাথে অ্যালার্ম",
      desc: "কোনো অনুপ্রবেশ বা অস্বাভাবিক কিছু শনাক্ত হলে সাথে সাথে সাইরেন বাজে এবং আপনার মোবাইলে সতর্কবার্তা চলে আসে।",
    },
    {
      icon: Smartphone,
      num: "০৪",
      title: "মোবাইল অ্যাপ থেকে নিয়ন্ত্রণ",
      desc: "আপনি যেখানেই থাকুন, মোবাইল অ্যাপের মাধ্যমে সিস্টেম দেখতে, নিয়ন্ত্রণ করতে এবং সাথে সাথে আপডেট জানতে পারবেন।",
    },
  ];

  return (
    <section id="how" className="py-24 lg:py-32" style={{ backgroundColor: '#1f98d1' }}>
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Product image */}
          <div className="flex justify-center w-full">
            <div className="overflow-hidden w-full flex items-center justify-center border-[6px] border-white rounded-none bg-white p-0 shadow-2xl">
              <img
                src={panelImage}
                alt="SOHUB Protect Full Combo"
                className="w-full h-auto object-cover max-h-[600px]"
              />
            </div>
          </div>

          {/* Steps */}
          <div>
            <p className="text-sm uppercase tracking-widest text-white/80 font-medium mb-4">
              কিভাবে কাজ করে
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-12">
              কিভাবে SOHUB Protect<br /> নিরাপত্তা নিশ্চিত করে?
            </h2>

            <div className="space-y-8">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-5">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-white/70 font-semibold mb-1">{step.num}</div>
                    <h3 className="text-lg font-semibold text-white mb-1">{step.title}</h3>
                    <p className="text-white/80 text-sm leading-relaxed">{step.desc}</p>
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
