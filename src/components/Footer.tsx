import { Link } from "react-router-dom";
import { Wrench, Phone, Mail, MapPin, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Wrench className="w-5 h-5 text-primary" />
              <span className="font-oswald text-lg font-bold uppercase tracking-wider">
                Don<span className="text-primary">Moto</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed font-barlow">
              Precision motorcycle service, repairs, and premium parts. Trusted by riders since 2005.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-oswald text-sm uppercase tracking-widest text-primary mb-4">Quick Links</h3>
            <ul className="space-y-2 font-barlow text-sm text-muted-foreground">
              {[
                { to: "/", label: "Home" },
                { to: "/services", label: "Services" },
                { to: "/shop", label: "Parts Shop" },
                { to: "/book", label: "Book a Service" },
                { to: "/about", label: "About Us" },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-primary transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-oswald text-sm uppercase tracking-widest text-primary mb-4">Contact</h3>
            <ul className="space-y-3 font-barlow text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <a href="tel:+15551234567" className="hover:text-primary transition-colors">+1 (555) 123-4567</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a href="mailto:info@donmoto.com" className="hover:text-primary transition-colors">info@donmoto.com</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>1284 Ironworks Ave,<br />Moto City, CA 90210</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-oswald text-sm uppercase tracking-widest text-primary mb-4">Business Hours</h3>
            <ul className="space-y-2 font-barlow text-sm text-muted-foreground">
              {[
                { day: "Mon – Fri", hours: "8:00 AM – 6:00 PM" },
                { day: "Saturday", hours: "9:00 AM – 4:00 PM" },
                { day: "Sunday", hours: "Closed" },
              ].map((h) => (
                <li key={h.day} className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="text-foreground font-medium">{h.day}</span>
                    <br />
                    <span>{h.hours}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border text-center text-sm text-muted-foreground font-barlow">
          © {new Date().getFullYear()} DonMoto. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
