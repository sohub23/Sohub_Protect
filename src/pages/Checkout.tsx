import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, ChevronRight, ShieldAlert, Radio, DoorOpen, BellRing, Flame, Vibrate, ScanEye, Volume2, PanelTop, Camera } from "lucide-react";
import panelImage from "@/assets/panel-product.png";
import cubeImage from "@/assets/cube-product.png";
import logoIcon from "@/assets/sohub-icon.png";

/* ─── Data ─── */
interface Edition {
  id: string;
  name: string;
  nameBn: string;
  desc: string;
  price: number;
  image: string;
  images: string[];
}

const editions: Edition[] = [
  {
    id: "sp01",
    name: "Affordable Edition",
    nameBn: "SOHUB Protect Affordable Edition",
    desc: "Smart Cube Panel, Motion Sensor, Door Sensor, Remote, Power Adapter",
    price: 7490,
    image: cubeImage,
    images: [cubeImage],
  },
  {
    id: "sp05",
    name: "Pro Edition",
    nameBn: "SOHUB Protect Pro Edition",
    desc: '5" Smart Touch Panel, Motion Sensor, Door Sensor, 2x Remote, Power Adapter',
    price: 15990,
    image: panelImage,
    images: [panelImage],
  },
];

interface Addon {
  id: string;
  name: string;
  nameBn: string;
  price: number;
  icon: React.ElementType;
}

const addons: Addon[] = [
  { id: "sos", name: "SOS Band", nameBn: "এসওএস ব্যান্ড", price: 560, icon: ShieldAlert },
  { id: "signal", name: "Signal Extender", nameBn: "সিগন্যাল এক্সটেন্ডার", price: 890, icon: Radio },
  { id: "door", name: "Door Sensor", nameBn: "ডোর সেন্সর", price: 690, icon: DoorOpen },
  { id: "bell", name: "Door Bell Button", nameBn: "ডোরবেল বাটন", price: 490, icon: BellRing },
  { id: "gas", name: "Gas Leak Detector", nameBn: "গ্যাস লিক ডিটেক্টর", price: 1290, icon: Flame },
  { id: "vibration", name: "Vibration Sensor", nameBn: "ভাইব্রেশন সেন্সর", price: 790, icon: Vibrate },
  { id: "motion", name: "Motion Sensor", nameBn: "মোশন সেন্সর", price: 690, icon: ScanEye },
  { id: "siren", name: "Wireless Siren", nameBn: "ওয়্যারলেস সাইরেন", price: 990, icon: Volume2 },
  { id: "shutter", name: "Shutter Sensor", nameBn: "শাটার সেন্সর", price: 890, icon: PanelTop },
  { id: "camera", name: "Indoor PTZ Camera", nameBn: "ইনডোর PTZ ক্যামেরা", price: 2490, icon: Camera },
];

type PaymentMethod = "online" | "cod";

