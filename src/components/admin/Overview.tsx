import { useMemo } from "react";
import { CalendarCheck, Users, Star, Clock, CheckCircle, Wrench } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type BookingEntry, type ReviewEntry } from "@/lib/store";
import { format } from "date-fns";

interface Props {
  bookings: BookingEntry[];
  reviews: ReviewEntry[];
}

const statusVariant: Record<string, "pending" | "confirmed" | "in-progress" | "completed" | "cancelled"> = {
  pending: "pending",
  confirmed: "confirmed",
  "in-progress": "in-progress",
  completed: "completed",
  cancelled: "cancelled",
};

export default function Overview({ bookings, reviews }: Props) {
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

  const recentBookings = [...bookings].sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  ).slice(0, 5);

  const recentReviews = [...reviews].sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  ).slice(0, 4);

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
