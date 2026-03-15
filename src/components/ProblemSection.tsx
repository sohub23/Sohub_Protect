import { Shield, Eye, Bell, TrendingUp, TrendingDown, AlertTriangle, Globe, BarChart3, Building2, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import fbiImage from "@/assets/FBI.png";
import crimeStatsImage from "@/assets/crime_stats.png";
import smartHomeStatsImage from "@/assets/smart_home_stats.png";

const useInView = (threshold = 0.2) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
};

const ProblemSection = () => {
  const section1 = useInView();
  const section2 = useInView();
  const section3 = useInView();

  return (
    <section id="why" className="py-16 lg:py-24 overflow-hidden">
      {/* === Part 1: Crime in Bangladesh === */}
      <div className="section-container mb-24">
        <div ref={section1.ref} className={`transition-all duration-700 ${section1.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <p className="text-sm uppercase tracking-widest text-destructive font-semibold">সমস্যা</p>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-12">
            বাংলাদেশে চুরি ও ডাকাতির<br className="hidden md:block" /> উচ্চ হার
          </h2>

          <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
            {/* Left - bullet points */}
            <div className="space-y-6">
              {[
                { text: "বাংলাদেশে চুরি ও ডাকাতির সমস্যা অত্যন্ত গুরুতর। এই সমস্যা বাসা ও ব্যবসার **নিরাপত্তাকে বিপদগ্রস্ত** করছে।", icon: AlertTriangle },
                { text: "সাম্প্রতিক পরিসংখ্যান অনুযায়ী, এই ধরনের অপরাধের **হার বাড়ছে**, যা বাসিন্দা এবং ব্যবসায়ীদের মধ্যে উদ্বেগ সৃষ্টি করছে।", icon: TrendingUp },
                { text: "এছাড়া **সিসিটিভি** এর মাধ্যমে চুরি হওয়ার পর এনালাইসিস করা হচ্ছে, কিন্তু চুরি হওয়া **প্রতিরোধ করা যাচ্ছে না**।", icon: Eye },
              ].map((item, i) => (
                <div key={i} className={`flex gap-4 p-5 rounded-xl bg-destructive/5 border border-destructive/10 transition-all duration-500 delay-${i * 200} ${section1.inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                  <item.icon className="w-6 h-6 text-destructive shrink-0 mt-0.5" />
                  <p className="text-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: item.text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>') }} />
                </div>
              ))}
            </div>

            {/* Right - animated stats replaced with image */}
            <div className="bg-card rounded-2xl border border-border p-4 md:p-6 overflow-hidden shadow-sm flex items-center justify-center">
              <img 
                src={crimeStatsImage} 
                alt="বাংলাদেশে অপরাধের পরিসংখ্যান" 
                className="w-full h-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* === Part 2: Comparison with Developed Countries === */}
      <div className="bg-card border-y border-border py-16 lg:py-24 mb-24">
        <div className="section-container">
          <div ref={section2.ref} className={`transition-all duration-700 ${section2.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-primary" />
              <p className="text-sm uppercase tracking-widest text-primary font-semibold">তুলনা</p>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-12">
              উন্নত দেশগুলোর সাথে তুলনা
            </h2>

            <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
              <div className="space-y-6">
                {[
                  "উন্নত দেশগুলোতে ব্যাপকভাবে **নিরাপত্তা ব্যবস্থা** গ্রহণের ফলে অপরাধের হার উল্লেখযোগ্যভাবে কমে গেছে।",
                  "উন্নত প্রযুক্তি সংযুক্ত নিরাপত্তা ব্যবস্থা ব্যবহারের মাধ্যমে এই দেশগুলো নিরাপদ বসবাসের পরিবেশ সৃষ্টি করেছে।",
                ].map((text, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <ChevronRight className="w-5 h-5 text-primary shrink-0 mt-1" />
                    <p className="text-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                  </div>
                ))}
                <div className="mt-8 p-6 bg-primary/5 rounded-xl border border-primary/10">
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    নিরাপত্তা ব্যবস্থার কার্যকারিতা
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex gap-3 items-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                      <p className="text-muted-foreground text-sm">এফবিআই এবং অন্যান্য প্রতিষ্ঠানের গবেষণায় দেখানো হয়েছে যে নিরাপত্তা ব্যবস্থা অপরাধ প্রতিরোধে অত্যন্ত <strong className="text-foreground">কার্যকর</strong>।</p>
                    </li>
                    <li className="flex gap-3 items-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                      <p className="text-muted-foreground text-sm">যেখানে নিরাপত্তা ব্যবস্থা গৃহীত হয়েছে সেখানে চুরি ও ডাকাতির হার উল্লেখযোগ্যভাবে <strong className="text-foreground">কমেছে</strong>।</p>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Right - FBI style chart replaced with image and link */}
              <div className="flex flex-col gap-4">
                <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm flex items-center justify-center p-2">
                  <img
                    src={fbiImage}
                    alt="Security System Impact"
                    className="w-[105%] h-auto object-contain rounded-lg shadow-md hover:scale-[1.02] transition-transform duration-300"
                  />
                </div>
                <div className="flex justify-center pt-1">
                  <p className="text-xs md:text-sm text-foreground font-medium">
                    Reference :{" "}
                    <a 
                      href="https://www.youtube.com/watch?v=0DiLan7Knw4" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:opacity-80 transition-opacity border-b border-transparent hover:border-primary pb-0.5"
                    >
                      Youtube Link From Modern MBA
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === Part 3: Global Market & Bangladesh Opportunity === */}
      <div className="section-container mb-16">
        <div ref={section3.ref} className={`transition-all duration-700 ${section3.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <p className="text-sm uppercase tracking-widest text-primary font-semibold">মার্কেট</p>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-12">
            গ্লোবাল মার্কেট শেয়ার এবং<br className="hidden md:block" /> বাংলাদেশে বাজারের সম্ভাবনা
          </h2>

          <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">গ্লোবাল মার্কেট শেয়ার:</h3>
              <div className="space-y-4 mb-8">
                {[
                  "উন্নত দেশগুলোতে বাড়ি এবং অফিস নিরাপত্তা ব্যবস্থার ব্যাপক চাহিদা রয়েছে।",
                  "গ্লোবাল স্মার্ট হোম সিকিউরিটি মার্কেট ২০২১ সালে প্রায় **$৫২ বিলিয়ন** ডলার এবং ২০২৭ সালের মধ্যে **$৭৮ বিলিয়ন** ডলারের উপরে।",
                  "উত্তর আমেরিকা, ইউরোপ এবং এশিয়া-প্যাসিফিক অঞ্চলে এই নিরাপত্তা পণ্যের বিশাল চাহিদা।",
                ].map((text, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <ChevronRight className="w-5 h-5 text-primary shrink-0 mt-1" />
                    <p className="text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>') }} />
                  </div>
                ))}
              </div>

              <h3 className="text-xl font-semibold text-foreground mb-4">বাংলাদেশে বাজারের সম্ভাবনা:</h3>
              <div className="space-y-4">
                {[
                  "বাংলাদেশে এখনো নিরাপত্তা ব্যবস্থা ব্যাপকভাবে গৃহীত হয়নি, কিন্তু চাহিদা দ্রুত **বৃদ্ধি** পাচ্ছে।",
                  "উন্নত দেশগুলোর মতো বাংলাদেশেও চুরি ও ডাকাতির সমস্যা **প্রকট**, যা নিরাপত্তা ব্যবস্থার প্রয়োজনীয়তা বাড়িয়ে দিচ্ছে।",
                  "রিয়েল এস্টেট কোম্পানিগুলোর সাথে অংশীদারিত্বের মাধ্যমে বাজারে প্রবেশের **বিশাল সম্ভাবনা** রয়েছে।",
                ].map((text, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <ChevronRight className="w-5 h-5 text-accent shrink-0 mt-1" />
                    <p className="text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>') }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Right - FBI image and stats */}
            <div className="space-y-6">
              {/* Smart Home Stats Image */}
              <div className="bg-card rounded-2xl border border-border p-2 shadow-sm overflow-hidden flex items-center justify-center">
                <img
                  src={smartHomeStatsImage}
                  alt="U.S. Leads the World in Smart Home Security Adoption"
                  className="w-full h-auto object-contain rounded-lg"
                />
              </div>

              {/* Bangladesh Opportunity */}
              <div className="bg-[#E9F3F7] border border-border/40 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Building2 className="w-6 h-6 text-primary" />
                  <h4 className="font-semibold text-foreground">বাংলাদেশের সুযোগ</h4>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                  সঠিক দামে এবং উচ্চ মানের পণ্য সরবরাহ করে বাজারে নেতৃত্ব দানের সুযোগ। SOHUB Protect
                  বাংলাদেশের প্রেক্ষাপটে তৈরি একটি সম্পূর্ণ নিরাপত্তা সমাধান।
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default ProblemSection;
