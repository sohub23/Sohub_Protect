import { Eye, Bell, Shield } from "lucide-react";

const SolutionSection = () => {
  return (
    <section className="py-24 lg:py-32 bg-background relative overflow-hidden">
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

export default SolutionSection;
