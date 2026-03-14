import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Check, ChevronRight, Loader2, CheckCircle2, AlertCircle, Send } from "lucide-react";
import panelImage from "@/assets/panel-product.png";
import cubeImage from "@/assets/Sp1.png";
import howDevicesImage from "@/assets/how-devices.png";
import logoIcon from "@/assets/sohub-icon.png";

import imgShutter from "@/assets/Accesories/shutter sensor.jpeg";
import imgVibration from "@/assets/Accesories/vivration_sensor.jpeg";
import imgDoor from "@/assets/Accesories/door_sensor.jpeg";
import imgSmoke from "@/assets/Accesories/fire_alarm.jpeg";
import imgGas from "@/assets/Accesories/gas_sensor.jpeg";
import imgMotion from "@/assets/Accesories/motion_sensor.jpeg";
import imgSignal from "@/assets/Accesories/signal_extender.jpeg";
import imgSos from "@/assets/Accesories/sos_band.jpeg";
import imgSiren from "@/assets/Accesories/wireless_siren.jpeg";
import imgAiCamera from "@/assets/Accesories/ai_camera.jpeg";

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
  image: string;
}

const addons: Addon[] = [
  { id: "1", name: "Shutter Sensor", nameBn: "শাটার সেন্সর", price: 1550, image: imgShutter },
  { id: "2", name: "Vibration Sensor", nameBn: "ভাইব্রেশন সেন্সর", price: 2600, image: imgVibration },
  { id: "3", name: "Door Sensor", nameBn: "ডোর সেন্সর", price: 850, image: imgDoor },
  { id: "4", name: "Smoke Detector", nameBn: "স্মোক ডিটেক্টর", price: 4500, image: imgSmoke },
  { id: "5", name: "Gas Detector", nameBn: "গ্যাস ডিটেক্টর", price: 1850, image: imgGas },
  { id: "6", name: "Motion Sensor", nameBn: "মোশন সেন্সর", price: 1200, image: imgMotion },
  { id: "7", name: "Signal Extender", nameBn: "সিগন্যাল এক্সটেন্ডার", price: 4500, image: imgSignal },
  { id: "8", name: "SOS Band", nameBn: "এসওএস ব্যান্ড", price: 1200, image: imgSos },
  { id: "9", name: "Wireless Siren", nameBn: "ওয়্যারলেস সাইরেন", price: 2600, image: imgSiren },
  { id: "10", name: "AI Camera", nameBn: "AI ক্যামেরা", price: 3500, image: imgAiCamera },
];

type PaymentMethod = "online" | "cod";
type SubmitStatus = "idle" | "loading" | "success" | "error";

