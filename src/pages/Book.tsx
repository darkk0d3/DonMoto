import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, CheckCircle, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { saveBooking } from "@/lib/store";
import { useCart } from "@/lib/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const schema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(7, "Enter a valid phone number"),
  email: z.string().email("Enter a valid email address"),
  bikeMakeModel: z.string().min(2, "Enter your bike's make and model"),
  serviceType: z.string().min(1, "Please select a service type"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const serviceTypes = [
  "CVT Cleaning",
  "Minor Wiring",
  "Fullwave Conversion",
  "Top Overhaul",
  "General Overhaul Mechanical",
  "Tune-Up (2–4 Valve)",
  "Scan Diagnose",
  "General Wiring",
  "Alarm Installation",
  "Electrical Problem Diagnosis",
  "GPS Tracking Installation",
  "Resetting Error Codes",
  "Other – I'll describe in notes",
];

export default function Book() {
  const [date, setDate] = useState<Date | undefined>();
  const [submitted, setSubmitted] = useState(false);
  const { cart, clearCart } = useCart();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    if (!date) {
      toast.error("Please select a preferred date.");
      return;
    }
    await new Promise((r) => setTimeout(r, 800));
    await saveBooking({
      ...data,
      date: format(date, "PPP"),
      cartItems: cart.length > 0 ? cart : undefined,
    });
    clearCart();
    setSubmitted(true);
    toast.success("Booking request sent! We'll confirm shortly.");
  };

  if (submitted) {
    return (
      <main className="pt-24 pb-24 min-h-screen">
        <div className="max-w-lg mx-auto px-6 text-center mt-20">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="font-oswald font-bold uppercase text-4xl mb-4">Booking Received!</h2>
            <p className="font-barlow text-muted-foreground text-lg mb-8">
              We'll call or email you within a few hours to confirm your appointment. See you soon.
            </p>
            <Button
              onClick={() => { setSubmitted(false); reset(); setDate(undefined); }}
              className="font-oswald uppercase tracking-wider"
            >
              Book Another
            </Button>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-24">
      <div className="max-w-2xl mx-auto px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-oswald text-xs uppercase tracking-[4px] text-primary mb-3">Schedule a Visit</p>
          <h1 className="font-oswald font-bold uppercase text-3xl sm:text-5xl lg:text-6xl mb-4">Book a Service</h1>
          <p className="font-barlow text-muted-foreground text-lg">
            Fill in the details below and we'll lock in a time that works for you.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 bg-card border border-border rounded-xl p-5 sm:p-8 shadow-industrial"
        >
          {/* Cart items for installation */}
          {cart.length > 0 && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-primary" />
                <p className="font-oswald uppercase tracking-wider text-sm font-bold">Items for Installation</p>
              </div>
              <div className="space-y-2">
                {cart.map(item => (
                  <div key={item.productId} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <img src={item.image} alt={item.name} className="w-8 h-8 rounded object-cover shrink-0 border border-border" />
                      <span className="font-barlow text-sm truncate">{item.name}</span>
                      <span className="font-barlow text-xs text-muted-foreground shrink-0">×{item.quantity}</span>
                    </div>
                    <span className="font-oswald text-sm text-primary shrink-0">₱{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <p className="font-barlow text-xs text-muted-foreground">These items will be noted in your booking for our mechanics.</p>
            </div>
          )}

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" placeholder="John Doe" {...register("fullName")} />
            {errors.fullName && <p className="text-xs text-destructive font-barlow">{errors.fullName.message}</p>}
          </div>

          {/* Phone + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" placeholder="+63 9XX XXX XXXX" {...register("phone")} />
              {errors.phone && <p className="text-xs text-destructive font-barlow">{errors.phone.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
              {errors.email && <p className="text-xs text-destructive font-barlow">{errors.email.message}</p>}
            </div>
          </div>

          {/* Bike */}
          <div className="space-y-2">
            <Label htmlFor="bikeMakeModel">Bike Make & Model</Label>
            <Input id="bikeMakeModel" placeholder="e.g. Yamaha MT-07 2022" {...register("bikeMakeModel")} />
            {errors.bikeMakeModel && <p className="text-xs text-destructive font-barlow">{errors.bikeMakeModel.message}</p>}
          </div>

          {/* Service type */}
          <div className="space-y-2">
            <Label>Service Type</Label>
            <Select onValueChange={(v) => setValue("serviceType", v, { shouldValidate: true })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a service…" />
              </SelectTrigger>
              <SelectContent>
                {serviceTypes.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.serviceType && <p className="text-xs text-destructive font-barlow">{errors.serviceType.message}</p>}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label>Preferred Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  type="button"
                  className={cn("w-full justify-start text-left font-barlow font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(d) => d < new Date() || d.getDay() === 0}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes <span className="text-muted-foreground">(optional)</span></Label>
            <Textarea
              id="notes"
              placeholder="Describe the issue, symptoms, or anything you'd like us to know…"
              rows={4}
              {...register("notes")}
            />
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="w-full font-oswald uppercase tracking-wider text-base"
          >
            {isSubmitting ? "Sending…" : "Confirm Booking"}
          </Button>
        </motion.form>
      </div>
    </main>
  );
}
