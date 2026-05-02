import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveReview } from "@/lib/store";
import { toast } from "sonner";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110 focus:outline-none"
          aria-label={`${star} star`}
        >
          <Star
            className={`w-7 h-7 transition-colors ${
              star <= (hovered || value)
                ? "fill-primary text-primary"
                : "text-muted-foreground"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function ReviewForm({ onSubmitted }: { onSubmitted?: () => void }) {
  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [bike, setBike] = useState("");
  const [quote, setQuote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { toast.error("Please select a star rating."); return; }
    if (!name.trim() || !quote.trim()) { toast.error("Please fill in all required fields."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    saveReview({ name: name.trim(), bike: bike.trim() || "Motorcycle rider", rating, quote: quote.trim() });
    setSubmitted(true);
    setLoading(false);
    toast.success("Review submitted! It will appear after approval.");
    onSubmitted?.();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="thanks"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-10"
          >
            <CheckCircle className="w-14 h-14 text-primary mx-auto mb-4" />
            <h3 className="font-oswald font-bold uppercase text-2xl mb-2">Thanks for your review!</h3>
            <p className="font-barlow text-muted-foreground">
              Your review is pending approval and will appear on the site shortly.
            </p>
            <Button
              variant="outline"
              className="mt-6 font-oswald uppercase tracking-wider"
              onClick={() => { setSubmitted(false); setRating(0); setName(""); setBike(""); setQuote(""); }}
            >
              Write Another
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="bg-card border border-border rounded-xl p-5 sm:p-8 shadow-industrial space-y-5"
          >
            {/* Star rating */}
            <div className="space-y-2">
              <Label>Your Rating <span className="text-destructive">*</span></Label>
              <StarRating value={rating} onChange={setRating} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="r-name">Your Name <span className="text-destructive">*</span></Label>
                <Input id="r-name" placeholder="Juan dela Cruz" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="r-bike">Your Bike <span className="text-muted-foreground">(optional)</span></Label>
                <Input id="r-bike" placeholder="e.g. Honda Click 125i" value={bike} onChange={e => setBike(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="r-quote">Your Review <span className="text-destructive">*</span></Label>
              <Textarea
                id="r-quote"
                placeholder="Share your experience with DonMoto…"
                rows={4}
                value={quote}
                onChange={e => setQuote(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full font-oswald uppercase tracking-wider"
            >
              {loading ? "Submitting…" : "Submit Review"}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
