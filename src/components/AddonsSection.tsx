import { useState } from "react";
import {
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

interface Addon {
  id: string;
  name: string;
  nameBn: string;
  icon: React.ElementType;
}

const addons: Addon[] = [
  { id: "sos", name: "SOS Band", nameBn: "এসওএস ব্যান্ড", icon: ShieldAlert },
  { id: "signal", name: "Signal Extender", nameBn: "সিগন্যাল এক্সটেন্ডার", icon: Radio },
  { id: "door", name: "Door Sensor", nameBn: "ডোর সেন্সর", icon: DoorOpen },
  { id: "bell", name: "Door Bell Button", nameBn: "ডোরবেল বাটন", icon: BellRing },
  { id: "gas", name: "Gas Leak Detector", nameBn: "গ্যাস লিক ডিটেক্টর", icon: Flame },
  { id: "vibration", name: "Vibration Sensor", nameBn: "ভাইব্রেশন সেন্সর", icon: Vibrate },
  { id: "motion", name: "Motion Sensor", nameBn: "মোশন সেন্সর", icon: ScanEye },
  { id: "siren", name: "Wireless Siren", nameBn: "ওয়্যারলেস সাইরেন", icon: Volume2 },
  { id: "shutter", name: "Shutter Sensor", nameBn: "শাটার সেন্সর", icon: PanelTop },
  { id: "camera", name: "Indoor PTZ Camera", nameBn: "ইনডোর PTZ ক্যামেরা", icon: Camera },
];

const AddonsSection = () => {
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  return (
    <section id="addons" className="py-24 lg:py-32 terracotta-section">
      <div className="section-container">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-widest text-primary font-medium mb-4">
            Addons Module
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            আপনার সিস্টেমে যোগ করুন
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            প্রয়োজন অনুযায়ী একাধিক সেন্সর এবং এক্সেসরিজ সংযুক্ত করুন। আপনার
            নিরাপত্তা, আপনার মতো করে।
          </p>
        </div>

        {/* Addons grid - Apple-style card selection */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
          {addons.map((addon) => {
            const isSelected = selectedAddons.includes(addon.id);
            return (
              <button
                key={addon.id}
                onClick={() => toggleAddon(addon.id)}
                className={`relative rounded-2xl p-5 text-center transition-all duration-300 ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-lg scale-[1.03]"
                    : "bg-card border border-border hover:border-primary/40 text-foreground"
                }`}
              >
                <addon.icon
                  className={`w-8 h-8 mx-auto mb-3 ${
                    isSelected ? "text-primary-foreground" : "text-primary"
                  }`}
                />
                <p className="text-xs font-semibold leading-tight">{addon.nameBn}</p>
                <p
                  className={`text-[10px] mt-1 ${
                    isSelected ? "text-primary-foreground/70" : "text-muted-foreground"
                  }`}
                >
                  {addon.name}
                </p>

                {isSelected && (
                  <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-card rounded-full flex items-center justify-center shadow">
                    <div className="w-3 h-3 bg-primary rounded-full" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {selectedAddons.length > 0 && (
          <div className="mt-10 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              {selectedAddons.length}টি অ্যাড-অন নির্বাচিত
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-medium hover:bg-brand-dark transition-colors"
            >
              কাস্টম কোটেশন নিন
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default AddonsSection;
