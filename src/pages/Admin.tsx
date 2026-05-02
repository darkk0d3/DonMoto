import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard, CalendarCheck, Users, Star,
  LogOut, Menu, X, Lock, Eye, EyeOff, Wrench
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { getBookings, getReviews, type BookingEntry, type ReviewEntry } from "@/lib/store";
import Overview from "@/components/admin/Overview";
import BookingsTab from "@/components/admin/BookingsTab";
import CustomersTab from "@/components/admin/CustomersTab";
import ReviewsTab from "@/components/admin/ReviewsTab";

const ADMIN_PASS = "donmoto2025";
const AUTH_KEY = "donmoto_admin_auth";

type Tab = "overview" | "bookings" | "customers" | "reviews";

const navItems: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "overview",  label: "Overview",  icon: LayoutDashboard },
  { id: "bookings",  label: "Bookings",  icon: CalendarCheck },
  { id: "customers", label: "Customers", icon: Users },
  { id: "reviews",   label: "Reviews",   icon: Star },
];

// ── Login screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASS) {
      localStorage.setItem(AUTH_KEY, "true");
      onLogin();
    } else {
      setError("Incorrect password. Please try again.");
      setPassword("");
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-primary" />
          </div>
          <h1 className="font-oswald font-bold uppercase text-3xl mb-1">Admin Portal</h1>
          <p className="font-barlow text-muted-foreground text-sm">DonMoto Dashboard</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border rounded-xl p-6 shadow-industrial space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="admin-pass">Password</Label>
            <div className="relative">
              <Input
                id="admin-pass"
                type={showPass ? "text" : "password"}
                placeholder="Enter admin password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(""); }}
                className="pr-10"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && <p className="text-xs text-destructive font-barlow">{error}</p>}

          <Button type="submit" className="w-full font-oswald uppercase tracking-wider">
            Sign In
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground font-barlow mt-4">
          Return to{" "}
          <a href="/" className="text-primary hover:underline">main website</a>
        </p>
      </motion.div>
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({
  tab, setTab, onLogout, mobileOpen, setMobileOpen, pendingBookings, pendingReviews
}: {
  tab: Tab;
  setTab: (t: Tab) => void;
  onLogout: () => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
  pendingBookings: number;
  pendingReviews: number;
}) {
  const badges: Partial<Record<Tab, number>> = {
    bookings: pendingBookings,
    reviews: pendingReviews,
  };

  const content = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Wrench className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="font-oswald font-bold uppercase text-sm leading-tight">
            Don<span className="text-primary">Moto</span>
          </p>
          <p className="font-barlow text-xs text-muted-foreground">Admin</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => { setTab(id); setMobileOpen(false); }}
            className={cn(
              "w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-oswald uppercase tracking-wider transition-colors",
              tab === id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <span className="flex items-center gap-3">
              <Icon className="w-4 h-4" />
              {label}
            </span>
            {badges[id] ? (
              <span className={cn(
                "text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center",
                tab === id ? "bg-white/20 text-white" : "bg-yellow-500/20 text-yellow-400"
              )}>
                {badges[id]}
              </span>
            ) : null}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-4 border-t border-border pt-4">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-oswald uppercase tracking-wider text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
        <a
          href="/"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-barlow text-muted-foreground hover:text-primary transition-colors mt-1"
        >
          ← Back to website
        </a>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 bg-card border-r border-border fixed left-0 top-0 bottom-0 z-30">
        {content}
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside className={cn(
        "lg:hidden fixed left-0 top-0 bottom-0 z-50 w-56 bg-card border-r border-border transition-transform duration-300",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {content}
      </aside>
    </>
  );
}

// ── Main Admin ────────────────────────────────────────────────────────────────
export default function Admin() {
  const [authed, setAuthed] = useState(() => localStorage.getItem(AUTH_KEY) === "true");
  const [tab, setTab] = useState<Tab>("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bookings, setBookings] = useState<BookingEntry[]>([]);
  const [reviews, setReviews] = useState<ReviewEntry[]>([]);

  const refresh = useCallback(() => {
    setBookings(getBookings());
    setReviews(getReviews());
  }, []);

  useEffect(() => { if (authed) refresh(); }, [authed, refresh]);

  function handleLogout() {
    localStorage.removeItem(AUTH_KEY);
    setAuthed(false);
  }

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  const pendingBookings = bookings.filter(b => b.status === "pending").length;
  const pendingReviews = reviews.filter(r => !r.approved).length;

  const tabTitles: Record<Tab, string> = {
    overview: "Overview",
    bookings: "Bookings",
    customers: "Customers",
    reviews: "Reviews",
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        tab={tab}
        setTab={setTab}
        onLogout={handleLogout}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        pendingBookings={pendingBookings}
        pendingReviews={pendingReviews}
      />

      {/* Main content */}
      <div className="lg:ml-56 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-14 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between px-4 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden text-foreground"
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="font-oswald font-bold uppercase text-lg tracking-wide">{tabTitles[tab]}</h1>
          </div>
          <div className="flex items-center gap-2">
            {(pendingBookings + pendingReviews) > 0 && (
              <span className="text-xs font-barlow text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded-full">
                {pendingBookings + pendingReviews} pending
              </span>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={refresh}
              className="font-barlow text-xs text-muted-foreground"
            >
              Refresh
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 xl:p-8">
          {tab === "overview"  && <Overview bookings={bookings} reviews={reviews} />}
          {tab === "bookings"  && <BookingsTab bookings={bookings} onRefresh={refresh} />}
          {tab === "customers" && <CustomersTab bookings={bookings} />}
          {tab === "reviews"   && <ReviewsTab reviews={reviews} onRefresh={refresh} />}
        </main>
      </div>
    </div>
  );
}
