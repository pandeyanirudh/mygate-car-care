import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  CalendarDays,
  CarFront,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  CreditCard,
  Droplets,
  Gauge,
  Home,
  MapPin,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Plus,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Star,
  Tag,
  Trash2,
  UserRound,
  WalletCards,
  Wrench,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import heroCar from "@/assets/creta-morning.jpg";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MyGate Car Care — Doorstep service for your society" },
      {
        name: "description",
        content:
          "Book reliable doorstep car cleaning at Palm Residency with daily care plans, real-time tracking, and quality assurance.",
      },
      { property: "og:title", content: "MyGate Car Care — Doorstep service for your society" },
      {
        property: "og:description",
        content: "Society-first car cleaning with reliable scheduling and subscription plans.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CarCareApp,
});

type Tab = "home" | "services" | "bookings" | "notifications" | "profile";
type VehicleType = "Hatchback" | "Sedan" | "SUV" | "MUV" | "Other";
type BookingStep = 1 | 2 | 3 | 4 | 5;

type Vehicle = {
  id: number;
  make: string;
  model: string;
  registration: string;
  type: VehicleType;
  color: string;
};

type Service = {
  id: string;
  name: string;
  detail: string;
  price: number;
  cadence: string;
  icon: typeof Sparkles;
};

const initialVehicles: Vehicle[] = [
  { id: 1, make: "Hyundai", model: "Creta", registration: "HR26AB1234", type: "SUV", color: "Silver" },
  { id: 2, make: "Honda", model: "City", registration: "HR26CD5678", type: "Sedan", color: "White" },
];

const services: Service[] = [
  { id: "daily", name: "Daily Premium", detail: "Exterior + tyres", price: 199, cadence: "Daily", icon: Sparkles },
  { id: "interior", name: "Interior Clean", detail: "Vacuum + freshness", price: 299, cadence: "Weekly", icon: Droplets },
  { id: "tyres", name: "Tyre Polish", detail: "Shine + protect", price: 149, cadence: "On demand", icon: Gauge },
  { id: "pressure", name: "Air Check", detail: "Pressure update", price: 49, cadence: "Daily", icon: Wrench },
  { id: "detail", name: "Premium Detail", detail: "Deep clean finish", price: 899, cadence: "One time", icon: CarFront },
];

const plans = {
  Hatchback: [
    { label: "1 Month", price: 599 },
    { label: "3 Months", price: 1497 },
    { label: "6 Months", price: 2995 },
    { label: "1 Year", price: 5988 },
  ],
  "SUV / Sedan": [
    { label: "1 Month", price: 699 },
    { label: "3 Months", price: 1797 },
    { label: "6 Months", price: 3594 },
    { label: "1 Year", price: 7188 },
  ],
};

const notifications = [
  { icon: Check, title: "Your car cleaning is confirmed.", detail: "Hyundai Creta · Tomorrow at 7:00 AM", time: "10 min ago", tone: "gold" },
  { icon: Clock3, title: "Your cleaning starts tomorrow.", detail: "Palm Residency · Slot 7:00–8:00 AM", time: "Yesterday", tone: "muted" },
  { icon: ShieldCheck, title: "Society coverage is active.", detail: "Morning slots are available this week.", time: "2 days ago", tone: "muted" },
  { icon: Tag, title: "Save more with a 6-month plan.", detail: "Available for both vehicles in your garage.", time: "3 days ago", tone: "muted" },
];

const timeline = [
  { label: "Booking Confirmed", time: "6:30 AM", complete: true },
  { label: "Cleaner Assigned", time: "6:42 AM", complete: true },
  { label: "Cleaner Arrived", time: "6:55 AM", complete: true },
  { label: "Cleaning Started", time: "7:02 AM", complete: false },
  { label: "Quality Check", time: "Pending", complete: false },
  { label: "Service Completed", time: "Pending", complete: false },
];

