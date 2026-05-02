import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/lib/CartContext";
import { Button } from "@/components/ui/button";

export default function CartDrawer() {
  const { cart, removeItem, clearCart, total, itemCount, drawerOpen, setDrawerOpen } = useCart();

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDrawerOpen(false)}
          />

          <motion.div
            className="fixed top-0 right-0 z-50 h-full w-full sm:w-96 bg-card border-l border-border flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary" />
                <h2 className="font-oswald font-bold uppercase tracking-wider text-lg">
                  Cart ({itemCount})
                </h2>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground gap-3">
                  <ShoppingCart className="w-12 h-12 opacity-30" />
                  <p className="font-barlow">Your cart is empty.</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="font-oswald uppercase tracking-wider"
                    onClick={() => setDrawerOpen(false)}
                    asChild
                  >
                    <Link to="/shop">Browse Shop</Link>
                  </Button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.productId} className="flex gap-3 items-start">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg border border-border shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-oswald font-semibold uppercase text-sm leading-snug line-clamp-2">
                        {item.name}
                      </p>
                      <p className="font-barlow text-muted-foreground text-xs mt-0.5">
                        Qty: {item.quantity}
                      </p>
                      <p className="font-oswald text-primary font-bold text-sm mt-1">
                        ₱{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-muted-foreground hover:text-destructive transition-colors mt-1 shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-border p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-barlow text-muted-foreground">Total</span>
                  <span className="font-oswald font-bold text-xl text-primary">
                    ₱{total.toLocaleString()}
                  </span>
                </div>
                <Button className="w-full font-oswald uppercase tracking-wider" onClick={() => setDrawerOpen(false)} asChild>
                  <Link to="/book">Book a Service to Install</Link>
                </Button>
                <button
                  onClick={clearCart}
                  className="w-full font-barlow text-xs text-muted-foreground hover:text-destructive transition-colors text-center"
                >
                  Clear cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
