import { Mic, Home, Smartphone } from "lucide-react";

interface CompatibilityIconsProps {
  variant?: "light" | "dark";
}

const CompatibilityIcons = ({ variant = "light" }: CompatibilityIconsProps) => {
  const textMuted = variant === "light" ? "text-primary-foreground/50" : "text-muted-foreground";
  const textMain = variant === "light" ? "text-primary-foreground/80" : "text-foreground";
  const iconBg = variant === "light" ? "bg-primary-foreground/10" : "bg-primary/10";
  const iconColor = variant === "light" ? "text-primary-foreground/70" : "text-primary";

  const platforms = [
    { icon: Home, label: "Google Home" },
    { icon: Mic, label: "Amazon Alexa" },
    { icon: Smartphone, label: "Smart Life" },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center md:justify-start gap-5">

      {platforms.map((p) => (
        <div key={p.label} className="flex items-center gap-2">
          <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl ${iconBg} flex items-center justify-center transition-transform hover:scale-110`}>
            <p.icon className={`w-4 h-4 md:w-5 md:h-5 ${iconColor}`} />
          </div>
          <span className={`text-[10px] md:text-sm font-medium ${textMain}`}>{p.label}</span>
        </div>
      ))}
    </div>
  );
};

export default CompatibilityIcons;