function money(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function CarCareApp() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [selectedVehicleId, setSelectedVehicleId] = useState(1);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState<BookingStep>(1);
  const [selectedService, setSelectedService] = useState("daily");
  const [selectedSlot, setSelectedSlot] = useState("7:00–8:00 AM");
  const [selectedDate, setSelectedDate] = useState("Tomorrow, 12 Sep");
  const [selectedPlan, setSelectedPlan] = useState(3);
  const [bookingDetailsOpen, setBookingDetailsOpen] = useState(false);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ make: "", model: "", registration: "", type: "SUV" as VehicleType, color: "" });

  const selectedVehicle = vehicles.find((vehicle) => vehicle.id === selectedVehicleId) ?? vehicles[0];
  const currentPlanSet = selectedVehicle?.type === "Hatchback" ? plans.Hatchback : plans["SUV / Sedan"];
  const selectedServiceData = services.find((service) => service.id === selectedService) ?? services[0];
  if (!selectedVehicle || !selectedServiceData || !currentPlanSet[selectedPlan]) {
    return <div className="grid min-h-screen place-items-center bg-ink text-cream">Preparing your garage…</div>;
  }
  const bookingTotal = selectedService === "subscription" ? currentPlanSet[selectedPlan].price : selectedServiceData.price;

  const openBooking = (serviceId = "daily") => {
    setSelectedService(serviceId);
    setBookingStep(1);
    setBookingOpen(true);
  };

  const completePayment = () => {
    setBookingOpen(false);
    setActiveTab("bookings");
    toast.success("Booking confirmed", { description: "Your cleaner is scheduled for tomorrow at 7:00 AM." });
  };

  const addVehicle = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newVehicle.make || !newVehicle.model || !newVehicle.registration || !newVehicle.color) {
      toast.error("Complete the vehicle details first");
      return;
    }
    const vehicle = { ...newVehicle, id: Date.now() };
    setVehicles((current) => [...current, vehicle]);
    setSelectedVehicleId(vehicle.id);
    setNewVehicle({ make: "", model: "", registration: "", type: "SUV", color: "" });
    setShowAddVehicle(false);
    toast.success("Vehicle added", { description: `${vehicle.make} ${vehicle.model} is ready to book.` });
  };

  return (
    <div className="min-h-screen bg-ink px-0 text-foreground sm:px-6 sm:py-8">
      <div className="app-shell mx-auto flex min-h-screen w-full max-w-[1180px] overflow-hidden bg-paper shadow-2xl shadow-ink/40 sm:min-h-[900px] sm:rounded-[2rem]">
        <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-ink-soft p-6 text-cream lg:flex">
          <Brand />
          <p className="mt-12 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">Resident car care</p>
          <div className="mt-4 space-y-1">
            {navItems.map((item) => (
              <NavButton key={item.id} item={item} active={activeTab === item.id} onClick={() => setActiveTab(item.id)} sidebar />
            ))}
          </div>
          <div className="mt-auto rounded-2xl border border-line bg-surface p-4">
            <div className="flex items-center gap-2 text-gold"><ShieldCheck className="size-4" /><span className="text-xs font-semibold">Society Verified</span></div>
            <p className="mt-2 text-xs leading-relaxed text-muted">Dedicated cloths, scheduled service, and an easy quality check.</p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-border bg-paper px-5 py-5 sm:px-8">
            <Brand compact />
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Open notifications" title="Notifications" onClick={() => setActiveTab("notifications")}>
                <Bell className="size-5" />
                <span className="absolute ml-4 mt-[-16px] size-2 rounded-full bg-gold" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full bg-muted text-foreground hover:bg-border" aria-label="Open profile" title="Profile" onClick={() => setActiveTab("profile")}>
                <span className="text-xs font-bold">RS</span>
              </Button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto px-5 pb-28 pt-5 sm:px-8 sm:pt-7">
            {activeTab === "home" && <HomeView selectedVehicle={selectedVehicle} onBook={openBooking} onViewBooking={() => setBookingDetailsOpen(true)} onPlans={() => { setActiveTab("services"); setSelectedService("subscription"); }} />}
            {activeTab === "services" && <ServicesView selectedVehicle={selectedVehicle} selectedPlan={selectedPlan} setSelectedPlan={setSelectedPlan} onBook={openBooking} />}
            {activeTab === "bookings" && <BookingsView onViewBooking={() => setBookingDetailsOpen(true)} onBook={openBooking} />}
            {activeTab === "notifications" && <NotificationsView />}
            {activeTab === "profile" && <ProfileView vehicles={vehicles} selectedVehicleId={selectedVehicleId} onSelectVehicle={setSelectedVehicleId} onDeleteVehicle={(id) => setVehicles((current) => current.filter((vehicle) => vehicle.id !== id))} showAddVehicle={showAddVehicle} setShowAddVehicle={setShowAddVehicle} newVehicle={newVehicle} setNewVehicle={setNewVehicle} onAddVehicle={addVehicle} onBook={openBooking} />}
          </main>

          <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto flex max-w-[1180px] justify-around border-t border-border bg-paper/95 px-2 py-2 backdrop-blur-xl lg:static lg:border-t lg:px-8 lg:py-4">
            {navItems.map((item) => <NavButton key={item.id} item={item} active={activeTab === item.id} onClick={() => setActiveTab(item.id)} />)}
          </nav>
        </div>
      </div>

      {bookingOpen && <BookingFlow step={bookingStep} setStep={setBookingStep} selectedVehicle={selectedVehicle} vehicles={vehicles} selectedVehicleId={selectedVehicleId} setSelectedVehicleId={setSelectedVehicleId} selectedService={selectedService} setSelectedService={setSelectedService} selectedDate={selectedDate} setSelectedDate={setSelectedDate} selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot} selectedPlan={selectedPlan} setSelectedPlan={setSelectedPlan} currentPlanSet={currentPlanSet} bookingTotal={bookingTotal} onClose={() => setBookingOpen(false)} onComplete={completePayment} />}
      {bookingDetailsOpen && <BookingDetails onClose={() => setBookingDetailsOpen(false)} />}
      <Toaster position="top-center" />
    </div>
  );
}

const navItems: { id: Tab; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "services", label: "Services", icon: Sparkles },
  { id: "bookings", label: "Bookings", icon: CalendarDays },
  { id: "notifications", label: "Alerts", icon: Bell },
  { id: "profile", label: "Profile", icon: UserRound },
];

function Brand({ compact = false }: { compact?: boolean }) {
  return <div className="flex items-center gap-2.5"><div className="grid size-9 shrink-0 place-items-center rounded-xl bg-gold font-bold text-ink">M</div><div className={compact ? "lg:hidden" : ""}><p className="font-display text-lg font-semibold leading-none text-cream lg:text-base">MyGate <span className="text-gold">Car Care</span></p><p className="mt-1 text-[10px] text-muted">Your society. Professionally cared.</p></div></div>;
}

function NavButton({ item, active, onClick, sidebar = false }: { item: (typeof navItems)[number]; active: boolean; onClick: () => void; sidebar?: boolean }) {
  const Icon = item.icon;
  return <Button variant="ghost" onClick={onClick} className={sidebar ? `w-full justify-start rounded-xl px-3 py-3 ${active ? "bg-gold/15 text-gold" : "text-muted hover:bg-surface hover:text-cream"}` : `flex h-auto min-w-14 flex-col gap-1 rounded-xl px-2 py-1.5 text-[10px] ${active ? "text-gold" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`} aria-label={item.label}><Icon className="size-4" /><span className={sidebar ? "text-sm" : ""}>{item.label}</span></Button>;
}