/* ─── Component ─── */
const Checkout = () => {
  const [selectedEdition, setSelectedEdition] = useState("sp05");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("online");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    note: "",
  });

  const edition = editions.find((e) => e.id === selectedEdition)!;

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const addonTotal = useMemo(
    () =>
      selectedAddons.reduce((sum, id) => {
        const a = addons.find((x) => x.id === id);
        return sum + (a?.price ?? 0);
      }, 0),
    [selectedAddons]
  );

  const deliveryFee = paymentMethod === "cod" ? 100 : 0;
  const total = edition.price + addonTotal + deliveryFee;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) return;

    const addonNames = selectedAddons
      .map((id) => addons.find((a) => a.id === id)?.name)
      .filter(Boolean)
      .join(", ");

    const message = [
      `*Order — SOHUB Protect*`,
      `Edition: ${edition.nameBn}`,
      addonNames ? `Add-ons: ${addonNames}` : "",
      `Payment: ${paymentMethod === "online" ? "Online Payment" : "Cash on Delivery"}`,
      `Total: ৳${total.toLocaleString()}`,
      ``,
      `Name: ${formData.name}`,
      `Phone: ${formData.phone}`,
      formData.email ? `Email: ${formData.email}` : "",
      `Address: ${formData.address}`,
      formData.note ? `Note: ${formData.note}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/8809678076482?text=${encoded}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky nav */}
      <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="section-container flex items-center justify-between h-14">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <img src={logoIcon} alt="SOHUB" className="h-7" />
          <div className="w-16" />
        </div>
      </nav>

      {/* Header */}
      <div className="text-center pt-12 pb-8 px-4">
        <h1 className="text-2xl md:text-4xl font-bold text-foreground">
          Order Your SOHUB Protect
        </h1>
        <p className="text-muted-foreground mt-2 text-sm md:text-base">
          Complete your order in simple steps
        </p>
        <p className="text-primary text-xs md:text-sm font-medium mt-1">
          FREE Delivery. ১ বছরের ওয়ারেন্টি। #TruePrice
        </p>
      </div>

      <div className="section-container pb-24">
        <div className="grid lg:grid-cols-[1fr_420px] gap-8 lg:gap-12 items-start">
          {/* Left — Product image */}
          <div className="lg:sticky lg:top-20">
            <div className="bg-muted/40 rounded-2xl md:rounded-3xl p-6 md:p-10 flex items-center justify-center min-h-[300px] md:min-h-[460px]">
              <img
                src={edition.image}
                alt={edition.name}
                className="max-h-[220px] md:max-h-[360px] object-contain transition-all duration-500"
              />
            </div>
            {/* Thumbnail strip */}
            <div className="flex gap-2 mt-4">
              {editions.map((ed) => (
                <button
                  key={ed.id}
                  onClick={() => setSelectedEdition(ed.id)}
                  className={`w-14 h-14 md:w-16 md:h-16 rounded-lg border-2 overflow-hidden flex items-center justify-center p-1.5 transition-colors ${
                    selectedEdition === ed.id
                      ? "border-primary bg-muted/50"
                      : "border-border bg-card hover:border-primary/30"
                  }`}
                >
                  <img
                    src={ed.image}
                    alt={ed.name}
                    className="h-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right — Steps */}
          <div className="space-y-6">
            {/* Step 1 — Choose Edition */}
            <div className="bg-card rounded-2xl border border-border p-5 md:p-6">
              <h2 className="text-sm md:text-base font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="text-primary">1.</span> Choose Your Edition
              </h2>

              <div className="space-y-3">
                {editions.map((ed) => (
                  <button
                    key={ed.id}
                    onClick={() => setSelectedEdition(ed.id)}
                    className={`w-full text-left rounded-xl p-4 border-2 transition-all ${
                      selectedEdition === ed.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-bold ${selectedEdition === ed.id ? "text-primary" : "text-foreground"}`}>
                          {ed.nameBn}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {ed.desc}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                        <span className="text-sm md:text-base font-bold text-foreground">
                          ৳{ed.price.toLocaleString()}
                        </span>
                        {selectedEdition === ed.id && (
                          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-3 h-3 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2 — Add Accessories */}
            <div className="bg-card rounded-2xl border border-border p-5 md:p-6">
              <h2 className="text-sm md:text-base font-bold text-foreground mb-1 flex items-center gap-2">
                <span className="text-primary">2.</span> Add Accessories
                <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
              </h2>
              <p className="text-xs text-muted-foreground mb-4">
                আপনার প্রয়োজন অনুযায়ী এক্সেসরিজ যোগ করুন
              </p>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {addons.map((addon) => {
                  const isSelected = selectedAddons.includes(addon.id);
                  return (
                    <button
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`relative rounded-xl p-3 text-center transition-all duration-200 ${
                        isSelected
                          ? "bg-primary/10 border-2 border-primary"
                          : "bg-muted/30 border border-border hover:border-primary/30"
                      }`}
                    >
                      <addon.icon
                        className={`w-6 h-6 mx-auto mb-1.5 ${
                          isSelected ? "text-primary" : "text-muted-foreground"
                        }`}
                      />
                      <p className="text-[10px] md:text-xs font-medium leading-tight text-foreground">
                        {addon.nameBn}
                      </p>
                      <p className={`text-[10px] mt-1 font-semibold ${isSelected ? "text-primary" : "text-muted-foreground"}`}>
                        +৳{addon.price}
                      </p>
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-primary-foreground" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {selectedAddons.length > 0 && (
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  {selectedAddons.length}টি এক্সেসরি নির্বাচিত • +৳{addonTotal.toLocaleString()}
                </p>
              )}
            </div>

            {/* Step 3 — Payment Method */}
            <div className="bg-card rounded-2xl border border-border p-5 md:p-6">
              <h2 className="text-sm md:text-base font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="text-primary">3.</span> Payment Method
              </h2>

              <div className="space-y-3">
                <button
                  onClick={() => setPaymentMethod("online")}
                  className={`w-full flex items-center justify-between rounded-xl p-4 border-2 transition-all ${
                    paymentMethod === "online"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === "online" ? "border-primary" : "border-muted-foreground"
                    }`}>
                      {paymentMethod === "online" && (
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-foreground">Online Payment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-primary">FREE Delivery</span>
                    {paymentMethod === "online" && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod("cod")}
                  className={`w-full flex items-center justify-between rounded-xl p-4 border-2 transition-all ${
                    paymentMethod === "cod"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === "cod" ? "border-primary" : "border-muted-foreground"
                    }`}>
                      {paymentMethod === "cod" && (
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-foreground">Cash on Delivery</span>
                  </div>
                  <span className="text-xs text-muted-foreground">+৳100</span>
                </button>
              </div>
            </div>

            {/* Step 4 — Your Information */}
            <div className="bg-card rounded-2xl border border-border p-5 md:p-6">
              <h2 className="text-sm md:text-base font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="text-primary">4.</span> Your Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-foreground mb-1.5 block">
                    Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="আপনার নাম"
                    maxLength={100}
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground mb-1.5 block">
                    Phone Number <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="e.g., 01712345678"
                    maxLength={15}
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground mb-1.5 block">
                    Email <span className="text-muted-foreground">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    maxLength={255}
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground mb-1.5 block">
                    Address <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    name="address"
                    placeholder="সম্পূর্ণ ঠিকানা লিখুন"
                    maxLength={500}
                    rows={3}
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground mb-1.5 block">
                    Note <span className="text-muted-foreground">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="note"
                    placeholder="বিশেষ কোনো নির্দেশনা"
                    maxLength={300}
                    value={formData.note}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Order Summary & CTA */}
            <div className="bg-card rounded-2xl border border-border p-5 md:p-6">
              <h2 className="text-sm md:text-base font-bold text-foreground mb-4">
                Order Summary
              </h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{edition.name}</span>
                  <span className="text-foreground font-medium">৳{edition.price.toLocaleString()}</span>
                </div>
                {selectedAddons.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Accessories ({selectedAddons.length})</span>
                    <span className="text-foreground font-medium">৳{addonTotal.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className={`font-medium ${deliveryFee === 0 ? "text-primary" : "text-foreground"}`}>
                    {deliveryFee === 0 ? "FREE" : `৳${deliveryFee}`}
                  </span>
                </div>
                <div className="border-t border-border pt-3 mt-3 flex justify-between">
                  <span className="font-bold text-foreground">Total</span>
                  <span className="font-bold text-foreground text-lg">৳{total.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()}
                className="w-full mt-6 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 rounded-full font-semibold text-sm hover:bg-brand-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                অর্ডার কনফার্ম করুন
                <ChevronRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-muted-foreground text-center mt-3">
                WhatsApp এর মাধ্যমে আপনার অর্ডার কনফার্ম করা হবে
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
