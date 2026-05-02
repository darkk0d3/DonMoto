import { Phone } from "lucide-react";

export default function EmergencyButton() {
  return (
    <a
      href="tel:+15551234567"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-primary text-primary-foreground font-oswald font-bold uppercase tracking-wider text-sm px-5 py-3 rounded-full pulse-glow shadow-glow-md transition-transform hover:scale-105 active:scale-95"
    >
      <Phone className="w-4 h-4" />
      <span className="hidden sm:inline">Emergency</span>
    </a>
  );
}
