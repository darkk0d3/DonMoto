import { useMemo, useState } from "react";
import { CalendarCheck, Users, Star, Clock, CheckCircle, Wrench, Download, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type BookingEntry, type ReviewEntry } from "@/lib/store";
import { format, startOfDay, startOfWeek, startOfMonth, isAfter } from "date-fns";

interface Props {
  bookings: BookingEntry[];
  reviews: ReviewEntry[];
}

type Period = "daily" | "weekly" | "monthly" | "all";

const statusVariant: Record<string, "pending" | "confirmed" | "in-progress" | "completed" | "cancelled"> = {
  pending: "pending",
  confirmed: "confirmed",
  "in-progress": "in-progress",
  completed: "completed",
  cancelled: "cancelled",
};

function getPeriodStart(period: Period): Date | null {
  const now = new Date();
  if (period === "daily")   return startOfDay(now);
  if (period === "weekly")  return startOfWeek(now, { weekStartsOn: 1 });
  if (period === "monthly") return startOfMonth(now);
  return null;
}

function bookingTotal(b: BookingEntry): number {
  if (!b.cartItems || b.cartItems.length === 0) return 0;
  return b.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function downloadCSV(bookings: BookingEntry[], period: Period) {
  const headers = [
    "Booking ID", "Submitted At", "Customer Name", "Phone", "Email",
    "Bike", "Service Type", "Appointment Date", "Status",
    "Items", "Items Total (₱)",
  ];

  const rows = bookings.map(b => [
    b.id,
    format(new Date(b.submittedAt), "yyyy-MM-dd HH:mm"),
    b.fullName,
    b.phone,
    b.email,
    b.bikeMakeModel,
    b.serviceType,
    b.date,
    b.status,
    b.cartItems && b.cartItems.length > 0
      ? b.cartItems.map(i => `${i.name} x${i.quantity}`).join(" | ")
      : "—",
    bookingTotal(b) > 0 ? bookingTotal(b).toLocaleString() : "—",
  ]);

  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `donmoto-sales-${period}-${format(new Date(), "yyyy-MM-dd")}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Overview({ bookings, reviews }: Props) {
  const [period, setPeriod] = useState<Period>("monthly");

  const filteredBookings = useMemo(() => {
    const start = getPeriodStart(period);
    if (!start) return bookings;
    return bookings.filter(b => isAfter(new Date(b.submittedAt), start));
  }, [bookings, period]);

  const salesTotal = useMemo(
    () => filteredBookings.reduce((sum, b) => sum + bookingTotal(b), 0),
    [filteredBookings]
  );

  const stats = useMemo(() => {
    const uniqueCustomers = new Set(bookings.map(b => b.email || b.phone)).size;
    return [
      { label: "Total Bookings", value: bookings.length, icon: CalendarCheck, color: "text-blue-400" },
      { label: "Pending", value: bookings.filter(b => b.status === "pending").length, icon: Clock, color: "text-yellow-400" },
      { label: "In Progress", value: bookings.filter(b => b.status === "in-progress" || b.status === "confirmed").length, icon: Wrench, color: "text-purple-400" },
      { label: "Completed", value: bookings.filter(b => b.status === "completed").length, icon: CheckCircle, color: "text-green-400" },
      { label: "Customers", value: uniqueCustomers, icon: Users, color: "text-primary" },
      { label: "Reviews", value: reviews.length, icon: Star, color: "text-primary" },
    ];
  }, [bookings, reviews]);

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 5);

  const recentReviews = [...reviews]
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 4);

  const periodLabel: Record<Period, string> = {
    daily: "Today",
    weekly: "This Week",
    monthly: "This Month",
    all: "All Time",
  };

  return (
    <div className="space-y-8">
      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="bg-card border-border shadow-industrial">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <Icon className={`w-6 h-6 ${color} mb-2`} />
              <p className={`font-oswald font-bold text-2xl ${color}`}>{value}</p>
              <p className="font-barlow text-xs text-muted-foreground mt-1">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sales Report */}
      <Card className="bg-card border-border shadow-industrial">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-oswald font-bold uppercase text-lg">Sales Report</h3>
            </div>
            {/* Period filter */}
            <div className="flex gap-2 flex-wrap">
              {(["daily", "weekly", "monthly", "all"] as Period[]).map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 rounded-full text-xs font-oswald uppercase tracking-wider border transition-colors ${
                    period === p
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {periodLabel[p]}
                </button>
              ))}
            </div>
          </div>

          {/* Summary numbers */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-secondary rounded-lg p-4">
              <p className="font-barlow text-xs text-muted-foreground mb-1">Total Bookings</p>
              <p className="font-oswald font-bold text-2xl text-foreground">{filteredBookings.length}</p>
              <p className="font-barlow text-xs text-muted-foreground">{periodLabel[period]}</p>
            </div>
            <div className="bg-secondary rounded-lg p-4">
              <p className="font-barlow text-xs text-muted-foreground mb-1">Parts Revenue</p>
              <p className="font-oswald font-bold text-2xl text-primary">₱{salesTotal.toLocaleString()}</p>
              <p className="font-barlow text-xs text-muted-foreground">{periodLabel[period]}</p>
            </div>
            <div className="bg-secondary rounded-lg p-4">
              <p className="font-barlow text-xs text-muted-foreground mb-1">Completed</p>
              <p className="font-oswald font-bold text-2xl text-green-400">
                {filteredBookings.filter(b => b.status === "completed").length}
              </p>
              <p className="font-barlow text-xs text-muted-foreground">{periodLabel[period]}</p>
            </div>
          </div>

          {/* Download button */}
          <Button
            onClick={() => downloadCSV(filteredBookings, period)}
            variant="outline"
            className="font-oswald uppercase tracking-wider w-full sm:w-auto"
            disabled={filteredBookings.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Download CSV — {periodLabel[period]} ({filteredBookings.length} bookings)
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent bookings */}
        <Card className="bg-card border-border shadow-industrial">
          <CardContent className="p-4 sm:p-6">
            <h3 className="font-oswald font-bold uppercase text-lg mb-4 text-foreground">Recent Bookings</h3>
            {recentBookings.length === 0 ? (
              <p className="text-muted-foreground font-barlow text-sm text-center py-6">No bookings yet.</p>
            ) : (
              <div className="space-y-3">
                {recentBookings.map(b => (
                  <div key={b.id} className="flex items-start justify-between gap-2 py-2 border-b border-border last:border-0">
                    <div className="min-w-0">
                      <p className="font-barlow font-semibold text-sm text-foreground truncate">{b.fullName}</p>
                      <p className="font-barlow text-xs text-muted-foreground truncate">{b.serviceType} · {b.bikeMakeModel}</p>
                      <p className="font-barlow text-xs text-muted-foreground">{b.date}</p>
                    </div>
                    <Badge variant={statusVariant[b.status]}>{b.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent reviews */}
        <Card className="bg-card border-border shadow-industrial">
          <CardContent className="p-4 sm:p-6">
            <h3 className="font-oswald font-bold uppercase text-lg mb-4 text-foreground">Recent Reviews</h3>
            {recentReviews.length === 0 ? (
              <p className="text-muted-foreground font-barlow text-sm text-center py-6">No reviews yet.</p>
            ) : (
              <div className="space-y-3">
                {recentReviews.map(r => (
                  <div key={r.id} className="py-2 border-b border-border last:border-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="font-barlow font-semibold text-sm text-foreground">{r.name}</p>
                      <div className="flex gap-0.5">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                        ))}
                      </div>
                    </div>
                    <p className="font-barlow text-xs text-muted-foreground line-clamp-2">"{r.quote}"</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={r.approved ? "approved" : "pending"}>
                        {r.approved ? "Approved" : "Pending"}
                      </Badge>
                      <span className="text-xs text-muted-foreground font-barlow">
                        {format(new Date(r.submittedAt), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