function HomeView({ selectedVehicle, onBook, onViewBooking, onPlans }: { selectedVehicle: Vehicle; onBook: (service?: string) => void; onViewBooking: () => void; onPlans: () => void }) {
  return <div className="mx-auto max-w-4xl animate-rise space-y-7">
    <section className="flex items-end justify-between gap-4"><div><p className="text-xs text-muted-foreground">Palm Residency · Gurgaon <ChevronDown className="inline size-3" /></p><h1 className="mt-2 font-display text-3xl italic leading-none text-foreground sm:text-4xl">Good morning, Rahul.</h1></div><div className="hidden text-right sm:block"><p className="text-xs text-muted-foreground">Your garage</p><p className="mt-1 text-sm font-semibold">{selectedVehicle.make} {selectedVehicle.model}</p></div></section>
    <section className="relative isolate overflow-hidden rounded-2xl bg-surface text-cream"><img src={heroCar} alt="Professional cleaner caring for a Hyundai Creta at a gated society" width={1200} height={800} className="absolute inset-0 -z-20 h-full w-full object-cover opacity-55" /><div className="absolute inset-0 -z-10 bg-ink/70" /><div className="relative flex min-h-[280px] flex-col justify-between p-5 sm:min-h-[315px] sm:p-7"><div><span className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-gold"><Sparkles className="size-3" />Doorstep car care</span><h2 className="mt-6 max-w-sm font-display text-3xl italic leading-[0.95] text-cream sm:text-4xl">Keep your car clean,<br />every morning.</h2><p className="mt-3 max-w-xs text-sm leading-relaxed text-cream/70">Reliable society service with anti-scratch microfiber cloths and a quality check after every clean.</p></div><div className="flex flex-wrap gap-2"><Button onClick={() => onBook("daily")} className="rounded-full bg-gold px-5 py-3 text-sm font-semibold text-ink hover:bg-gold-soft">Book a car wash <ArrowRight className="size-4" /></Button><Button variant="ghost" onClick={onPlans} className="rounded-full border border-cream/20 bg-ink/30 px-4 py-3 text-sm text-cream hover:bg-ink/60 hover:text-cream">Explore plans</Button></div></div></section>
    <section className="grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm"><div className="flex items-center justify-between"><div><p className="text-[11px] font-medium text-muted-foreground">Upcoming · Tomorrow</p><p className="mt-1 text-lg font-semibold">Daily Premium Cleaning</p></div><span className="rounded-full bg-gold/15 px-2.5 py-1 text-[10px] font-semibold text-gold">Confirmed</span></div><div className="mt-5 flex items-center gap-4"><div className="grid size-14 place-items-center rounded-xl bg-muted text-foreground"><CarFront className="size-7" /></div><div><p className="font-semibold">Hyundai Creta</p><p className="mt-1 text-xs text-muted-foreground">HR26AB1234 · {selectedVehicle.type}</p></div></div><div className="mt-5 flex items-center gap-3"><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"><div className="h-full w-1/2 rounded-full bg-gold" /></div><span className="text-[10px] font-medium text-muted-foreground">Cleaner assigned</span></div><div className="mt-5 flex items-center justify-between text-xs text-muted-foreground"><span className="inline-flex items-center gap-1.5"><Clock3 className="size-3.5 text-gold" />7:00–8:00 AM</span><Button variant="link" onClick={onViewBooking} className="h-auto p-0 text-xs text-gold">View details <ChevronRight className="size-3.5" /></Button></div></div>
      <div className="rounded-2xl bg-gold p-5 text-ink"><div className="flex items-start justify-between"><div><p className="text-[11px] font-semibold uppercase tracking-[0.12em] opacity-70">Daily Care · SUV</p><p className="mt-2 text-3xl font-bold">₹699<span className="text-xs font-medium opacity-60">/mo</span></p></div><span className="rounded-full bg-ink px-2.5 py-1 text-[10px] font-bold text-gold">BEST VALUE</span></div><p className="mt-3 text-sm font-medium opacity-80">1-year plan saves ₹1,200</p><div className="mt-5 h-1.5 overflow-hidden rounded-full bg-ink/15"><div className="h-full w-4/5 rounded-full bg-ink" /></div><p className="mt-2 text-[10px] font-medium opacity-60">Daily exterior · weekly interior · annual service</p><Button onClick={onPlans} className="mt-5 w-full rounded-xl bg-ink py-3 text-sm font-semibold text-gold hover:bg-ink-soft">Compare care plans</Button></div>
    </section>
    <section><SectionHeading title="Services" action="See all" onAction={() => onBook("daily")} /><div className="no-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 pb-2">{services.slice(0, 4).map((service) => { const Icon = service.icon; return <button key={service.id} onClick={() => onBook(service.id)} className="min-w-[142px] rounded-xl border border-border bg-card p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-gold/50"><span className="grid size-9 place-items-center rounded-lg bg-gold/10 text-gold"><Icon className="size-4" /></span><p className="mt-4 text-sm font-semibold">{service.name}</p><p className="mt-1 text-xs text-muted-foreground">{service.detail}</p><p className="mt-3 text-xs font-semibold text-gold">{money(service.price)}</p></button>; })}</div></section>
    <section className="flex items-center gap-4 rounded-2xl border border-gold/20 bg-gold/10 p-4"><div className="grid size-11 shrink-0 place-items-center rounded-xl bg-gold text-ink"><ShieldCheck className="size-5" /></div><div className="min-w-0 flex-1"><p className="text-sm font-semibold">Palm Residency is service-ready</p><p className="mt-1 text-xs text-muted-foreground">4 morning slots open · verified local professionals</p></div><Button onClick={() => onBook("daily")} className="shrink-0 rounded-full bg-ink px-3 py-2 text-xs font-semibold text-gold hover:bg-ink-soft">Book</Button></section>
    <section><SectionHeading title="Why residents stay with us" /><div className="grid gap-3 sm:grid-cols-3"><TrustItem icon={ShieldCheck} title="Verified hands" detail="Society-approved providers" /><TrustItem icon={Droplets} title="Anti-scratch care" detail="Dedicated microfiber cloth" /><TrustItem icon={ReceiptText} title="Clear pricing" detail="No surprise charges" /></div></section>
  </div>;
}

