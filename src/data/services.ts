export interface Service {
  id: string;
  category: "Maintenance" | "Engine" | "Electrical";
  name: string;
  description: string;
  price: string;
  timeframe: string;
  icon: string;
}

export const services: Service[] = [
  // Maintenance
  {
    id: "cvt-cleaning",
    category: "Maintenance",
    name: "CVT Cleaning",
    description: "Full clean of the Continuously Variable Transmission, belt inspection, and roller/variator servicing for smooth power delivery.",
    price: "Contact us",
    timeframe: "1–2 hrs",
    icon: "Settings",
  },
  {
    id: "minor-wiring",
    category: "Maintenance",
    name: "Minor Wiring",
    description: "Repair and reconnection of loose, damaged, or corroded wiring connections to restore proper electrical function.",
    price: "Contact us",
    timeframe: "30–60 min",
    icon: "Zap",
  },

  // Engine
  {
    id: "fullwave",
    category: "Engine",
    name: "Fullwave Conversion",
    description: "Upgrade your charging system to full-wave rectification for stronger, more consistent power output and better battery health.",
    price: "Contact us",
    timeframe: "2–3 hrs",
    icon: "Cpu",
  },
  {
    id: "top-overhaul",
    category: "Engine",
    name: "Top Overhaul",
    description: "Complete cylinder head service — valve lapping, piston ring replacement, gasket renewal, and compression restoration.",
    price: "Contact us",
    timeframe: "1–2 days",
    icon: "Wrench",
  },
  {
    id: "general-overhaul",
    category: "Engine",
    name: "General Overhaul Mechanical",
    description: "Full mechanical overhaul covering engine internals, transmission components, and drivetrain inspection and reconditioning.",
    price: "Contact us",
    timeframe: "3–5 days",
    icon: "Settings",
  },
  {
    id: "tune-up",
    category: "Engine",
    name: "Tune-Up (2–4 Valve)",
    description: "Spark plug replacement, valve clearance adjustment, air filter service, and carburetor/injector synchronisation.",
    price: "Contact us",
    timeframe: "1–2 hrs",
    icon: "Fuel",
  },

  // Electrical
  {
    id: "scan-diagnose",
    category: "Electrical",
    name: "Scan Diagnose",
    description: "OBD / diagnostic tool scan of your motorcycle's ECU to read and interpret fault codes, sensors, and live data.",
    price: "Contact us",
    timeframe: "30–60 min",
    icon: "Zap",
  },
  {
    id: "general-wiring",
    category: "Electrical",
    name: "General Wiring",
    description: "Full harness inspection, rewiring of damaged sections, connector replacement, and proper grounding for reliable electrics.",
    price: "Contact us",
    timeframe: "2–4 hrs",
    icon: "Cable",
  },
  {
    id: "alarm-installation",
    category: "Electrical",
    name: "Alarm Installation",
    description: "Professional fitting of motorcycle alarm and immobiliser system with remote key fob and anti-theft wiring.",
    price: "Contact us",
    timeframe: "2–3 hrs",
    icon: "Shield",
  },
  {
    id: "electrical-problem",
    category: "Electrical",
    name: "Electrical Problem Diagnosis",
    description: "Systematic troubleshooting of shorts, open circuits, charging faults, and lighting issues with a full written report.",
    price: "Contact us",
    timeframe: "1–2 hrs",
    icon: "BatteryCharging",
  },
  {
    id: "gps-tracking",
    category: "Electrical",
    name: "GPS Tracking Installation",
    description: "Discreet GPS tracker installation with hidden wiring, real-time location monitoring setup and app configuration.",
    price: "Contact us",
    timeframe: "1–2 hrs",
    icon: "MapPin",
  },
  {
    id: "reset-error-codes",
    category: "Electrical",
    name: "Resetting Error Codes",
    description: "Clear stored and active diagnostic trouble codes (DTCs) from the ECU after repair, with confirmation test.",
    price: "Contact us",
    timeframe: "15–30 min",
    icon: "RotateCcw",
  },
];
