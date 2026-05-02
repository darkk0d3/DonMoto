import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Droplets, Circle, Disc, Link as LinkIcon, Wrench, Settings, Fuel, Cpu, Zap, BatteryCharging, Lightbulb, Shield, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { services, type Service } from "@/data/services";

const iconMap: Record<string, React.ElementType> = {
  Droplets, Circle, Disc, Link: LinkIcon, Wrench, Settings, Fuel, Cpu, Zap,
  BatteryCharging, Lightbulb, Shield,
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};
const stagger = { show: { transition: { staggerChildren: 0.08 } } };

const categories = ["Maintenance", "Engine", "Electrical"] as const;
const categoryDesc: Record<string, string> = {
  Maintenance: "Routine servicing to keep your ride in peak condition.",
  Engine: "Deep mechanical work from tune-ups to full rebuilds.",
  Electrical: "Diagnostics, upgrades, and wiring for modern and classic bikes.",
};

function ServiceCard({ service }: { service: Service }) {
  const Icon = iconMap[service.icon] ?? Wrench;
  return (
    <motion.div variants={fadeUp}>
      <Card className="bg-gradient-card group hover:border-glow transition-all duration-300 shadow-industrial h-full">
        <CardContent className="p-6 flex gap-5">
          <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-oswald font-semibold uppercase tracking-wide text-base">{service.name}</h3>
              <span className="font-oswald font-bold text-primary whitespace-nowrap">{service.price}</span>
            </div>
            <p className="font-barlow text-muted-foreground text-sm leading-relaxed mb-2">{service.description}</p>
            <p className="font-barlow text-xs text-steel">Est. time: {service.timeframe}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function Services() {
  return (
    <main className="pt-24 pb-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-oswald text-xs uppercase tracking-[4px] text-primary mb-3">What We Offer</p>
          <h1 className="font-oswald font-bold uppercase text-5xl lg:text-6xl mb-4">Our Services</h1>
          <p className="font-barlow text-muted-foreground max-w-xl mx-auto text-lg">
            From quick oil changes to full engine rebuilds — every job gets the same precision attention.
          </p>
        </motion.div>

        {categories.map((cat) => (
          <section key={cat} className="mb-16">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <motion.div variants={fadeUp} className="flex items-end gap-4 mb-6 border-b border-border pb-4">
                <h2 className="font-oswald font-bold uppercase text-3xl">{cat}</h2>
                <p className="font-barlow text-muted-foreground text-sm pb-1">{categoryDesc[cat]}</p>
              </motion.div>
              <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.filter((s) => s.category === cat).map((s) => (
                  <ServiceCard key={s.id} service={s} />
                ))}
              </motion.div>
            </motion.div>
          </section>
        ))}

        {/* CTA */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="font-oswald font-bold uppercase text-2xl mb-3">Don't see what you need?</h3>
          <p className="font-barlow text-muted-foreground mb-6">Give us a call — we handle most makes and models.</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button asChild className="font-oswald uppercase tracking-wider">
              <Link to="/book">Book a Service <ArrowRight className="w-4 h-4" /></Link>
            </Button>
            <Button asChild variant="outline" className="font-oswald uppercase tracking-wider">
              <a href="tel:+15551234567">Call Us</a>
            </Button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
