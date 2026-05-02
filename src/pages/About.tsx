import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Award, Users, Wrench, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const stagger = { show: { transition: { staggerChildren: 0.1 } } };

const team = [
  {
    name: "Don Moto",
    role: "Founder & Master Technician",
    cert: "ASE Master Certified, 20+ years exp.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400",
  },
  {
    name: "Carla Reyes",
    role: "Senior Mechanic",
    cert: "Honda & Yamaha Factory Trained",
    img: "https://images.unsplash.com/photo-1494790108755-2616b612b0a8?q=80&w=400",
  },
  {
    name: "Jake Osei",
    role: "Electrical Specialist",
    cert: "EFI & CAN-bus Diagnostics Expert",
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400",
  },
];

const stats = [
  { icon: Wrench, value: "8,000+", label: "Bikes Serviced" },
  { icon: Users, value: "3,500+", label: "Happy Riders" },
  { icon: Award, value: "20+", label: "Years in Business" },
  { icon: ShieldCheck, value: "100%", label: "Certified Work" },
];

export default function About() {
  return (
    <main className="pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-oswald text-xs uppercase tracking-[4px] text-primary mb-3">Our Story</p>
          <h1 className="font-oswald font-bold uppercase text-5xl lg:text-6xl mb-6">About DonMoto</h1>
          <p className="font-barlow text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            Founded in 2005 by a passionate rider who couldn't find a shop he trusted, DonMoto grew from a one-bay garage into the city's premier motorcycle service centre — with the same uncompromising standards that started it all.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20"
        >
          {stats.map(({ icon: Icon, value, label }) => (
            <motion.div key={label} variants={fadeUp}>
              <Card className="bg-gradient-card shadow-industrial text-center">
                <CardContent className="p-8">
                  <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <p className="font-oswald font-bold text-3xl text-gradient-primary mb-1">{value}</p>
                  <p className="font-barlow text-muted-foreground text-sm">{label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Story */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24"
        >
          <motion.div variants={fadeUp}>
            <h2 className="font-oswald font-bold uppercase text-3xl lg:text-4xl mb-5">
              Built on Trust &amp; <span className="text-gradient-primary">Expertise</span>
            </h2>
            <div className="space-y-4 font-barlow text-muted-foreground leading-relaxed">
              <p>
                What started as late nights wrenching on a CB750 in a rented bay has evolved into a fully certified workshop with eight service bays, factory-trained technicians, and a state-of-the-art diagnostic suite.
              </p>
              <p>
                We service everything from vintage two-strokes to the latest EFI superbikes, and we stock over 2,000 OEM and aftermarket parts on-site — so most jobs are completed the same day.
              </p>
              <p>
                Our certifications include ASE Master Technician, Honda PACT, Yamaha Technical Academy, and Bosch EFI Diagnostics Level 3. We back every service with a 12-month / 12,000-mile guarantee.
              </p>
            </div>
          </motion.div>
          <motion.div variants={fadeUp} className="rounded-xl overflow-hidden shadow-industrial border border-border">
            <img
              src="https://images.unsplash.com/photo-1558981033-0f0309284409?q=80&w=1200"
              alt="DonMoto workshop"
              loading="lazy"
              className="w-full h-80 object-cover"
            />
          </motion.div>
        </motion.div>

        {/* Team */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mb-24"
        >
          <motion.div variants={fadeUp} className="text-center mb-10">
            <p className="font-oswald text-xs uppercase tracking-[4px] text-primary mb-3">The Crew</p>
            <h2 className="font-oswald font-bold uppercase text-4xl">Meet the Team</h2>
          </motion.div>
          <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member) => (
              <motion.div key={member.name} variants={fadeUp}>
                <Card className="bg-gradient-card shadow-industrial overflow-hidden">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={member.img}
                      alt={member.name}
                      loading="lazy"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-oswald font-bold uppercase text-lg">{member.name}</h3>
                    <p className="font-barlow text-primary text-sm font-medium mb-1">{member.role}</p>
                    <p className="font-barlow text-muted-foreground text-sm">{member.cert}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Contact + Map */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          <motion.div variants={fadeUp}>
            <h2 className="font-oswald font-bold uppercase text-3xl mb-6">Find Us</h2>
            <ul className="space-y-5 font-barlow">
              {[
                { icon: MapPin, text: "1284 Ironworks Ave, Moto City, CA 90210" },
                { icon: Phone, text: "+1 (555) 123-4567", href: "tel:+15551234567" },
                { icon: Mail, text: "info@donmoto.com", href: "mailto:info@donmoto.com" },
              ].map(({ icon: Icon, text, href }) => (
                <li key={text} className="flex items-start gap-3">
                  <Icon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  {href ? (
                    <a href={href} className="text-muted-foreground hover:text-primary transition-colors">{text}</a>
                  ) : (
                    <span className="text-muted-foreground">{text}</span>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button asChild className="font-oswald uppercase tracking-wider">
                <Link to="/book">Book Your Service</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div variants={fadeUp}>
            {/* Google Maps placeholder */}
            <div className="rounded-xl overflow-hidden border border-border shadow-industrial h-72 lg:h-full min-h-[280px] bg-secondary flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapPin className="w-10 h-10 text-primary mx-auto mb-3" />
                <p className="font-oswald uppercase tracking-wider text-sm">Google Maps Embed</p>
                <p className="font-barlow text-xs mt-1">Replace with your&nbsp;&lt;iframe&gt; embed code</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
