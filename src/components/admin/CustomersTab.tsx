import { useMemo, useState } from "react";
import { User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type BookingEntry } from "@/lib/store";
import { format } from "date-fns";

interface CustomerRecord {
  key: string;
  name: string;
  phone: string;
  email: string;
  bikes: string[];
  totalBookings: number;
  lastBooking: string;
  lastDate: string;
}

interface Props { bookings: BookingEntry[]; }

export default function CustomersTab({ bookings }: Props) {
  const [search, setSearch] = useState("");

  const customers = useMemo<CustomerRecord[]>(() => {
    const map = new Map<string, CustomerRecord>();
    for (const b of bookings) {
      const key = b.email?.trim().toLowerCase() || b.phone;
      if (!map.has(key)) {
        map.set(key, {
          key,
          name: b.fullName,
          phone: b.phone,
          email: b.email,
          bikes: [],
          totalBookings: 0,
          lastBooking: "",
          lastDate: "",
        });
      }
      const rec = map.get(key)!;
      rec.totalBookings++;
      if (!rec.bikes.includes(b.bikeMakeModel)) rec.bikes.push(b.bikeMakeModel);
      if (!rec.lastDate || b.submittedAt > rec.lastDate) {
        rec.lastDate = b.submittedAt;
        rec.lastBooking = b.serviceType;
      }
    }
    return Array.from(map.values()).sort((a, b) => b.totalBookings - a.totalBookings);
  }, [bookings]);

  const filtered = customers.filter(c =>
    !search ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Search by name, phone, or email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 h-10 rounded-md border border-border bg-input px-3 text-sm font-barlow text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <p className="font-barlow text-sm text-muted-foreground">
        <span className="text-foreground font-medium">{filtered.length}</span> unique customers
      </p>

      {filtered.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="py-16 text-center text-muted-foreground font-barlow">
            No customers yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map(c => (
            <Card key={c.key} className="bg-card border-border shadow-industrial">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-oswald font-bold text-base uppercase">{c.name}</p>
                      <Badge variant="default">{c.totalBookings} booking{c.totalBookings !== 1 ? "s" : ""}</Badge>
                    </div>
                    <p className="font-barlow text-xs text-muted-foreground">📞 {c.phone}</p>
                    {c.email && <p className="font-barlow text-xs text-muted-foreground">✉️ {c.email}</p>}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {c.bikes.map(bike => (
                        <span key={bike} className="text-xs font-barlow bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">
                          {bike}
                        </span>
                      ))}
                    </div>
                    {c.lastBooking && (
                      <p className="font-barlow text-xs text-muted-foreground mt-1">
                        Last: <span className="text-foreground">{c.lastBooking}</span> · {format(new Date(c.lastDate), "MMM d, yyyy")}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