/* ─── Component ─── */
const Checkout = () => {
  const [searchParams] = useSearchParams();
  const initialEdition = editions.find(e => e.id === searchParams.get('edition'))?.id || "sp05";
  const [selectedEdition, setSelectedEdition] = useState(initialEdition);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("online");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    note: "",
  });

  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [orderId, setOrderId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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

  const isValid = formData.name.trim() && formData.phone.trim() && formData.address.trim();

  const handleSubmit = async () => {
    if (!isValid) return;

    setSubmitStatus("loading");
    setErrorMessage("");

    const selectedAddonDetails = selectedAddons
      .map((id) => {
        const addon = addons.find((a) => a.id === id);
        if (!addon) return null;
        return {
          id: addon.id,
          name: addon.name,
          nameBn: addon.nameBn,
          price: addon.price,
        };
      })
      .filter(Boolean);

    const orderPayload = {
      edition: {
        id: edition.id,
        name: edition.name,
        nameBn: edition.nameBn,
        desc: edition.desc,
        price: edition.price,
      },
      addons: selectedAddonDetails,
      paymentMethod,
      deliveryFee,
      total,
      customer: {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        note: formData.note.trim(),
      },
    };

    try {
      const response = await fetch("/api/send-order.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setOrderId(data.orderId || "");
        setSubmitStatus("success");
      } else {
        setErrorMessage(data.error || "Something went wrong. Please try again.");
        setSubmitStatus("error");
      }
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.");
      setSubmitStatus("error");
    }
  };

  const handleWhatsAppFallback = () => {
    const addonNames = selectedAddons
      .map((id) => addons.find((a) => a.id === id)?.name)
      .filter(Boolean)
      .join(", ");

    const message = [
      `*Order — SOHUB Protect*`,
      `Edition: ${edition.nameBn}`,
      addonNames ? `Add-ons: ${addonNames}` : "",
      `Payment: ${paymentMethod === "online" ? "Online Payment" : "Cash on Delivery"}`,
      `Total: ${total.toLocaleString()} BDT`,
      ``,
      `Name: ${formData.name}`,
      `Phone: ${formData.phone}`,
      formData.email ? `Email: ${formData.email}` : "",
      `Address: ${formData.address}`,
      formData.note ? `Note: ${formData.note}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    window.open(`https://wa.me/8809678076482?text=${encodeURIComponent(message)}`, "_blank");
  };

  /* ─── Success Screen ─── */
  if (submitStatus === "success") {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
          <div className="section-container flex items-center justify-between h-14">
            <Link
              to="/"
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Home
            </Link>
            <img src={logoIcon} alt="SOHUB" className="h-7" />
            <div className="w-16" />
          </div>
        </nav>

        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md mx-auto">
            {/* Success Animation */}
            <div className="relative mx-auto w-24 h-24 mb-6">
              <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" style={{ animationDuration: '2s' }} />
              <div className="relative w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-primary" />
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              অর্ডার সফলভাবে সম্পন্ন হয়েছে! 🎉
            </h1>

            {orderId && (
              <div className="inline-block bg-primary/10 border border-primary/20 px-5 py-2.5 rounded-full mb-4">
                <span className="text-primary font-bold text-sm tracking-wide">
                  🛡️ Order #{orderId}
                </span>
              </div>
            )}

            <p className="text-muted-foreground mb-2">
              আপনার ইমেইলে একটি কোটেশন পিডিএফ পাঠানো হয়েছে।
            </p>
            <p className="text-muted-foreground text-sm mb-8">
              আমাদের টিম শিগগিরই আপনার সাথে যোগাযোগ করবে
              অর্ডার নিশ্চিত করতে এবং ডেলিভারি নির্ধারণ করতে।
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium text-sm hover:bg-brand-dark transition-colors"
              >
                হোমে ফিরে যান
              </Link>
              <a
                href="tel:09678076482"
                className="inline-flex items-center justify-center gap-2 border border-border text-foreground px-8 py-3 rounded-full font-medium text-sm hover:bg-muted transition-colors"
              >
                📞 09678-076482
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                  className={`w-14 h-14 md:w-16 md:h-16 rounded-lg border-2 overflow-hidden flex items-center justify-center p-1.5 transition-colors ${selectedEdition === ed.id
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
                    disabled={submitStatus === "loading"}
                    className={`w-full text-left rounded-xl p-4 border-2 transition-all ${selectedEdition === ed.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                      } disabled:opacity-60`}
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
                          {ed.price.toLocaleString()} BDT
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
                      disabled={submitStatus === "loading"}
                      className={`relative rounded-xl p-3 text-center transition-all duration-200 ${isSelected
                        ? "bg-primary/10 border-2 border-primary"
                        : "bg-muted/30 border border-border hover:border-primary/30"
                        } disabled:opacity-60`}
                    >
                      <div className="w-12 h-12 md:w-14 md:h-14 mx-auto mb-2 bg-white rounded-lg shadow-sm flex items-center justify-center p-1.5 overflow-hidden">
                        <img
                          src={addon.image}
                          alt={addon.nameBn}
                          className="max-w-full max-h-full object-contain mix-blend-multiply"
                        />
                      </div>
                      <p className="text-[10px] md:text-xs font-medium leading-tight text-foreground">
                        {addon.nameBn}
                      </p>
                      <p className={`text-[10px] mt-1 font-semibold ${isSelected ? "text-primary" : "text-muted-foreground"}`}>
                        +{addon.price} BDT
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
                  {selectedAddons.length}টি এক্সেসরি নির্বাচিত • +{addonTotal.toLocaleString()} BDT
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
                  disabled={submitStatus === "loading"}
                  className={`w-full flex items-center justify-between rounded-xl p-4 border-2 transition-all ${paymentMethod === "online"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30"
                    } disabled:opacity-60`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === "online" ? "border-primary" : "border-muted-foreground"
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
                  disabled={submitStatus === "loading"}
                  className={`w-full flex items-center justify-between rounded-xl p-4 border-2 transition-all ${paymentMethod === "cod"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30"
                    } disabled:opacity-60`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === "cod" ? "border-primary" : "border-muted-foreground"
                      }`}>
                      {paymentMethod === "cod" && (
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-foreground">Cash on Delivery</span>
                  </div>
                  <span className="text-xs text-muted-foreground">+100 BDT</span>
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
                    disabled={submitStatus === "loading"}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors disabled:opacity-60"
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
                    disabled={submitStatus === "loading"}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground mb-1.5 block">
                    Email <span className="text-muted-foreground">(Optional — কোটেশন পিডিএফ পেতে ইমেইল দিন)</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    maxLength={255}
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={submitStatus === "loading"}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors disabled:opacity-60"
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
                    disabled={submitStatus === "loading"}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none disabled:opacity-60"
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
                    disabled={submitStatus === "loading"}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors disabled:opacity-60"
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
                  <span className="text-foreground font-medium">{edition.price.toLocaleString()} BDT</span>
                </div>
                {selectedAddons.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Accessories ({selectedAddons.length})</span>
                    <span className="text-foreground font-medium">{addonTotal.toLocaleString()} BDT</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className={`font-medium ${deliveryFee === 0 ? "text-primary" : "text-foreground"}`}>
                    {deliveryFee === 0 ? "FREE" : `+${deliveryFee} BDT`}
                  </span>
                </div>
                <div className="border-t border-border pt-3 mt-3 flex justify-between">
                  <span className="font-bold text-foreground">Total</span>
                  <span className="font-bold text-foreground text-lg">{total.toLocaleString()} BDT</span>
                </div>
              </div>

              {/* Error Message */}
              {submitStatus === "error" && (
                <div className="mt-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-destructive font-medium">{errorMessage}</p>
                    <button
                      onClick={handleWhatsAppFallback}
                      className="text-xs text-primary font-medium mt-1 hover:underline"
                    >
                      WhatsApp এ অর্ডার করুন →
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={!isValid || submitStatus === "loading"}
                className="w-full mt-6 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 rounded-full font-semibold text-sm hover:bg-brand-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitStatus === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    প্রসেসিং হচ্ছে...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    অর্ডার কনফার্ম করুন
                  </>
                )}
              </button>

              <p className="text-[10px] text-muted-foreground text-center mt-3">
                📧 আপনার ইমেইলে কোটেশন পিডিএফ সহ নিশ্চিতকরণ পাঠানো হবে
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
