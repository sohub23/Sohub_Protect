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

interface Addon {
  id: string;
  name: string;
  nameBn: string;
  image: string;
}

const addons: Addon[] = [
  { id: "1", name: "Shutter Sensor", nameBn: "শাটার সেন্সর", image: imgShutter },
  { id: "2", name: "Vibration Sensor", nameBn: "ভাইব্রেশন সেন্সর", image: imgVibration },
  { id: "3", name: "Door Sensor", nameBn: "ডোর সেন্সর", image: imgDoor },
  { id: "4", name: "Smoke Detector", nameBn: "স্মোক ডিটেক্টর", image: imgSmoke },
  { id: "5", name: "Gas Detector", nameBn: "গ্যাস ডিটেক্টর", image: imgGas },
  { id: "6", name: "Motion Sensor", nameBn: "মোশন সেন্সর", image: imgMotion },
  { id: "7", name: "Signal Extender", nameBn: "সিগন্যাল এক্সটেন্ডার", image: imgSignal },
  { id: "8", name: "SOS Band", nameBn: "এসওএস ব্যান্ড", image: imgSos },
  { id: "9", name: "Wireless Siren", nameBn: "ওয়্যারলেস সাইরেন", image: imgSiren },
  { id: "10", name: "AI Camera", nameBn: "AI ক্যামেরা", image: imgAiCamera }
];

const AddonsSection = () => {
  return (
    <section id="addons" className="py-24 lg:py-32" style={{ backgroundColor: '#1f98d1' }}>
      <div className="section-container">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-widest text-white/80 font-medium mb-4">
            Addons Module
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            আপনার সিস্টেমে যোগ করুন
          </h2>
          <p className="text-white/80 max-w-lg mx-auto">
            প্রয়োজন অনুযায়ী একাধিক সেন্সর এবং এক্সেসরিজ সংযুক্ত করুন। আপনার
            নিরাপত্তা, আপনার মতো করে।
          </p>
        </div>

        {/* Addons grid - non-selectable display */}
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3 md:gap-4 max-w-4xl mx-auto">
          {addons.map((addon) => (
            <div
              key={addon.id}
              className="rounded-xl md:rounded-2xl p-2 md:p-4 text-center bg-card border border-border hover:border-primary/40 text-foreground shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-14 h-14 md:w-28 md:h-28 mx-auto mb-2 md:mb-4 rounded-lg md:rounded-xl flex items-center justify-center p-1 md:p-2 overflow-hidden">
                <img
                  src={addon.image}
                  alt={addon.nameBn}
                  className="max-w-full max-h-full object-contain mix-blend-multiply"
                />
              </div>
              <p className="text-[10px] md:text-xs font-semibold leading-tight">{addon.nameBn}</p>
              <p className="text-[8px] md:text-[10px] mt-0.5 md:mt-1 text-muted-foreground">
                {addon.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AddonsSection;
