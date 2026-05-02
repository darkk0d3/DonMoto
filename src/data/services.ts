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
    id: "oil-change",
    category: "Maintenance",
    name: "Oil & Filter Change",
    description: "Full synthetic or conventional oil change with OEM-grade filter replacement and 27-point safety inspection.",
    price: "$49",
    timeframe: "45 min",
    icon: "Droplets",
  },
  {
    id: "tire-service",
    category: "Maintenance",
    name: "Tire Replacement & Balancing",
    description: "Supply and fit any brand of motorcycle tire with precision wheel balancing and valve stem replacement.",
    price: "$79",
    timeframe: "1–2 hrs",
    icon: "Circle",
  },
  {
    id: "brake-service",
    category: "Maintenance",
    name: "Brake Service",
    description: "Pad replacement, rotor inspection, caliper cleaning, and brake fluid flush for front and/or rear.",
    price: "$89",
    timeframe: "1.5 hrs",
    icon: "Disc",
  },
  {
    id: "chain-service",
    category: "Maintenance",
    name: "Chain & Sprocket Service",
    description: "Chain cleaning, lubrication, tension adjustment, and sprocket wear assessment.",
    price: "$39",
    timeframe: "30 min",
    icon: "Link",
  },
  // Engine
  {
    id: "engine-rebuild",
    category: "Engine",
    name: "Full Engine Rebuild",
    description: "Complete top and bottom end rebuild with OEM or aftermarket parts, dyno testing included.",
    price: "From $1,299",
    timeframe: "5–10 days",
    icon: "Wrench",
  },
  {
    id: "valve-adjust",
    category: "Engine",
    name: "Valve Clearance Adjustment",
    description: "Precision valve clearance check and shimming to manufacturer specs for peak performance.",
    price: "$199",
    timeframe: "3–5 hrs",
    icon: "Settings",
  },
  {
    id: "carb-clean",
    category: "Engine",
    name: "Carburetor Clean & Tune",
    description: "Ultrasonic carb cleaning, jet replacement, and synchronisation for multi-carb setups.",
    price: "$129",
    timeframe: "2–4 hrs",
    icon: "Fuel",
  },
  {
    id: "efi-tuning",
    category: "Engine",
    name: "EFI Tuning & Diagnostics",
    description: "ECU scanning, fuel map adjustment, throttle body sync, and idle speed calibration.",
    price: "$149",
    timeframe: "2–3 hrs",
    icon: "Cpu",
  },
  // Electrical
  {
    id: "electrical-diag",
    category: "Electrical",
    name: "Electrical Diagnostics",
    description: "Full wiring harness check, voltage testing, fault code scanning and written report.",
    price: "$79",
    timeframe: "1–2 hrs",
    icon: "Zap",
  },
  {
    id: "battery-service",
    category: "Electrical",
    name: "Battery Service",
    description: "Load test, trickle charging, replacement with AGM or lithium battery and charging system check.",
    price: "$49",
    timeframe: "30 min",
    icon: "BatteryCharging",
  },
  {
    id: "lighting",
    category: "Electrical",
    name: "Lighting Upgrade",
    description: "LED conversion for headlight, tail light, indicators. Relay wiring and waterproofing included.",
    price: "$119",
    timeframe: "2–3 hrs",
    icon: "Lightbulb",
  },
  {
    id: "alarm",
    category: "Electrical",
    name: "Alarm & Immobiliser Install",
    description: "GPS tracker, proximity alarm, and kill-switch immobiliser professionally wired.",
    price: "$189",
    timeframe: "3 hrs",
    icon: "Shield",
  },
];
