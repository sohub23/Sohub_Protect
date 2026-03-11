import { Shield, Eye, Bell, TrendingUp, TrendingDown, AlertTriangle, Globe, BarChart3, Building2, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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

const AnimatedCounter = ({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) => {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView();
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end, duration]);
  return <span ref={ref}>{count}{suffix}</span>;
};

const StatBar = ({ label, value, max, color, flag }: { label: string; value: string; max: number; color: string; flag: string }) => {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className="flex items-center gap-3 mb-3">
      <span className="text-lg">{flag}</span>
      <span className="text-sm text-foreground w-24 shrink-0">{label}</span>
      <div className="flex-1 bg-muted rounded-full h-6 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2 ${color}`}
          style={{ width: inView ? `${max}%` : '0%' }}
        >
          <span className="text-xs font-semibold text-primary-foreground">{value}</span>
        </div>
      </div>
    </div>
  );
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

            {/* Right - animated stats */}
            <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
              <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-destructive" />
                বাংলাদেশে অপরাধের পরিসংখ্যান
              </h3>
              <div className="space-y-5">
                <div className="text-center p-6 bg-destructive/5 rounded-xl border border-destructive/10">
                  <div className="text-4xl md:text-5xl font-bold text-destructive">
                    <AnimatedCounter end={67} suffix="%" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">বাসিন্দা নিরাপত্তা নিয়ে উদ্বিগ্ন</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-xl">
                    <div className="text-2xl font-bold text-foreground"><AnimatedCounter end={82} suffix="%" /></div>
                    <p className="text-xs text-muted-foreground mt-1">CCTV শুধু রেকর্ড করে</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-xl">
                    <div className="text-2xl font-bold text-foreground"><AnimatedCounter end={3} suffix="x" /></div>
                    <p className="text-xs text-muted-foreground mt-1">চুরির হার বৃদ্ধি</p>
                  </div>
                </div>
              </div>
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

              {/* Right - FBI style chart mockup */}
              <div className="bg-foreground rounded-2xl p-6 text-primary-foreground">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="w-8 h-8 text-primary" />
                  <div>
                    <p className="font-bold text-lg">Security System Impact</p>
                    <p className="text-xs text-primary-foreground/60">Crime Rate Reduction with Security Systems</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { year: "নিরাপত্তা ব্যবস্থা ছাড়া", val: 95, color: "bg-destructive" },
                    { year: "বেসিক CCTV", val: 70, color: "bg-accent" },
                    { year: "স্মার্ট সিকিউরিটি", val: 35, color: "bg-primary" },
                    { year: "SOHUB Protect", val: 15, color: "bg-green-500" },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-primary-foreground/80">{item.year}</span>
                        <span className="font-semibold">{item.val}%</span>
                      </div>
                      <div className="h-3 bg-primary-foreground/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${item.color} transition-all duration-1000 ease-out`}
                          style={{ width: section2.inView ? `${item.val}%` : '0%', transitionDelay: `${i * 200}ms` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-primary-foreground/10 flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-primary" />
                  <p className="text-xs text-primary-foreground/60">নিরাপত্তা ব্যবস্থা থাকলে অপরাধের হার <span className="text-primary font-semibold">৮৫% পর্যন্ত কমে</span></p>
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

            {/* Right - market data visualization */}
            <div className="space-y-6">
              <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-5">Smart Home Security Revenue by Country</h4>
                <StatBar label="USA" value="$5,474m" max={90} color="bg-primary" flag="🇺🇸" />
                <StatBar label="China" value="$1,083m" max={35} color="bg-primary/70" flag="🇨🇳" />
                <StatBar label="UK" value="$514m" max={22} color="bg-primary/60" flag="🇬🇧" />
                <StatBar label="Germany" value="$495m" max={20} color="bg-primary/50" flag="🇩🇪" />
                <StatBar label="France" value="$428m" max={18} color="bg-primary/40" flag="🇫🇷" />
                <p className="text-xs text-muted-foreground mt-4">Source: Statista, 2021</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary text-primary-foreground rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold mb-1">$<AnimatedCounter end={52} />B</div>
                  <p className="text-xs text-primary-foreground/80">মার্কেট সাইজ ২০২১</p>
                </div>
                <div className="bg-accent text-accent-foreground rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold mb-1">$<AnimatedCounter end={78} />B</div>
                  <p className="text-xs text-accent-foreground/80">প্রত্যাশিত ২০২৭</p>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Building2 className="w-6 h-6 text-primary" />
                  <h4 className="font-semibold text-foreground">বাংলাদেশের সুযোগ</h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  সঠিক দামে এবং উচ্চ মানের পণ্য সরবরাহ করে বাজারে নেতৃত্ব দানের সুযোগ। SOHUB Protect
                  বাংলাদেশের প্রেক্ষাপটে তৈরি একটি সম্পূর্ণ নিরাপত্তা সমাধান।
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === Original 3 Pillars === */}
      <div className="section-container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-sm uppercase tracking-widest text-primary font-medium mb-4">
            সমাধান
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6">
            SOHUB Protect কিভাবে<br className="hidden md:block" /> আপনাকে রক্ষা করে?
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {[
            { icon: Eye, title: "Senses — সনাক্ত করে", desc: "SOHUB Protect ২৪/৭ আপনার বাসা-বাড়ি মনিটর করে অনুপ্রবেশ ও অস্বাভাবিক গতিবিধি সনাক্ত করে।" },
            { icon: Bell, title: "Alerts — সতর্ক করে", desc: "সম্ভাব্য ঝুঁকির বিষয়ে তাৎক্ষণিক মোবাইল নোটিফিকেশনের মাধ্যমে আপনাকে সতর্ক করে।" },
            { icon: Shield, title: "Prevents — প্রতিরোধ করে", desc: "বিল্ট-ইন সাইরেন সিস্টেমের মাধ্যমে অনুপ্রবেশকারীদের ঠেকায় এবং বিপদ প্রতিরোধ করে।" },
          ].map((item, i) => (
            <div key={i} className="text-center p-8 rounded-2xl bg-card border border-border hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <item.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
