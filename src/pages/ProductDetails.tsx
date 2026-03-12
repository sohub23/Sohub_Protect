import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import panelImage from "@/assets/panel-product.png";
import cubeImage from "@/assets/Sp1.png";
import shieldBadge from "@/assets/shield-badge.png";
import CompatibilityIcons from "@/components/CompatibilityIcons";
import {
  Shield,
  ShieldCheck,
  Smartphone,
  Bell,
  BellRing,
  Wifi,
  Camera,
  Settings,
  Lock,
  Unlock,
  Eye,
  AlertTriangle,
  Ban,
  Battery,
  Headphones,
  CreditCard,
  ChevronRight,
  Monitor,
  DoorOpen,
  Flame,
  Wind,
} from "lucide-react";

/* ── Security Modes ─────────────────────────────── */
const securityModes = [
  {
    icon: Unlock,
    title: "Disarm",
    titleBn: "নিরস্ত্র",
    desc: "নিরাপদ অবস্থায় শুধুমাত্র জরুরী সেন্সর সক্রিয় থাকে।",
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
  },
  {
    icon: Eye,
    title: "Senses",
    titleBn: "পর্যবেক্ষণ",
    desc: "SOHUB Protect আপনার স্থানে ২৪/৭ অবাঞ্ছিত প্রবেশ ও গতিবিধি পর্যবেক্ষণ করে।",
    color: "text-primary",
    bg: "bg-primary/5",
    border: "border-primary/20",
  },
  {
    icon: AlertTriangle,
    title: "Alerts",
    titleBn: "সতর্কতা",
    desc: "রিয়েল-টাইম অ্যালার্টের মাধ্যমে সম্ভাব্য ঝুঁকি সম্পর্কে তাৎক্ষণিক জানান।",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  {
    icon: Ban,
    title: "Prevent",
    titleBn: "প্রতিরোধ",
    desc: "বিল্ট-ইন সাইরেন সিস্টেমের মাধ্যমে যেকোনো স্থান থেকে বিপদ প্রতিরোধ করুন।",
    color: "text-destructive",
    bg: "bg-red-50",
    border: "border-red-200",
  },
];

/* ── Why SOHUB ───────────────────────────────────── */
const whyFeatures = [
  {
    icon: ShieldCheck,
    title: "সুরক্ষা এবং নিরাপত্তা",
    desc: "বাসা বাড়ি ও ব্যবসায়ী প্রতিষ্ঠানের অনুপ্রবেশ, চুরি এবং জরুরী অবস্থার মতো বিপদজনক বিষয়গুলোর ব্যাপারে স্মার্ট ভাবে সুরক্ষা প্রদান করে।",
  },
  {
    icon: Lock,
    title: "মনের শান্তি",
    desc: "সার্বক্ষণিক আপনার সম্পদ নজরদারি করে এবং সম্ভাব্য ঝুঁকির বিষয়ে তাৎক্ষণিক সতর্ক করে।",
  },
  {
    icon: Settings,
    title: "কন্ট্রোল এবং ম্যানেজমেন্ট",
    desc: "স্মার্ট কন্ট্রোল প্যানেল, মোবাইল, রিমোর্ট অথবা স্মার্ট কী এর মাধ্যমে অনায়াসে সিস্টেম নিয়ন্ত্রণ করতে পারেন।",
  },
  {
    icon: BellRing,
    title: "জরুরী সংকেত",
    desc: "অস্বাভাবিক গতিবিধি শনাক্ত করলে SOHUB Protect দ্রুত অ্যালার্ম বা সাইরেন বাজিয়ে এবং মোবাইল অ্যাপের মাধ্যমে অবগত করে।",
  },
];

/* ── Ecosystem ───────────────────────────────────── */
const ecosystem = [
  {
    icon: Monitor,
    title: "Security Panel",
    titleBn: "সিকিউরিটি প্যানেল",
    desc: "সেন্ট্রাল প্যানেল সকল সেন্সর সংযুক্ত করে ২৪/৭ মনিটরিং নিশ্চিত করে।",
  },
  {
    icon: Smartphone,
    title: "Mobile App",
    titleBn: "মোবাইল অ্যাপ",
    desc: "মোবাইল অ্যাপ দিয়ে আর্ম, ডিসআর্ম এবং সেন্সর ম্যানেজ করুন।",
  },
  {
    icon: DoorOpen,
    title: "Intrusion Detection",
    titleBn: "ইনট্রুশন ডিটেকশন সেন্সর",
    desc: "দরজা, জানালা, মোশন এবং গ্লাস ব্রেক সেন্সর দিয়ে সুরক্ষিত।",
  },
  {
    icon: Camera,
    title: "Camera",
    titleBn: "ক্যামেরা",
    desc: "নাইট ভিশন, লাইভ স্ট্রিমিং এবং টু-ওয়ে কমিউনিকেশন সুবিধা।",
  },
];

/* ── How It Works ────────────────────────────────── */
const howSteps = [
  {
    num: "০১",
    icon: Settings,
    title: "স্মার্ট কন্ট্রোল প্যানেল",
    desc: "সিস্টেমের মূল ডিভাইস। সেন্সর, এক্সেসরিজ, অ্যালার্ম ও ইন্টারনেটের সাথে সংযুক্ত থাকে। ব্যবহারকারী সেটিংস পরিবর্তন ও পর্যবেক্ষণ করতে পারেন।",
  },
  {
    num: "০২",
    icon: Wifi,
    title: "সেন্সর এবং এক্সেসরিজ",
    desc: "উন্নতমানের দরজা, জানালা, গ্লাস ব্রেক, মোশন সেন্সর ইত্যাদি মূল ফটক এবং গুরুত্বপূর্ণ জায়গায় সেটআপ করা হয়।",
  },
  {
    num: "০৩",
    icon: BellRing,
    title: "অ্যালার্ম অ্যাক্টিভেশন",
    desc: "অনুপ্রবেশ বা জরুরী অবস্থা শনাক্ত হলে তাৎক্ষণিক মোবাইলে সতর্ক এবং সাইরেন ট্রিগার করে।",
  },
  {
    num: "০৪",
    icon: Smartphone,
    title: "মোবাইল অ্যাপ ইন্টিগ্রেশন",
    desc: "যেকোনো জায়গায় থেকে সিস্টেম মনিটরিং, নিয়ন্ত্রণ, রিয়েল-টাইম এলার্ট এবং আপডেট প্রদান করে।",
  },
  {
    num: "০৫",
    icon: Wifi,
    title: "স্মার্ট ইন্টিগ্রেশন",
    desc: "গুগল হোম, এলেক্সা সহ অন্যান্য স্মার্ট হোম ইকোসিস্টেমের সাথে সহজেই যুক্ত হয়।",
  },
];

/* ── Additional Add-ons ──────────────────────────── */
const addons = [
  { icon: Camera, title: "PTZ ক্যামেরা", desc: "ইনডোর ও আউটডোর মনিটরিং" },
  { icon: Flame, title: "গ্যাস লিক ডিটেক্টর", desc: "গ্যাস লিক শনাক্ত করুন" },
  { icon: Wind, title: "স্মোক ডিটেক্টর", desc: "আগুনের আগাম সতর্কতা" },
  { icon: Bell, title: "ডোরবেল", desc: "স্মার্ট ভিডিও ডোরবেল" },
  { icon: Shield, title: "SOS ব্যান্ড", desc: "জরুরী সাহায্যের জন্য" },
  { icon: DoorOpen, title: "শাটার সেন্সর", desc: "শাটার নিরাপত্তা" },
];

/* ── Extra Benefits ──────────────────────────────── */
const extraBenefits = [
  { icon: Wifi, title: "স্মার্ট ইন্টিগ্রেশন", desc: "Google Home, Alexa সাপোর্ট" },
  { icon: Battery, title: "ব্যাটারি ব্যাকআপ", desc: "নিরবিচ্ছিন্ন নিরাপত্তা" },
  { icon: CreditCard, title: "মাসিক ফি নেই", desc: "একবার কিনুন, চিরকাল ব্যবহার" },
  { icon: Headphones, title: "ফ্রি সাপোর্ট", desc: "টেকনিক্যাল সাপোর্ট ও পরামর্শ" },
];

const ProductDetails = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── Hero Banner ───────────────────────────── */}
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-24 bg-primary text-primary-foreground">
        <div className="section-container text-center">
          <p className="text-sm uppercase tracking-widest text-primary-foreground/70 mb-4">
            Revolutionize Home Security
          </p>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 max-w-3xl mx-auto">
            বাংলাদেশে স্মার্ট হোম সিকিউরিটির নতুন যুগ
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-10">
            European-Standard সিস্টেম। কোনো মাসিক ফি নেই। সাশ্রয়ী মূল্যে সর্বাধুনিক প্রযুক্তি।
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/#packages"
              className="bg-primary-foreground text-primary px-8 py-3.5 rounded-full font-medium hover:bg-primary-foreground/90 transition-colors"
            >
              প্যাকেজ দেখুন
            </Link>
            <a
              href="#how-detail"
              className="border border-primary-foreground/30 text-primary-foreground px-8 py-3.5 rounded-full font-medium hover:bg-primary-foreground/10 transition-colors"
            >
              কিভাবে কাজ করে
            </a>
          </div>
        </div>
      </section>

      {/* ── Key Highlights Strip ──────────────────── */}
      <section className="py-8 border-b border-border bg-card">
        <div className="section-container grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: "European Standard", sub: "উচ্চমানের সিস্টেম" },
            { label: "No Monthly Fee", sub: "কোনো মাসিক ফি নেই" },
            { label: "Homes & Offices", sub: "বাড়ি, অফিস, ফ্যাক্টরি" },
            { label: "Crime Reduction", sub: "অপরাধ প্রতিরোধে কার্যকর" },
          ].map((item, i) => (
            <div key={i}>
              <p className="text-sm font-bold text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Security Modes ────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="section-container">
          <div className="text-center mb-14">
            <p className="text-sm uppercase tracking-widest text-primary font-medium mb-3">
              Discover the ways we prioritize your safety
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              "আপনার মানসিক শান্তি রক্ষা করা, প্রতিটি পদক্ষেপে"
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {securityModes.map((mode, i) => (
              <div
                key={i}
                className={`rounded-2xl p-6 border ${mode.border} ${mode.bg} transition-transform hover:-translate-y-1`}
              >
                <mode.icon className={`w-10 h-10 ${mode.color} mb-4`} />
                <h3 className="text-lg font-bold text-foreground mb-1">{mode.title}</h3>
                <p className="text-xs text-muted-foreground font-medium mb-2">{mode.titleBn}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{mode.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why SOHUB Protect ─────────────────────── */}
      <section className="py-20 lg:py-28 terracotta-section">
        <div className="section-container">
          <div className="text-center mb-14">
            <p className="text-sm uppercase tracking-widest text-primary font-medium mb-3">
              কেন সোহাব প্রটেক্ট?
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              নিরাপত্তা কোনো বিলাসিতা নয়, এটি একটি মৌলিক অধিকার
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {whyFeatures.map((f, i) => (
              <div
                key={i}
                className="flex gap-5 p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Product Ecosystem ─────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="section-container">
          <div className="text-center mb-14">
            <p className="text-sm uppercase tracking-widest text-primary font-medium mb-3">
              SOHUB PROTECT Ecosystem
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              সম্পূর্ণ সিকিউরিটি ইকোসিস্টেম
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div className="flex justify-center">
              <img
                src={panelImage}
                alt="SOHUB Protect Panel"
                className="w-full max-w-sm"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              {ecosystem.map((item, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-muted/50 border border-border"
                >
                  <item.icon className="w-8 h-8 text-primary mb-3" />
                  <h3 className="text-sm font-bold text-foreground">{item.title}</h3>
                  <p className="text-xs text-primary font-medium mb-1">{item.titleBn}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works (Detailed) ───────────────── */}
      <section id="how-detail" className="py-20 lg:py-28 bg-primary text-primary-foreground">
        <div className="section-container">
          <div className="text-center mb-14">
            <p className="text-sm uppercase tracking-widest text-primary-foreground/70 mb-3">
              কিভাবে কাজ করে
            </p>
            <h2 className="text-3xl md:text-4xl font-bold">
              কিভাবে SOHUB Protect নিরাপত্তা নিশ্চিত করে?
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-8">
            {howSteps.map((step, i) => (
              <div key={i} className="flex gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-foreground/10 flex items-center justify-center">
                  <step.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-xs text-primary-foreground/60 font-bold mb-1">{step.num}</div>
                  <h3 className="text-lg font-bold mb-1">{step.title}</h3>
                  <p className="text-sm text-primary-foreground/70 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Additional Add-ons ────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="section-container">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              অতিরিক্ত সুরক্ষার জন্য অ্যাড-অন
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-sm">
              নিরাপত্তা কিটে যুক্ত করে আরও সুরক্ষিত এবং নিশ্চিন্ত থাকুন।
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
            {addons.map((a, i) => (
              <div
                key={i}
                className="text-center p-5 rounded-2xl bg-muted/50 border border-border hover:border-primary/30 transition-colors"
              >
                <a.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <p className="text-xs font-bold text-foreground">{a.title}</p>
                <p className="text-[10px] text-muted-foreground">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Extra Benefits ────────────────────────── */}
      <section className="py-20 lg:py-28 terracotta-section">
        <div className="section-container">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              অন্যান্য সুবিধা
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-4xl mx-auto">
            {extraBenefits.map((b, i) => (
              <div key={i} className="p-6 rounded-2xl bg-card border border-border text-center">
                <b.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="text-sm font-bold text-foreground mb-1">{b.title}</h3>
                <p className="text-xs text-muted-foreground">{b.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <CompatibilityIcons variant="dark" />
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-primary text-primary-foreground text-center">
        <div className="section-container">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            আজই আপনার নিরাপত্তা নিশ্চিত করুন
          </h2>
          <p className="text-primary-foreground/70 max-w-lg mx-auto mb-8">
            সঠিক দামে উচ্চমানের পণ্য। European-Standard সিকিউরিটি সিস্টেম এখন বাংলাদেশে।
          </p>
          <Link
            to="/#order"
            className="inline-flex items-center gap-2 bg-primary-foreground text-primary px-10 py-4 rounded-full font-medium text-base hover:bg-primary-foreground/90 transition-colors"
          >
            অর্ডার করুন
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductDetails;
