import { useState } from "react";
import { Trash2, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type BookingEntry, type BookingStatus, updateBookingStatus, deleteBooking } from "@/lib/store";
import { format } from "date-fns";

const STATUS_OPTIONS: BookingStatus[] = ["pending", "confirmed", "in-progress", "completed", "cancelled"];
const statusVariant: Record<BookingStatus, "pending" | "confirmed" | "in-progress" | "completed" | "cancelled"> = {
  pending: "pending",
  confirmed: "confirmed",
  "in-progress": "in-progress",
  completed: "completed",
  cancelled: "cancelled",
};

interface Props {
  bookings: BookingEntry[];
  onRefresh: () => void;
}

export default function BookingsTab({ bookings, onRefresh }: Props) {
  const [filterStatus, setFilterStatus] = useState<BookingStatus | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = bookings
    .filter(b => filterStatus === "all" || b.status === filterStatus)
    .filter(b =>
      !search ||
      b.fullName.toLowerCase().includes(search.toLowerCase()) ||
      b.bikeMakeModel.toLowerCase().includes(search.toLowerCase()) ||
      b.serviceType.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

  async function handleStatusChange(id: string, status: BookingStatus) {
    await updateBookingStatus(id, status);
    onRefresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this booking?")) return;
    await deleteBooking(id);
    onRefresh();
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Search by name, bike, or service…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full h-10 rounded-md border border-border bg-input px-3 text-sm font-barlow text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        {/* Status filter: select on mobile, pills on sm+ */}
        <div className="sm:hidden">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as BookingStatus | "all")}
            className="w-full h-10 rounded-md border border-border bg-secondary text-foreground text-sm font-oswald uppercase tracking-wider px-3 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="hidden sm:flex gap-2 flex-wrap">
          {(["all", ...STATUS_OPTIONS] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-oswald uppercase tracking-wider border transition-colors ${
                filterStatus === s
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary/50"
              }`}
            >
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>
      </div>

      <p className="font-barlow text-sm text-muted-foreground">
        Showing <span className="text-foreground font-medium">{filtered.length}</span> bookings
      </p>

      {filtered.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="py-16 text-center text-muted-foreground font-barlow">
            No bookings found.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(b => (
            <Card key={b.id} className="bg-card border-border shadow-industrial">
              <CardContent className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-oswald font-bold text-base uppercase">{b.fullName}</p>
                      <Badge variant={statusVariant[b.status]}>{b.status}</Badge>
                    </div>
                    <p className="font-barlow text-sm text-muted-foreground">{b.bikeMakeModel} · {b.serviceType}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-barlow text-muted-foreground">
                      <span>📅 {b.date}</span>
                      <span>📞 {b.phone}</span>
                      <span>✉️ {b.email}</span>
                    </div>
                    {b.notes && (
                      <p className="font-barlow text-xs text-muted-foreground italic border-l-2 border-primary/40 pl-2 mt-1">{b.notes}</p>
                    )}
                    <p className="font-barlow text-xs text-steel">
                      Submitted: {format(new Date(b.submittedAt), "MMM d, yyyy · h:mm a")}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 sm:shrink-0 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                      <select
                        value={b.status}
                        onChange={e => handleStatusChange(b.id, e.target.value as BookingStatus)}
                        className="appearance-none h-9 w-full sm:w-auto pl-3 pr-8 rounded-md border border-border bg-secondary text-foreground text-xs font-oswald uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(b.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 h-9 w-9"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
