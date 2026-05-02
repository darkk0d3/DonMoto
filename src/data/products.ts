export interface Product {
  id: string;
  category: "Tires" | "Lubricants" | "Parts" | "Gear";
  name: string;
  price: number;
  image: string;
  compatibleModels: string[];
  badge?: string;
}

export const bikeModels = [
  "Honda CB500F",
  "Yamaha MT-07",
  "Kawasaki Z900",
  "Suzuki GSX-S750",
  "Ducati Monster",
  "BMW R 1250 GS",
  "KTM Duke 390",
  "Royal Enfield 650",
];

export const products: Product[] = [
  {
    id: "tire-pirelli-front",
    category: "Tires",
    name: "Pirelli Angel GT2 Front",
    price: 149,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600",
    compatibleModels: ["Honda CB500F", "Yamaha MT-07", "Kawasaki Z900"],
    badge: "Best Seller",
  },
  {
    id: "tire-michelin-rear",
    category: "Tires",
    name: "Michelin Road 6 Rear",
    price: 189,
    image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=600",
    compatibleModels: ["Yamaha MT-07", "Suzuki GSX-S750", "Ducati Monster"],
  },
  {
    id: "tire-dunlop-sport",
    category: "Tires",
    name: "Dunlop Sportmax Q5S",
    price: 169,
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?q=80&w=600",
    compatibleModels: ["Kawasaki Z900", "BMW R 1250 GS", "KTM Duke 390"],
    badge: "New",
  },
  {
    id: "oil-motul-300v",
    category: "Lubricants",
    name: "Motul 300V 10W-40 1L",
    price: 32,
    image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=600",
    compatibleModels: ["Honda CB500F", "Yamaha MT-07", "Kawasaki Z900", "Suzuki GSX-S750"],
  },
  {
    id: "oil-castrol-power",
    category: "Lubricants",
    name: "Castrol Power 1 Racing 4T",
    price: 28,
    image: "https://images.unsplash.com/photo-1637584943780-4a5be3942744?q=80&w=600",
    compatibleModels: ["Honda CB500F", "Royal Enfield 650", "KTM Duke 390"],
  },
  {
    id: "chain-lube-maxima",
    category: "Lubricants",
    name: "Maxima Chain Wax Spray",
    price: 18,
    image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?q=80&w=600",
    compatibleModels: ["Honda CB500F", "Yamaha MT-07", "Kawasaki Z900", "KTM Duke 390", "Royal Enfield 650"],
    badge: "Popular",
  },
  {
    id: "brakes-ebc-front",
    category: "Parts",
    name: "EBC Double-H Front Brake Pads",
    price: 64,
    image: "https://images.unsplash.com/photo-1568139235586-8c2d45e4ed45?q=80&w=600",
    compatibleModels: ["Yamaha MT-07", "Kawasaki Z900", "Ducati Monster"],
  },
  {
    id: "air-filter-k-n",
    category: "Parts",
    name: "K&N High-Flow Air Filter",
    price: 89,
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=600",
    compatibleModels: ["Honda CB500F", "Kawasaki Z900", "BMW R 1250 GS"],
    badge: "Performance",
  },
  {
    id: "exhaust-akrapovic",
    category: "Parts",
    name: "Akrapovic Slip-On Exhaust",
    price: 549,
    image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=600",
    compatibleModels: ["Yamaha MT-07", "Kawasaki Z900", "Ducati Monster"],
    badge: "Premium",
  },
  {
    id: "helmet-shoei",
    category: "Gear",
    name: "Shoei NXR2 Full-Face Helmet",
    price: 699,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600",
    compatibleModels: bikeModels,
    badge: "Top Rated",
  },
  {
    id: "jacket-alpinestars",
    category: "Gear",
    name: "Alpinestars T-GP Plus R v3",
    price: 299,
    image: "https://images.unsplash.com/photo-1591375462848-a90bb2dfb75e?q=80&w=600",
    compatibleModels: bikeModels,
  },
  {
    id: "gloves-dainese",
    category: "Gear",
    name: "Dainese Carbon 4 Gloves",
    price: 149,
    image: "https://images.unsplash.com/photo-1558618047-f4743b6d5ed1?q=80&w=600",
    compatibleModels: bikeModels,
    badge: "New",
  },
];
