import { Phone } from "lucide-react";

export default function EmergencyButton() {
  return (
    <a
      href="tel:+639496816756"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2 bg-primary text-primary-foreground font-oswald font-bold uppercase tracking-wider text-sm px-4 py-2.5 sm:px-5 sm:py-3 rounded-full pulse-glow shadow-glow-md transition-transform hover:scale-105 active:scale-95"
    >
      <Phone className="w-4 h-4" />
      <span className="hidden sm:inline">Emergency</span>
    </a>
  );
}
