import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center pt-16">
      <motion.div
        className="text-center px-6"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Wrench className="w-14 h-14 text-primary mx-auto mb-6 opacity-60" />
        <h1 className="font-oswald font-bold uppercase text-7xl lg:text-9xl text-gradient-primary mb-4">404</h1>
        <h2 className="font-oswald font-bold uppercase text-2xl lg:text-3xl mb-4">Page Not Found</h2>
        <p className="font-barlow text-muted-foreground text-lg mb-8 max-w-sm mx-auto">
          Looks like this page is in the shop. Let's get you back on the road.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button asChild className="font-oswald uppercase tracking-wider">
            <Link to="/">Back to Home</Link>
          </Button>
          <Button asChild variant="outline" className="font-oswald uppercase tracking-wider">
            <Link to="/services">View Services</Link>
          </Button>
        </div>
      </motion.div>
    </main>
  );
}