function ServicesView({ selectedVehicle, selectedPlan, setSelectedPlan, onBook }: { selectedVehicle: Vehicle; selectedPlan: number; setSelectedPlan: (value: number) => void; onBook: (service?: string) => void }) {
  const planSet = selectedVehicle.type === "Hatchback" ? plans.Hatchback : plans["SUV / Sedan"];
  return <div className="mx-auto max-w-4xl animate-rise space-y-8"><PageIntro eyebrow="Car care menu" title="Choose the care your car deserves." detail="Built for society life: daily reliability, quality materials, and upgrades when you need them." /><section><SectionHeading title="Quick services" /><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{services.map((service) => { const Icon = service.icon; return <button key={service.id} onClick={() => onBook(service.id)} className="group rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-gold/50"><div className="flex items-start justify-between"><span className="grid size-10 place-items-center rounded-xl bg-muted text-foreground group-hover:bg-gold/10 group-hover:text-gold"><Icon className="size-5" /></span><span className="text-xs text-muted-foreground">{service.cadence}</span></div><p className="mt-5 font-semibold">{service.name}</p><p className="mt-1 text-xs text-muted-foreground">{service.detail}</p><div className="mt-4 flex items-center justify-between"><span className="text-sm font-semibold text-gold">{money(service.price)}</span><ArrowRight className="size-4 text-muted-foreground" /></div></button>; })}</div></section><section><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">Subscription-first care</p><h2 className="mt-2 font-display text-2xl italic">Keep it covered.</h2><p className="mt-1 text-sm text-muted-foreground">{selectedVehicle.type} pricing · all services included</p></div><div className="flex rounded-full bg-muted p-1"><span className="rounded-full bg-card px-3 py-1.5 text-xs font-semibold shadow-sm">{selectedVehicle.type === "Hatchback" ? "Hatchback" : "SUV / Sedan"}</span></div></div><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{planSet.map((plan, index) => <button key={plan.label} onClick={() => { setSelectedPlan(index); onBook("subscription"); }} className={`relative rounded-2xl p-4 text-left transition hover:-translate-y-0.5 ${index === 3 ? "bg-ink text-cream shadow-lg shadow-ink/15" : "border border-border bg-card"}`}>{index === 3 && <span className="absolute -top-2.5 left-4 rounded-full bg-gold px-2.5 py-1 text-[9px] font-bold text-ink">BEST VALUE</span>}<p className={`text-xs ${index === 3 ? "text-muted" : "text-muted-foreground"}`}>{plan.label}</p><p className={`mt-2 text-2xl font-bold ${index === 3 ? "text-gold" : "text-foreground"}`}>{money(plan.price)}</p><p className={`mt-1 text-[11px] ${index === 3 ? "text-muted" : "text-muted-foreground"}`}>per vehicle</p><div className={`mt-5 space-y-2 text-xs ${index === 3 ? "text-cream/75" : "text-muted-foreground"}`}><p><Check className="mr-1 inline size-3 text-gold" />Daily exterior</p><p><Check className="mr-1 inline size-3 text-gold" />Weekly interior</p><p><Check className="mr-1 inline size-3 text-gold" />Air check updates</p></div></button>)}</div><p className="mt-4 text-xs text-muted-foreground">Includes one complimentary annual car service. Oil and other applicable charges are extra.</p></section></div>;
}

function BookingsView({ onViewBooking, onBook }: { onViewBooking: () => void; onBook: (service?: string) => void }) {
  return <div className="mx-auto max-w-4xl animate-rise space-y-7"><PageIntro eyebrow="Your car care" title="Bookings that stay on track." detail="See upcoming visits, completed services, and every update from your society cleaner." /><div className="flex gap-2 overflow-x-auto border-b border-border pb-2">{["Upcoming", "Active", "Completed", "Cancelled"].map((tab, index) => <Button key={tab} variant="ghost" className={`rounded-full px-4 text-xs ${index === 0 ? "bg-ink text-cream hover:bg-ink-soft hover:text-cream" : "text-muted-foreground"}`}>{tab}</Button>)}</div><section className="rounded-2xl border border-border bg-card p-5 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-3"><div><span className="rounded-full bg-gold/15 px-2.5 py-1 text-[10px] font-semibold text-gold">Confirmed</span><p className="mt-3 text-lg font-semibold">Daily Premium Cleaning</p><p className="mt-1 text-xs text-muted-foreground">Tomorrow · 7:00–8:00 AM · Palm Residency</p></div><p className="text-lg font-bold">₹199</p></div><div className="mt-5 flex items-center gap-4 rounded-xl bg-muted p-3"><div className="grid size-11 place-items-center rounded-lg bg-card"><CarFront className="size-5 text-gold" /></div><div className="flex-1"><p className="text-sm font-semibold">Hyundai Creta</p><p className="mt-1 text-xs text-muted-foreground">HR26AB1234 · Cleaner assigned</p></div><Button variant="ghost" size="icon" className="rounded-full" onClick={onViewBooking} aria-label="Open booking details" title="Booking details"><ChevronRight className="size-4" /></Button></div><div className="mt-5 flex flex-wrap gap-2"><Button onClick={onViewBooking} className="rounded-full bg-ink px-4 text-xs text-cream hover:bg-ink-soft">Track service</Button><Button variant="outline" onClick={() => onBook("daily")} className="rounded-full px-4 text-xs">Book another</Button></div></section><section><SectionHeading title="Service history" /><div className="divide-y divide-border rounded-2xl border border-border bg-card px-5"><HistoryRow title="Interior Clean" date="02 Sep 2026" amount="₹299" status="Completed" /><HistoryRow title="Daily Premium Cleaning" date="01 Sep 2026" amount="₹199" status="Completed" /><HistoryRow title="Tyre Polish" date="28 Aug 2026" amount="₹149" status="Rated 5.0" /></div></section></div>;
}

