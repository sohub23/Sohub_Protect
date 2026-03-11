import { useState, useMemo } from "react";
import {
  Check,
  ChevronRight,
  ShieldAlert,
  Radio,
  DoorOpen,
  BellRing,
  Flame,
  Vibrate,
  ScanEye,
  Volume2,
  PanelTop,
  Camera,
} from "lucide-react";
import panelImage from "@/assets/panel-product.png";
import cubeImage from "@/assets/cube-product.png";

/* ─── Data ─── */
const editions = [
  {
    id: "sp01",
    name: "Affordable Edition",
    nameBn: "SOHUB Protect Affordable Edition",
    desc: "Smart Cube Panel, Motion Sensor, Door Sensor, Remote, Power Adapter",
    price: 7490,
    image: cubeImage,
  },
  {
    id: "sp05",
    name: "Pro Edition",
    nameBn: "SOHUB Protect Pro Edition",
    desc: '5" Smart Touch Panel, Motion Sensor, Door Sensor, 2x Remote, Power Adapter',
    price: 15990,
    image: panelImage,
  },
];

const addons = [
  { id: "sos", name: "SOS Band", nameBn: "এসওএস ব্যান্ড", price: 560, icon: ShieldAlert },
  { id: "signal", name: "Signal Extender", nameBn: "সিগন্যাল এক্সটেন্ডার", price: 890, icon: Radio },
  { id: "door", name: "Door Sensor", nameBn: "ডোর সেন্সর", price: 690, icon: DoorOpen },
  { id: "bell", name: "Door Bell", nameBn: "ডোরবেল বাটন", price: 490, icon: BellRing },
  { id: "gas", name: "Gas Detector", nameBn: "গ্যাস ডিটেক্টর", price: 1290, icon: Flame },
  { id: "vibration", name: "Vibration Sensor", nameBn: "ভাইব্রেশন সেন্সর", price: 790, icon: Vibrate },
  { id: "motion", name: "Motion Sensor", nameBn: "মোশন সেন্সর", price: 690, icon: ScanEye },
  { id: "siren", name: "Wireless Siren", nameBn: "সাইরেন", price: 990, icon: Volume2 },
  { id: "shutter", name: "Shutter Sensor", nameBn: "শাটার সেন্সর", price: 890, icon: PanelTop },
  { id: "camera", name: "PTZ Camera", nameBn: "PTZ ক্যামেরা", price: 2490, icon: Camera },
];

type PaymentMethod = "online" | "cod";

