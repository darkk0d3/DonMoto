import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Award, Clock, Settings, Wrench, Zap, Star, ArrowRight, MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ReviewForm from "@/components/ReviewForm";
import { getReviews, type ReviewEntry } from "@/lib/store";
import { products } from "@/data/products";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const stagger = {
  show: { transition: { staggerChildren: 0.1 } },
};

const featuredProducts = products.slice(0, 4);

const testimonials = [
  {
    name: "Marcus T.",
    bike: "Yamaha MT-07",
    quote: "Dropped my MT-07 off for a full service and got it back the same day, running better than ever. These guys genuinely know their craft.",
    rating: 5,
  },
  {
    name: "Priya L.",
    bike: "Honda CB500F",
    quote: "I was nervous bringing my bike here for the first time but the team walked me through every step. Fair pricing and zero upselling.",
    rating: 5,
  },
  {
    name: "Dave K.",
    bike: "BMW R 1250 GS",
    quote: "Electrical fault that two other shops couldn't diagnose. DonMoto had it fixed in a couple of hours. Absolutely outstanding.",
    rating: 5,
  },
];

export default function Index() {
  const [liveReviews, setLiveReviews] = useState<ReviewEntry[]>([]);

  useEffect(() => {
    setLiveReviews(getReviews().filter((r) => r.approved));
  }, []);

  function handleReviewSubmitted() {
    setLiveReviews(getReviews().filter((r) => r.approved));
  }

  return (
    <main>
      {/* Hero */}
      <section
        className="relative min-h-screen flex items-center"
        style={{
          background:
            'linear-gradient(to right, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.65) 60%, rgba(0,0,0,0.25) 100%), linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 40%), url("https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=2070") no-repeat center center / cover',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-20 w-full">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="max-w-2xl"
          >
            <motion.p
              variants={fadeUp}
              className="font-oswald text-xs uppercase tracking-[4px] text-primary mb-6"
            >
              Certified Motorcycle Service
            </motion.p>

            <motion.h1
              variants={fadeUp}
              className="font-oswald font-bold uppercase leading-[0.95] text-4xl sm:text-5xl lg:text-7xl mb-6"
            >
              Built to Ride.<br />
              <span className="text-gradient-primary">Built to Last.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="font-barlow text-muted-foreground text-base sm:text-lg mb-8 sm:mb-10 max-w-lg leading-relaxed"
            >
              Expert mechanical repairs, electrical diagnostics, and premium parts — all under one roof. Trusted by riders since 2005.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 sm:gap-4 mb-10 sm:mb-14">
              <Button asChild size="xl" className="font-oswald uppercase tracking-wider">
                <Link to="/book">
                  Book a Service <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button asChild size="xl" variant="outline" className="font-oswald uppercase tracking-wider border-border">
                <Link to="/services">View Services</Link>
              </Button>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              {[
                { icon: Shield, label: "Certified Mechanics" },
                { icon: Award, label: "5-Star Rated" },
                { icon: Clock, label: "Same-Day Service" },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm font-barlow text-foreground"
                >
                  <Icon className="w-4 h-4 text-primary" />
                  {label}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <motion.div variants={fadeUp} className="text-center mb-12">
            <p className="font-oswald text-xs uppercase tracking-[4px] text-primary mb-3">What We Do</p>
            <h2 className="font-oswald font-bold uppercase text-4xl lg:text-5xl">Our Services</h2>
          </motion.div>

          <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { id: "oil-change", label: "Maintenance", price: "Contact us", icon: Settings, desc: "CVT cleaning, tune-ups, and full mechanical overhauls." },
              { id: "engine-rebuild", label: "Engine Work", price: "Contact us", icon: Wrench, desc: "Top overhaul, general overhaul, fullwave conversion, and more." },
              { id: "electrical-diag", label: "Electrical", price: "Contact us", icon: Zap, desc: "Wiring, alarm installation, GPS tracking, and fault diagnosis." },
            ].map(({ label, price, icon: Icon, desc }) => (
              <motion.div key={label} variants={fadeUp}>
                <Card className="bg-gradient-card group hover:border-glow transition-all duration-300 h-full shadow-industrial">
                  <CardContent className="p-5 sm:p-8">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-oswald font-bold uppercase text-xl mb-2">{label}</h3>
                    <p className="text-muted-foreground text-sm font-barlow mb-4 leading-relaxed">{desc}</p>
                    <p className="font-oswald text-lg font-bold text-primary">{price}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="text-center mt-10">
            <Button asChild variant="outline" className="font-oswald uppercase tracking-wider">
              <Link to="/services">View All Services</Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Products */}
      <section className="bg-surface py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeUp} className="text-center mb-12">
              <p className="font-oswald text-xs uppercase tracking-[4px] text-primary mb-3">Parts & Gear</p>
              <h2 className="font-oswald font-bold uppercase text-4xl lg:text-5xl">Featured Products</h2>
            </motion.div>

            <motion.div variants={stagger} className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              {featuredProducts.map((product) => (
                <motion.div key={product.id} variants={fadeUp}>
                  <Link to="/shop" className="block group">
                    <Card className="overflow-hidden border-border hover:border-primary/50 transition-all duration-300 shadow-industrial">
                      <div className="relative overflow-hidden aspect-square">
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
                        <span className="absolute top-2 right-2 bg-black/60 text-foreground text-xs font-barlow px-2 py-1 rounded">
                          {product.category}
                        </span>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-oswald font-semibold text-sm uppercase leading-snug mb-1">{product.name}</h3>
                        <p className="font-oswald text-lg font-bold text-primary">₱{product.price}</p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="text-center mt-10">
              <Button asChild variant="outline" className="font-oswald uppercase tracking-wider">
                <Link to="/shop">Browse Full Shop</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <motion.div variants={fadeUp} className="text-center mb-12">
            <p className="font-oswald text-xs uppercase tracking-[4px] text-primary mb-3">What Riders Say</p>
            <h2 className="font-oswald font-bold uppercase text-4xl lg:text-5xl">Testimonials</h2>
          </motion.div>

          <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <motion.div key={t.name} variants={fadeUp}>
                <Card className="bg-gradient-card shadow-industrial h-full">
                  <CardContent className="p-7">
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="font-barlow text-muted-foreground italic mb-5 leading-relaxed">"{t.quote}"</p>
                    <div>
                      <p className="font-oswald font-semibold uppercase tracking-wide text-sm">{t.name}</p>
                      <p className="font-barlow text-xs text-muted-foreground">{t.bike}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Customer Reviews */}
      {liveReviews.length > 0 && (
        <section className="bg-surface py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <motion.div variants={fadeUp} className="text-center mb-12">
                <p className="font-oswald text-xs uppercase tracking-[4px] text-primary mb-3">Verified Customers</p>
                <h2 className="font-oswald font-bold uppercase text-4xl lg:text-5xl">Customer Reviews</h2>
              </motion.div>

              <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {liveReviews.map((r) => (
                  <motion.div key={r.id} variants={fadeUp}>
                    <Card className="bg-gradient-card shadow-industrial h-full">
                      <CardContent className="p-7">
                        <div className="flex gap-1 mb-4">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < r.rating ? "fill-primary text-primary" : "text-muted-foreground/30"}`}
                            />
                          ))}
                        </div>
                        <p className="font-barlow text-muted-foreground italic mb-5 leading-relaxed">"{r.quote}"</p>
                        <div>
                          <p className="font-oswald font-semibold uppercase tracking-wide text-sm">{r.name}</p>
                          {r.bike && <p className="font-barlow text-xs text-muted-foreground">{r.bike}</p>}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Leave a Review */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <motion.div variants={fadeUp} className="text-center mb-12">
            <p className="font-oswald text-xs uppercase tracking-[4px] text-primary mb-3">Share Your Experience</p>
            <h2 className="font-oswald font-bold uppercase text-4xl lg:text-5xl flex items-center justify-center gap-3">
              <MessageSquarePlus className="w-9 h-9 text-primary" />
              Leave a Review
            </h2>
            <p className="font-barlow text-muted-foreground mt-4 max-w-md mx-auto">
              Rode with us? Tell others about your experience. Reviews are published after a quick check by our team.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="max-w-xl mx-auto">
            <ReviewForm onSubmitted={handleReviewSubmitted} />
          </motion.div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-20">
        <motion.div
          className="max-w-3xl mx-auto px-6 text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-oswald font-bold uppercase text-3xl sm:text-4xl lg:text-5xl text-primary-foreground mb-5">
            Ready to Ride?
          </h2>
          <p className="font-barlow text-primary-foreground/80 text-lg mb-8">
            Book your appointment online and get your bike back on the road, fast.
          </p>
          <Button
            asChild
            size="xl"
            variant="outline"
            className="font-oswald uppercase tracking-wider border-white/40 text-white hover:bg-white hover:text-primary"
          >
            <Link to="/book">Book Now <ArrowRight className="w-5 h-5" /></Link>
          </Button>
        </motion.div>
      </section>
    </main>
  );
}