function NotificationsView() {
  return <div className="mx-auto max-w-3xl animate-rise space-y-7"><PageIntro eyebrow="Stay in the loop" title="Updates from your car care team." detail="Every booking, arrival, payment, and offer in one place." /><div className="space-y-3">{notifications.map((notification) => { const Icon = notification.icon; return <div key={notification.title} className="flex gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm"><span className={`grid size-10 shrink-0 place-items-center rounded-xl ${notification.tone === "gold" ? "bg-gold/15 text-gold" : "bg-muted text-muted-foreground"}`}><Icon className="size-4" /></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-start justify-between gap-2"><p className="text-sm font-semibold">{notification.title}</p><span className="text-[10px] text-muted-foreground">{notification.time}</span></div><p className="mt-1 text-xs text-muted-foreground">{notification.detail}</p></div></div>; })}</div></div>;
}

function ProfileView({ vehicles, selectedVehicleId, onSelectVehicle, onDeleteVehicle, showAddVehicle, setShowAddVehicle, newVehicle, setNewVehicle, onAddVehicle, onBook }: { vehicles: Vehicle[]; selectedVehicleId: number; onSelectVehicle: (id: number) => void; onDeleteVehicle: (id: number) => void; showAddVehicle: boolean; setShowAddVehicle: (value: boolean) => void; newVehicle: { make: string; model: string; registration: string; type: VehicleType; color: string }; setNewVehicle: React.Dispatch<React.SetStateAction<{ make: string; model: string; registration: string; type: VehicleType; color: string }>>; onAddVehicle: (event: React.FormEvent<HTMLFormElement>) => void; onBook: (service?: string) => void }) {
  return <div className="mx-auto max-w-3xl animate-rise space-y-7"><section className="flex items-center gap-4"><div className="grid size-16 place-items-center rounded-2xl bg-ink text-lg font-bold text-gold">RS</div><div><p className="font-display text-2xl italic">Rahul Sharma</p><p className="mt-1 text-sm text-muted-foreground">+91 98••• 45210 · Palm Residency</p></div><Button variant="outline" size="icon" className="ml-auto rounded-full" aria-label="Edit profile" title="Edit profile" onClick={() => toast("Profile editing is ready for API integration") }><MoreHorizontal className="size-4" /></Button></section><section><div className="flex items-center justify-between"><SectionHeading title="My vehicles" /><Button onClick={() => setShowAddVehicle(!showAddVehicle)} variant="outline" className="rounded-full px-3 text-xs"><Plus className="size-3.5" /> Add vehicle</Button></div><div className="mt-3 space-y-3">{vehicles.map((vehicle) => <div key={vehicle.id} className={`flex items-center gap-3 rounded-2xl border p-4 transition ${vehicle.id === selectedVehicleId ? "border-gold/50 bg-gold/10" : "border-border bg-card"}`}><div className="grid size-11 place-items-center rounded-xl bg-muted"><CarFront className="size-5 text-foreground" /></div><button onClick={() => onSelectVehicle(vehicle.id)} className="min-w-0 flex-1 text-left"><p className="truncate text-sm font-semibold">{vehicle.make} {vehicle.model} {vehicle.id === selectedVehicleId && <span className="ml-2 rounded-full bg-gold px-2 py-0.5 text-[9px] text-ink">Default</span>}</p><p className="mt-1 text-xs text-muted-foreground">{vehicle.registration} · {vehicle.type} · {vehicle.color}</p></button><Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-destructive" onClick={() => { onDeleteVehicle(vehicle.id); toast("Vehicle removed"); }} aria-label={`Delete ${vehicle.make} ${vehicle.model}`} title="Delete vehicle"><Trash2 className="size-4" /></Button></div>)}</div>{showAddVehicle && <form onSubmit={onAddVehicle} className="mt-4 grid gap-3 rounded-2xl border border-gold/30 bg-gold/10 p-4 sm:grid-cols-2"><Field label="Make" value={newVehicle.make} onChange={(value) => setNewVehicle((current) => ({ ...current, make: value }))} placeholder="e.g. Tata" /><Field label="Model" value={newVehicle.model} onChange={(value) => setNewVehicle((current) => ({ ...current, model: value }))} placeholder="e.g. Nexon" /><Field label="Registration" value={newVehicle.registration} onChange={(value) => setNewVehicle((current) => ({ ...current, registration: value.toUpperCase() }))} placeholder="e.g. HR26EF9012" /><Field label="Color" value={newVehicle.color} onChange={(value) => setNewVehicle((current) => ({ ...current, color: value }))} placeholder="e.g. Blue" /><label className="grid gap-1 text-xs font-medium text-foreground">Vehicle type<select value={newVehicle.type} onChange={(event) => setNewVehicle((current) => ({ ...current, type: event.target.value as VehicleType }))} className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground"><option>Hatchback</option><option>Sedan</option><option>SUV</option><option>MUV</option><option>Other</option></select></label><div className="flex items-end"><Button type="submit" className="h-10 w-full rounded-lg bg-ink text-cream hover:bg-ink-soft">Save vehicle</Button></div></form>}</section><section><SectionHeading title="Account" /><div className="divide-y divide-border rounded-2xl border border-border bg-card px-5"><ProfileRow icon={MapPin} label="Addresses" value="Palm Residency · Tower B · P2-218" /><ProfileRow icon={WalletCards} label="Payment methods" value="•••• 4242" /><ProfileRow icon={ReceiptText} label="Payment history" value="3 receipts" /><ProfileRow icon={CircleHelp} label="Help & support" value="We usually reply in minutes" /><ProfileRow icon={Menu} label="Terms & privacy" value="MyGate Car Care policies" /></div></section><Button variant="outline" onClick={() => toast("You are signed out of this demo session")} className="w-full rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10">Log out</Button><Button onClick={() => onBook("subscription")} className="w-full rounded-xl bg-gold text-ink hover:bg-gold-soft">Explore plans for {selectedVehicleLabel(vehicles, selectedVehicleId)}</Button></div>;
}

function BookingFlow({ step, setStep, selectedVehicle, vehicles, selectedVehicleId, setSelectedVehicleId, selectedService, setSelectedService, selectedDate, setSelectedDate, selectedSlot, setSelectedSlot, selectedPlan, setSelectedPlan, currentPlanSet, bookingTotal, onClose, onComplete }: { step: BookingStep; setStep: (value: BookingStep) => void; selectedVehicle: Vehicle; vehicles: Vehicle[]; selectedVehicleId: number; setSelectedVehicleId: (value: number) => void; selectedService: string; setSelectedService: (value: string) => void; selectedDate: string; setSelectedDate: (value: string) => void; selectedSlot: string; setSelectedSlot: (value: string) => void; selectedPlan: number; setSelectedPlan: (value: number) => void; currentPlanSet: { label: string; price: number }[]; bookingTotal: number; onClose: () => void; onComplete: () => void }) {
  const isSubscription = selectedService === "subscription";
  const activePlan = currentPlanSet[selectedPlan];
  if (!activePlan) return null;
  const stepTitles = ["Vehicle", "Service", "Schedule", "Review", "Payment"];
  return <div className="fixed inset-0 z-40 flex items-end justify-center bg-ink/75 p-0 backdrop-blur-sm sm:items-center sm:p-6"><section className="flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-t-3xl bg-paper shadow-2xl sm:rounded-3xl"><header className="flex items-center justify-between border-b border-border px-5 py-4"><div className="flex items-center gap-3"><Button variant="ghost" size="icon" onClick={() => step === 1 ? onClose() : setStep((step - 1) as BookingStep)} className="rounded-full" aria-label={step === 1 ? "Close booking" : "Go back"} title={step === 1 ? "Close" : "Back"}>{step === 1 ? <X className="size-4" /> : <ArrowLeft className="size-4" />}</Button><div><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">Book a service</p><p className="mt-1 text-sm font-semibold">{stepTitles[step - 1]} selection</p></div></div><span className="text-xs font-semibold text-muted-foreground">{step} of 5</span></header><div className="grid grid-cols-5 gap-1 px-5 py-3">{stepTitles.map((title, index) => <div key={title} className={`h-1.5 rounded-full ${index < step ? "bg-gold" : "bg-muted"}`} />)}</div><div className="overflow-y-auto px-5 pb-5 pt-2 sm:px-7">{step === 1 && <div className="space-y-3"><p className="text-sm text-muted-foreground">Which car should we care for?</p>{vehicles.map((vehicle) => <button key={vehicle.id} onClick={() => setSelectedVehicleId(vehicle.id)} className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left ${vehicle.id === selectedVehicleId ? "border-gold bg-gold/10" : "border-border bg-card"}`}><span className="grid size-11 place-items-center rounded-xl bg-muted"><CarFront className="size-5" /></span><span className="flex-1"><span className="block text-sm font-semibold">{vehicle.make} {vehicle.model}</span><span className="mt-1 block text-xs text-muted-foreground">{vehicle.registration} · {vehicle.type}</span></span>{vehicle.id === selectedVehicleId && <span className="grid size-6 place-items-center rounded-full bg-gold text-ink"><Check className="size-3.5" /></span>}</button>)}</div>}{step === 2 && <div className="space-y-3"><p className="text-sm text-muted-foreground">Choose a one-time service or make it effortless with a plan.</p><button onClick={() => setSelectedService("subscription")} className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left ${isSubscription ? "border-gold bg-gold/10" : "border-border bg-card"}`}><span><span className="block text-sm font-semibold">Daily Care Subscription</span><span className="mt-1 block text-xs text-muted-foreground">Exterior, tyres, weekly interior, air checks</span></span><span className="text-sm font-bold text-gold">{money(activePlan.price)}</span></button>{services.map((service) => <button key={service.id} onClick={() => setSelectedService(service.id)} className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left ${selectedService === service.id ? "border-gold bg-gold/10" : "border-border bg-card"}`}><span><span className="block text-sm font-semibold">{service.name}</span><span className="mt-1 block text-xs text-muted-foreground">{service.detail} · {service.cadence}</span></span><span className="text-sm font-semibold">{money(service.price)}</span></button>)}</div>}{step === 3 && <div className="space-y-6"><div><p className="text-sm font-semibold">Palm Residency</p><p className="mt-1 text-xs text-muted-foreground"><MapPin className="mr-1 inline size-3.5 text-gold" />Tower B · Parking P2-218</p></div><div><p className="mb-3 text-sm font-semibold">Choose a date</p><div className="grid grid-cols-3 gap-2">{["Tomorrow, 12 Sep", "Sun, 13 Sep", "Mon, 14 Sep"].map((date, index) => <button key={date} onClick={() => setSelectedDate(date)} className={`rounded-xl border px-2 py-3 text-center text-xs ${selectedDate === date ? "border-gold bg-gold/10 font-semibold text-gold" : "border-border bg-card text-muted-foreground"}`}><span className="block text-[10px]">{index === 0 ? "SAT" : index === 1 ? "SUN" : "MON"}</span><span className="mt-1 block">{date.split(", ")[1]}</span></button>)}</div></div><div><p className="mb-3 text-sm font-semibold">Morning slots</p><div className="grid grid-cols-2 gap-2">{["6:00–7:00 AM", "7:00–8:00 AM", "8:00–9:00 AM", "9:00–10:00 AM"].map((slot, index) => <button key={slot} disabled={index === 3} onClick={() => setSelectedSlot(slot)} className={`rounded-xl border px-3 py-3 text-left text-xs ${index === 3 ? "cursor-not-allowed border-border bg-muted text-muted-foreground/50 line-through" : selectedSlot === slot ? "border-gold bg-gold/10 font-semibold text-gold" : "border-border bg-card text-muted-foreground"}`}><Clock3 className="mr-1.5 inline size-3.5" />{slot}</button>)}</div><p className="mt-2 text-[11px] text-muted-foreground">One slot is unavailable for this date.</p></div></div>}{step === 4 && <ReviewContent selectedVehicle={selectedVehicle} selectedService={selectedService} isSubscription={isSubscription} currentPlanSet={currentPlanSet} selectedPlan={selectedPlan} setSelectedPlan={setSelectedPlan} selectedDate={selectedDate} selectedSlot={selectedSlot} bookingTotal={bookingTotal} />}{step === 5 && <div className="space-y-5"><div className="rounded-2xl bg-ink p-5 text-cream"><p className="text-xs text-muted">Secure payment</p><p className="mt-2 text-3xl font-bold text-gold">{money(bookingTotal)}</p><p className="mt-1 text-xs text-muted">{isSubscription ? "Subscription payment" : "One-time service"} · No hidden charges</p></div><div className="rounded-2xl border border-gold/30 bg-gold/10 p-4"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-card"><CreditCard className="size-4 text-gold" /></span><div><p className="text-sm font-semibold">HDFC Bank •••• 4242</p><p className="mt-1 text-xs text-muted-foreground">Default payment method</p></div><Check className="ml-auto size-4 text-gold" /></div></div><p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-gold" />Your payment details are securely handled. This demo uses mock payment confirmation.</p></div>}</div><footer className="flex gap-3 border-t border-border bg-paper px-5 py-4 sm:px-7">{step < 5 ? <Button onClick={() => setStep((step + 1) as BookingStep)} className="w-full rounded-xl bg-ink py-3 text-sm text-cream hover:bg-ink-soft">Continue <ArrowRight className="size-4" /></Button> : <Button onClick={onComplete} className="w-full rounded-xl bg-gold py-3 text-sm font-semibold text-ink hover:bg-gold-soft">Pay {money(bookingTotal)} <Check className="size-4" /></Button>}</footer></section></div>;
}

function ReviewContent({ selectedVehicle, selectedService, isSubscription, currentPlanSet, selectedPlan, setSelectedPlan, selectedDate, selectedSlot, bookingTotal }: { selectedVehicle: Vehicle; selectedService: string; isSubscription: boolean; currentPlanSet: { label: string; price: number }[]; selectedPlan: number; setSelectedPlan: (value: number) => void; selectedDate: string; selectedSlot: string; bookingTotal: number }) {
  const serviceLabel = isSubscription ? "Daily Care Subscription" : services.find((service) => service.id === selectedService)?.name ?? "Car care service";
  return <div className="space-y-4"><p className="text-sm text-muted-foreground">Everything look right?</p><SummaryRow icon={CarFront} label="Vehicle" value={`${selectedVehicle.make} ${selectedVehicle.model} · ${selectedVehicle.registration}`} /><SummaryRow icon={Sparkles} label="Service" value={serviceLabel} /><SummaryRow icon={CalendarDays} label="Schedule" value={`${selectedDate} · ${selectedSlot}`} /><SummaryRow icon={MapPin} label="Location" value="Palm Residency · Tower B · P2-218" />{isSubscription && <div className="rounded-xl border border-border bg-muted p-3"><label className="flex items-center justify-between text-xs font-semibold">Plan duration<select value={selectedPlan} onChange={(event) => setSelectedPlan(Number(event.target.value))} className="rounded-lg border border-input bg-background px-2 py-1 text-xs text-foreground">{currentPlanSet.map((plan, index) => <option key={plan.label} value={index}>{plan.label} · {money(plan.price)}</option>)}</select></label></div>}<div className="border-t border-border pt-4"><div className="flex justify-between text-sm"><span className="text-muted-foreground">Service total</span><span className="font-semibold">{money(bookingTotal)}</span></div><div className="mt-2 flex justify-between text-sm"><span className="text-muted-foreground">Society offer</span><span className="font-semibold text-gold">−₹0</span></div><div className="mt-4 flex justify-between text-lg font-bold"><span>Total</span><span>{money(bookingTotal)}</span></div></div></div>;
}

function BookingDetails({ onClose }: { onClose: () => void }) {
  return <div className="fixed inset-0 z-40 flex items-end justify-center bg-ink/75 p-0 backdrop-blur-sm sm:items-center sm:p-6"><section className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-paper p-5 shadow-2xl sm:rounded-3xl sm:p-7"><div className="flex items-start justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">MG-CW-10245</p><h2 className="mt-2 font-display text-3xl italic">Service tracking</h2><p className="mt-1 text-sm text-muted-foreground">Hyundai Creta · Daily Premium Cleaning</p></div><Button variant="ghost" size="icon" onClick={onClose} className="rounded-full" aria-label="Close tracking" title="Close"><X className="size-4" /></Button></div><div className="mt-7 rounded-2xl bg-ink p-5 text-cream"><div className="flex items-center justify-between"><div><p className="text-xs text-muted">Tomorrow · 7:00–8:00 AM</p><p className="mt-2 text-lg font-semibold">Cleaner assigned</p></div><span className="grid size-11 place-items-center rounded-xl bg-gold text-ink"><ShieldCheck className="size-5" /></span></div><div className="mt-5 h-1.5 overflow-hidden rounded-full bg-cream/15"><div className="h-full w-1/2 rounded-full bg-gold" /></div><p className="mt-2 text-[10px] text-muted">3 of 6 stages complete</p></div><div className="mt-7 space-y-0">{timeline.map((item, index) => <div key={item.label} className="flex gap-4"><div className="flex flex-col items-center"><span className={`grid size-7 place-items-center rounded-full ${item.complete ? "bg-gold text-ink" : "border border-border bg-card text-muted-foreground"}`}>{item.complete ? <Check className="size-3.5" /> : <span className="size-2 rounded-full bg-muted" />}</span>{index < timeline.length - 1 && <span className={`h-10 w-px ${item.complete ? "bg-gold/60" : "bg-border"}`} />}</div><div className="flex flex-1 items-start justify-between pb-3"><p className={`pt-1 text-sm ${item.complete ? "font-semibold" : "text-muted-foreground"}`}>{item.label}</p><span className="pt-1 text-xs text-muted-foreground">{item.time}</span></div></div>)}</div><div className="mt-4 grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-border bg-card p-4"><p className="text-xs text-muted-foreground">Service provider</p><p className="mt-2 text-sm font-semibold">Aman Kumar</p><p className="mt-1 text-xs text-muted-foreground">4.8 · 3 years experience</p></div><div className="rounded-xl border border-border bg-card p-4"><p className="text-xs text-muted-foreground">Need help?</p><p className="mt-2 text-sm font-semibold">Talk to support</p><p className="mt-1 text-xs text-muted-foreground"><MessageCircle className="mr-1 inline size-3.5 text-gold" />Usually replies in minutes</p></div></div><Button onClick={() => toast("Rating will unlock after service completion")} variant="outline" className="mt-5 w-full rounded-xl">Rate after service <Star className="size-4 text-gold" /></Button></section></div>;
}

function PageIntro({ eyebrow, title, detail }: { eyebrow: string; title: string; detail: string }) { return <div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">{eyebrow}</p><h1 className="mt-3 max-w-2xl font-display text-4xl italic leading-[0.95] text-foreground">{title}</h1><p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">{detail}</p></div>; }
function SectionHeading({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) { return <div className="mb-3 flex items-center justify-between"><h2 className="font-display text-xl italic">{title}</h2>{action && <Button variant="link" onClick={onAction} className="h-auto p-0 text-xs text-gold">{action} <ChevronRight className="size-3.5" /></Button>}</div>; }
function TrustItem({ icon: Icon, title, detail }: { icon: typeof ShieldCheck; title: string; detail: string }) { return <div className="rounded-xl border border-border bg-card p-4"><Icon className="size-4 text-gold" /><p className="mt-3 text-sm font-semibold">{title}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p></div>; }
function HistoryRow({ title, date, amount, status }: { title: string; date: string; amount: string; status: string }) { return <div className="flex items-center gap-3 py-4"><div className="grid size-9 place-items-center rounded-lg bg-muted"><ReceiptText className="size-4 text-muted-foreground" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{title}</p><p className="mt-1 text-xs text-muted-foreground">{date} · {status}</p></div><span className="text-sm font-semibold">{amount}</span></div>; }
function ProfileRow({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) { return <Button variant="ghost" onClick={() => toast(`${label} is ready for API integration`)} className="flex h-auto w-full justify-start gap-3 rounded-none px-0 py-4 text-left hover:bg-transparent"><Icon className="size-4 text-gold" /><span className="flex-1"><span className="block text-sm font-semibold">{label}</span><span className="mt-1 block text-xs text-muted-foreground">{value}</span></span><ChevronRight className="size-4 text-muted-foreground" /></Button>; }
function SummaryRow({ icon: Icon, label, value }: { icon: typeof CarFront; label: string; value: string }) { return <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-3"><Icon className="mt-0.5 size-4 shrink-0 text-gold" /><div><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{label}</p><p className="mt-1 text-sm font-medium">{value}</p></div></div>; }
function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) { return <label className="grid gap-1 text-xs font-medium text-foreground">{label}<input required value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground" /></label>; }
function selectedVehicleLabel(vehicles: Vehicle[], id: number) { const vehicle = vehicles.find((item) => item.id === id); return vehicle ? `${vehicle.make} ${vehicle.model}` : "your car"; }