const OrderSection = () => {
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
    () => selectedAddons.reduce((sum, id) => sum + (addons.find((x) => x.id === id)?.price ?? 0), 0),
    [selectedAddons]
  );

  const deliveryFee = paymentMethod === "cod" ? 100 : 0;
  const total = edition.price + addonTotal + deliveryFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isValid = formData.name.trim() && formData.phone.trim() && formData.address.trim();

  const handleSubmit = () => {
    if (!isValid) return;
    const addonNames = selectedAddons.map((id) => addons.find((a) => a.id === id)?.name).filter(Boolean).join(", ");
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
    ].filter(Boolean).join("\n");
    window.open(`https://wa.me/8809678076482?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <section id="order" className="py-24 lg:py-32 bg-background">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-widest text-primary font-medium mb-4">
            Order Now
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-3">
            অর্ডার করুন SOHUB Protect
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            সহজ কয়েকটি ধাপে আপনার অর্ডার সম্পন্ন করুন
          </p>
          <p className="text-primary text-xs font-medium mt-1">
            FREE Delivery • ১ বছরের ওয়ারেন্টি • #TruePrice
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_420px] gap-8 lg:gap-12 items-start max-w-5xl mx-auto">
          {/* Left — Product preview */}
          <div className="lg:sticky lg:top-20">
            <div className="bg-muted/40 rounded-2xl md:rounded-3xl p-6 md:p-10 flex items-center justify-center min-h-[280px] md:min-h-[420px]">
              <img
                src={edition.image}
                alt={edition.name}
                className="max-h-[200px] md:max-h-[340px] object-contain transition-all duration-500"
              />
            </div>
            {/* Thumbnails */}
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
                  <img src={ed.image} alt={ed.name} className="h-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* Right — Steps */}
          <div className="space-y-5">
            {/* Step 1 — Edition */}
            <div className="bg-card rounded-2xl border border-border p-5">
              <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <span className="text-primary">1.</span> Choose Your Edition
              </h3>
              <div className="space-y-2.5">
                {editions.map((ed) => (
                  <button
                    key={ed.id}
                    onClick={() => setSelectedEdition(ed.id)}
                    className={`w-full text-left rounded-xl p-3.5 border-2 transition-all ${
                      selectedEdition === ed.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-bold ${selectedEdition === ed.id ? "text-primary" : "text-foreground"}`}>
                          {ed.nameBn}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{ed.desc}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-sm font-bold text-foreground">৳{ed.price.toLocaleString()}</span>
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

            {/* Step 2 — Accessories */}
            <div className="bg-card rounded-2xl border border-border p-5">
              <h3 className="text-sm font-bold text-foreground mb-1 flex items-center gap-2">
                <span className="text-primary">2.</span> Add Accessories
                <span className="text-[11px] text-muted-foreground font-normal">(Optional)</span>
              </h3>
              <p className="text-[11px] text-muted-foreground mb-3">প্রয়োজন অনুযায়ী এক্সেসরিজ যোগ করুন</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                {addons.map((addon) => {
                  const sel = selectedAddons.includes(addon.id);
                  return (
                    <button
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`relative rounded-xl p-2.5 text-center transition-all ${
                        sel
                          ? "bg-primary/10 border-2 border-primary"
                          : "bg-muted/30 border border-border hover:border-primary/30"
                      }`}
                    >
                      <addon.icon className={`w-5 h-5 mx-auto mb-1 ${sel ? "text-primary" : "text-muted-foreground"}`} />
                      <p className="text-[10px] font-medium leading-tight text-foreground">{addon.nameBn}</p>
                      <p className={`text-[10px] mt-0.5 font-semibold ${sel ? "text-primary" : "text-muted-foreground"}`}>
                        +৳{addon.price}
                      </p>
                      {sel && (
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-primary rounded-full flex items-center justify-center">
                          <Check className="w-2 h-2 text-primary-foreground" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              {selectedAddons.length > 0 && (
                <p className="text-[11px] text-muted-foreground mt-2.5 text-center">
                  {selectedAddons.length}টি নির্বাচিত • +৳{addonTotal.toLocaleString()}
                </p>
              )}
            </div>

            {/* Step 3 — Payment */}
            <div className="bg-card rounded-2xl border border-border p-5">
              <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <span className="text-primary">3.</span> Payment Method
              </h3>
              <div className="space-y-2.5">
                {([
                  { key: "online" as const, label: "Online Payment", extra: <span className="text-[11px] font-semibold text-primary">FREE Delivery</span> },
                  { key: "cod" as const, label: "Cash on Delivery", extra: <span className="text-[11px] text-muted-foreground">+৳100</span> },
                ]).map(({ key, label, extra }) => (
                  <button
                    key={key}
                    onClick={() => setPaymentMethod(key)}
                    className={`w-full flex items-center justify-between rounded-xl p-3.5 border-2 transition-all ${
                      paymentMethod === key ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === key ? "border-primary" : "border-muted-foreground"
                      }`}>
                        {paymentMethod === key && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                      <span className="text-sm font-medium text-foreground">{label}</span>
                    </div>
                    {extra}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4 — Info */}
            <div className="bg-card rounded-2xl border border-border p-5">
              <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <span className="text-primary">4.</span> Your Information
              </h3>
              <div className="space-y-3">
                {([
                  { name: "name", label: "Name", placeholder: "আপনার নাম", required: true, type: "text", max: 100 },
                  { name: "phone", label: "Phone Number", placeholder: "01712345678", required: true, type: "tel", max: 15 },
                  { name: "email", label: "Email", placeholder: "your@email.com", required: false, type: "email", max: 255 },
                ] as const).map((field) => (
                  <div key={field.name}>
                    <label className="text-[11px] font-medium text-foreground mb-1 block">
                      {field.label} {field.required ? <span className="text-destructive">*</span> : <span className="text-muted-foreground">(Optional)</span>}
                    </label>
                    <input
                      type={field.type}
                      name={field.name}
                      placeholder={field.placeholder}
                      maxLength={field.max}
                      value={formData[field.name]}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    />
                  </div>
                ))}
                <div>
                  <label className="text-[11px] font-medium text-foreground mb-1 block">
                    Address <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    name="address"
                    placeholder="সম্পূর্ণ ঠিকানা লিখুন"
                    maxLength={500}
                    rows={2}
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-foreground mb-1 block">
                    Note <span className="text-muted-foreground">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="note"
                    placeholder="বিশেষ কোনো নির্দেশনা"
                    maxLength={300}
                    value={formData.note}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-card rounded-2xl border border-border p-5">
              <h3 className="text-sm font-bold text-foreground mb-3">Order Summary</h3>
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
                <div className="border-t border-border pt-2.5 mt-2.5 flex justify-between">
                  <span className="font-bold text-foreground">Total</span>
                  <span className="font-bold text-foreground text-lg">৳{total.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!isValid}
                className="w-full mt-5 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 rounded-full font-semibold text-sm hover:bg-brand-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                অর্ডার কনফার্ম করুন
                <ChevronRight className="w-4 h-4" />
              </button>
              <p className="text-[10px] text-muted-foreground text-center mt-2">
                WhatsApp এর মাধ্যমে আপনার অর্ডার কনফার্ম করা হবে
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderSection;
