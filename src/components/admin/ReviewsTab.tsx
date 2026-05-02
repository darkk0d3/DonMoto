import { useState } from "react";
import { Star, Trash2, Check, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type ReviewEntry, updateReviewApproval, deleteReview } from "@/lib/store";
import { format } from "date-fns";

interface Props { reviews: ReviewEntry[]; onRefresh: () => void; }

export default function ReviewsTab({ reviews, onRefresh }: Props) {
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  const filtered = reviews
    .filter(r => filter === "all" || (filter === "approved" ? r.approved : !r.approved))
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

  async function handleApprove(id: string, approved: boolean) {
    await updateReviewApproval(id, approved);
    onRefresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this review?")) return;
    await deleteReview(id);
    onRefresh();
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "pending", "approved"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-oswald uppercase tracking-wider border transition-colors ${
              filter === f
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:border-primary/50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <p className="font-barlow text-sm text-muted-foreground">
        <span className="text-foreground font-medium">{filtered.length}</span> reviews ·{" "}
        <span className="text-yellow-400">{reviews.filter(r => !r.approved).length} pending</span>
      </p>

      {filtered.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="py-16 text-center text-muted-foreground font-barlow">
            No reviews found.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(r => (
            <Card key={r.id} className={`border shadow-industrial ${r.approved ? "bg-card border-border" : "bg-yellow-500/5 border-yellow-500/20"}`}>
              <CardContent className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-oswald font-bold text-base uppercase">{r.name}</p>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < r.rating ? "fill-primary text-primary" : "text-muted-foreground"}`}
                          />
                        ))}
                      </div>
                      <Badge variant={r.approved ? "approved" : "pending"}>
                        {r.approved ? "Approved" : "Pending"}
                      </Badge>
                    </div>
                    <p className="font-barlow text-xs text-primary">{r.bike}</p>
                    <p className="font-barlow text-sm text-muted-foreground italic">"{r.quote}"</p>
                    <p className="font-barlow text-xs text-steel">
                      {format(new Date(r.submittedAt), "MMM d, yyyy · h:mm a")}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {r.approved ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApprove(r.id, false)}
                        className="font-oswald uppercase tracking-wider text-xs border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/10"
                      >
                        <X className="w-3.5 h-3.5 mr-1" /> Unapprove
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleApprove(r.id, true)}
                        className="font-oswald uppercase tracking-wider text-xs bg-green-600 hover:bg-green-700"
                      >
                        <Check className="w-3.5 h-3.5 mr-1" /> Approve
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(r.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8"
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
