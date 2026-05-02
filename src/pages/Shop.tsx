import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Check } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { getProducts, getBikeModels, type ProductEntry } from "@/lib/store";
import { useCart } from "@/lib/CartContext";

const categories = ["All", "Tires", "Lubricants", "Parts", "Gear"] as const;
type Category = (typeof categories)[number];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};
const stagger = { show: { transition: { staggerChildren: 0.07 } } };

function ProductCard({ product }: { product: ProductEntry }) {
  const { addItem, setDrawerOpen } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image });
    toast.success("Added to cart!", { description: product.name });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
    setDrawerOpen(true);
  };

  return (
    <motion.div variants={fadeUp} layout>
      <Card className="overflow-hidden group hover:border-primary/50 transition-all duration-300 shadow-industrial h-full">
        <div className="relative overflow-hidden aspect-[4/3]">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {product.badge && (
            <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-oswald uppercase tracking-wider px-2 py-1 rounded">
              {product.badge}
            </span>
          )}
          <span className="absolute top-2 right-2 bg-black/60 text-xs font-barlow px-2 py-1 rounded">
            {product.category}
          </span>
        </div>
        <CardContent className="p-4">
          <h3 className="font-oswald font-semibold text-sm uppercase leading-snug mb-1">{product.name}</h3>
          <p className="font-oswald text-xl font-bold text-primary mb-3">₱{product.price.toLocaleString()}</p>
          <div className="flex flex-wrap gap-1 mb-3">
            {product.compatibleModels.slice(0, 3).map((m) => (
              <span key={m} className="text-xs font-barlow bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">
                {m}
              </span>
            ))}
            {product.compatibleModels.length > 3 && (
              <span className="text-xs font-barlow text-muted-foreground px-2 py-0.5">
                +{product.compatibleModels.length - 3} more
              </span>
            )}
          </div>
          <Button
            size="sm"
            className="w-full font-oswald uppercase tracking-wider text-xs"
            variant={added ? "default" : "outline"}
            onClick={handleAddToCart}
          >
            {added ? (
              <><Check className="w-3.5 h-3.5 mr-1" /> Added!</>
            ) : (
              <><ShoppingCart className="w-3.5 h-3.5 mr-1" /> Add to Cart</>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function Shop() {
  const [category, setCategory] = useState<Category>("All");
  const [bikeFilter, setBikeFilter] = useState<string>("All");
  const [products] = useState<ProductEntry[]>(getProducts);
  const bikeModels = getBikeModels();

  const filtered = products.filter((p) => {
    const catMatch = category === "All" || p.category === category;
    const bikeMatch = bikeFilter === "All" || p.compatibleModels.includes(bikeFilter);
    return catMatch && bikeMatch;
  });

  return (
    <main className="pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-oswald text-xs uppercase tracking-[4px] text-primary mb-3">Premium Parts & Gear</p>
          <h1 className="font-oswald font-bold uppercase text-3xl sm:text-5xl lg:text-6xl mb-4">The Shop</h1>
          <p className="font-barlow text-muted-foreground max-w-xl mx-auto text-base sm:text-lg">
            OEM and aftermarket parts, fluids, and rider gear for all major makes and models.
          </p>
        </motion.div>

        {/* Category filter */}
        <div className="flex justify-center mb-6">
          <Tabs value={category} onValueChange={(v) => setCategory(v as Category)}>
            <TabsList className="flex-wrap h-auto gap-1">
              {categories.map((c) => (
                <TabsTrigger key={c} value={c} className="font-oswald uppercase tracking-wider text-xs">
                  {c}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Bike model filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {["All", ...bikeModels].map((model) => (
            <button
              key={model}
              onClick={() => setBikeFilter(model)}
              className={cn(
                "font-barlow text-xs px-3 py-1.5 rounded-full border transition-all duration-200",
                bikeFilter === model
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-transparent text-muted-foreground border-border hover:border-primary/50"
              )}
            >
              {model}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="font-barlow text-sm text-muted-foreground mb-6">
          Showing <span className="text-foreground font-medium">{filtered.length}</span> products
        </p>

        {/* Grid */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
        >
          {filtered.length > 0 ? (
            filtered.map((p) => <ProductCard key={p.id} product={p} />)
          ) : (
            <motion.p variants={fadeUp} className="col-span-full text-center font-barlow text-muted-foreground py-16 text-lg">
              No products match your current filters.
            </motion.p>
          )}
        </motion.div>
      </div>
    </main>
  );
}
