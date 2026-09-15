"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  Bell,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  FileUp,
  HelpCircle,
  LayoutDashboard,
  MapPin,
  Menu,
  MessageSquareText,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Timer,
  X,
  Building2,
  Users,
  BarChart3,
  CircleAlert,
  RotateCcw,
  UserRound,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";

type Status =
  | "Submitted"
  | "In review"
  | "Assigned"
  | "In progress"
  | "Resolved";
type Complaint = {
  id: string;
  title: string;
  category: string;
  department: string;
  status: Status;
  priority: "Normal" | "High";
  date: string;
  location: string;
  description: string;
  officer: string;
  updates: { date: string; text: string }[];
};
const initialCases: Complaint[] = [
  {
    id: "JSP-2026-00482",
    title: "Streetlight not working near community park",
    category: "Utility services",
    department: "Municipal Services",
    status: "In progress",
    priority: "High",
    date: "12 Sep 2026",
    location: "Sector 18, Green Park",
    description:
      "Three streetlights on the eastern pathway have not been operational for four evenings. The area is poorly lit after sunset.",
    officer: "R. Mehta",
    updates: [
      {
        date: "12 Sep, 10:32",
        text: "Grievance submitted and reference generated.",
      },
      {
        date: "12 Sep, 11:04",
        text: "Routing simulation recommended Municipal Services.",
      },
      { date: "13 Sep, 09:15", text: "Assigned to field officer R. Mehta." },
      { date: "15 Sep, 16:40", text: "Site inspection scheduled for 17 Sep." },
    ],
  },
  {
    id: "JSP-2026-00471",
    title: "Overflowing waste collection point",
    category: "Sanitation",
    department: "Municipal Services",
    status: "Assigned",
    priority: "High",
    date: "10 Sep 2026",
    location: "Ward 4, Lake Road",
    description: "Collection point needs attention.",
    officer: "K. Sharma",
    updates: [
      { date: "10 Sep, 09:10", text: "Grievance submitted." },
      { date: "10 Sep, 10:24", text: "Assigned to Municipal Services." },
    ],
  },
  {
    id: "JSP-2026-00438",
    title: "Water supply interruption",
    category: "Water supply",
    department: "Water Board",
    status: "Resolved",
    priority: "Normal",
    date: "02 Sep 2026",
    location: "East Avenue",
    description: "Intermittent water supply for two days.",
    officer: "A. Khan",
    updates: [
      { date: "02 Sep, 08:30", text: "Grievance submitted." },
      { date: "04 Sep, 14:10", text: "Repair completed; resolution shared." },
    ],
  },
  {
    id: "JSP-2026-00412",
    title: "Damaged footpath near bus stop",
    category: "Roads & transport",
    department: "Public Works",
    status: "In review",
    priority: "Normal",
    date: "30 Aug 2026",
    location: "Central Station",
    description: "Uneven pavers pose a tripping risk.",
    officer: "Unassigned",
    updates: [
      { date: "30 Aug, 12:15", text: "Grievance submitted; awaiting review." },
    ],
  },
];
const statusStyle: Record<Status, "default" | "warning" | "neutral"> = {
  Submitted: "neutral",
  "In review": "warning",
  Assigned: "warning",
  "In progress": "default",
  Resolved: "default",
};
const routes: Record<
  string,
  { department: string; confidence: string; rationale: string }
> = {
  "Water supply": {
    department: "Water Board",
    confidence: "High match",
    rationale: "Keywords and category map to water infrastructure.",
  },
  "Roads & transport": {
    department: "Public Works",
    confidence: "High match",
    rationale: "Road and footpath issues route to public works.",
  },
  Sanitation: {
    department: "Municipal Services",
    confidence: "High match",
    rationale: "Waste and cleanliness matters route to municipal services.",
  },
  "Utility services": {
    department: "Municipal Services",
    confidence: "Suggested",
    rationale: "Lighting and local civic utilities route here.",
  },
  Housing: {
    department: "Housing & Urban Affairs",
    confidence: "High match",
    rationale: "Housing-related concerns route to the urban affairs desk.",
  },
};

function StatusBadge({ status }: { status: Status }) {
  return <Badge variant={statusStyle[status]}>{status}</Badge>;
}
function MiniLogo() {
  return (
    <div className="flex items-center gap-2">
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#123047] text-white">
        <Building2 size={19} />
      </div>
      <span className="text-lg font-bold tracking-tight">
        Niv<span className="text-[#0f766e]">aran</span>
      </span>
    </div>
  );
}
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-[#0f766e]">
      <span className="h-px w-7 bg-[#0f766e]" />
      {children}
    </div>
  );
}

export default function PortalDemo() {
  const [screen, setScreen] = useState<
    "home" | "lodge" | "track" | "citizen" | "admin"
  >("home");
  const [cases, setCases] = useState(initialCases);
  const [menu, setMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [trackResult, setTrackResult] = useState<Complaint | null | undefined>(
    undefined,
  );
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "Aarav Mehta",
    phone: "98765 43210",
    email: "aarav@example.test",
    category: "Utility services",
    location: "Sector 18, Green Park",
    urgency: "High",
    description:
      "Streetlight near the community park has not been operational for four evenings.",
  });
  const [notice, setNotice] = useState("");
  const [selected, setSelected] = useState<Complaint>(initialCases[0]);
  const [filter, setFilter] = useState("All");
  const nav = (x: typeof screen) => {
    setScreen(x);
    setMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const track = (id: string) => {
    setTrackResult(undefined);
    setTimeout(
      () =>
        setTrackResult(
          cases.find((c) => c.id.toLowerCase() === id.trim().toLowerCase()) ??
            null,
        ),
      450,
    );
  };
  const addCase = () => {
    const id = "JSP-2026-00501";
    const decision = routes[form.category] || routes["Utility services"];
    const c: Complaint = {
      id,
      title:
        form.description.slice(0, 58) +
        (form.description.length > 58 ? "…" : ""),
      category: form.category,
      department: decision.department,
      status: "Submitted",
      priority: form.urgency === "High" ? "High" : "Normal",
      date: "16 Sep 2026",
      location: form.location,
      description: form.description,
      officer: "Unassigned",
      updates: [
        {
          date: "16 Sep, 10:15",
          text: "Grievance submitted in this local demo.",
        },
        {
          date: "16 Sep, 10:15",
          text: `Routing simulation suggested ${decision.department}.`,
        },
      ],
    };
    setCases((a) => [c, ...a]);
    setSubmitted(id);
    setStep(4);
  };
  const filtered = useMemo(
    () =>
      cases.filter(
        (c) =>
          (filter === "All" ||
            c.status === filter ||
            c.department === filter) &&
          `${c.id} ${c.title} ${c.category}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [cases, filter, query],
  );
  const updateCase = (id: string, patch: Partial<Complaint>, msg: string) => {
    setCases((cs) =>
      cs.map((c) =>
        c.id === id
          ? {
              ...c,
              ...patch,
              updates: [...c.updates, { date: "16 Sep, 11:20", text: msg }],
            }
          : c,
      ),
    );
    setSelected((s) =>
      s.id === id
        ? {
            ...s,
            ...patch,
            updates: [...s.updates, { date: "16 Sep, 11:20", text: msg }],
          }
        : s,
    );
    setNotice("Update saved locally for this browser session.");
  };
  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-[#dbe5e4] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <button aria-label="Go to home" onClick={() => nav("home")}>
            <MiniLogo />
          </button>
          <nav
            className="desktop-only flex items-center gap-1"
            aria-label="Main navigation"
          >
            {(
              [
                ["Home", "home"],
                ["Track", "track"],
                ["Citizen dashboard", "citizen"],
                ["Administration", "admin"],
              ] as const
            ).map(([label, id]) => (
              <button
                key={id}
                onClick={() => nav(id)}
                className={`rounded-md px-3 py-2 text-sm font-medium ${screen === id ? "bg-[#edf4f3] text-[#0f766e]" : "text-[#536675] hover:bg-[#f5f7f6]"}`}
              >
                {label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button
              className="desktop-only"
              size="sm"
              variant="saffron"
              onClick={() => nav("lodge")}
            >
              Lodge a grievance <ArrowRight size={14} />
            </Button>
            <button
              className="md:hidden"
              onClick={() => setMenu(!menu)}
              aria-label="Open menu"
            >
              <Menu />
            </button>
          </div>
        </div>
        {menu && (
          <div className="border-t bg-white p-3 md:hidden">
            <div className="grid gap-1">
              {(
                [
                  ["Home", "home"],
                  ["Track grievance", "track"],
                  ["Citizen dashboard", "citizen"],
                  ["Administration", "admin"],
                  ["Lodge a grievance", "lodge"],
                ] as const
              ).map(([l, x]) => (
                <button
                  className="rounded px-3 py-2 text-left font-medium"
                  onClick={() => nav(x)}
                  key={x}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>
      {screen === "home" && <Home onNav={nav} />}{" "}
      {screen === "lodge" && (
        <Lodge
          step={step}
          setStep={setStep}
          form={form}
          setForm={setForm}
          submitted={submitted}
          onSubmit={addCase}
          onNav={nav}
        />
      )}{" "}
      {screen === "track" && (
        <Track
          query={query}
          setQuery={setQuery}
          result={trackResult}
          onTrack={track}
        />
      )}{" "}
      {screen === "citizen" && (
        <Citizen
          cases={cases}
          query={query}
          setQuery={setQuery}
          filtered={filtered}
          filter={filter}
          setFilter={setFilter}
          selected={selected}
          setSelected={setSelected}
          updateCase={updateCase}
        />
      )}{" "}
      {screen === "admin" && (
        <Admin
          cases={cases}
          query={query}
          setQuery={setQuery}
          filtered={filtered}
          filter={filter}
          setFilter={setFilter}
          selected={selected}
          setSelected={setSelected}
          updateCase={updateCase}
          notice={notice}
        />
      )}
      <footer className="border-t bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-xs text-[#647582] sm:flex-row sm:justify-between">
          <span>
            Nivaran is a frontend-only portfolio demonstration. All data is
            fictional and stored locally.
          </span>
          <span>
            Inspired by the SIH 2023 grievance portal presentation · No
            government integration
          </span>
        </div>
      </footer>
    </main>
  );
}

function Home({ onNav }: { onNav: (x: any) => void }) {
  return (
    <>
      <section className="landing-hero overflow-hidden">
        <div className="landing-glow" />
        <div className="relative mx-auto max-w-7xl px-5 pb-0 pt-20 text-center sm:pt-28">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#eadfce] bg-white/80 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[.16em] text-[#956a30]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#e69a37]" />
            Unified grievance lodging · demo
          </p>
          <h1 className="landing-title mx-auto mt-7 max-w-4xl text-5xl leading-[.96] text-[#183346] sm:text-7xl lg:text-8xl">
            Turn every concern into a{" "}
            <span className="text-[#c87b27]">clearer resolution.</span>
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-[#63717b] sm:text-lg">
          Nivaran brings grievance lodging, transparent routing, and progress
            visibility into one calm civic-service workspace—so citizens can
            follow what happens next.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button size="lg" variant="saffron" onClick={() => onNav("lodge")}>
              Lodge a grievance <ArrowRight size={18} />
            </Button>
            <Button size="lg" variant="outline" onClick={() => onNav("track")}>
              <Search size={17} /> Track grievance
            </Button>
          </div>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-[#73808a]">
            <span>Sample data only</span>
            <span className="h-3 w-px bg-[#d9ddd8]" />
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-[#c87b27]" />
              No government integration
            </span>
            <span className="h-3 w-px bg-[#d9ddd8]" />
            <button
              onClick={() => onNav("track")}
              className="underline decoration-[#c87b27]/50 underline-offset-4"
            >
              Try JSP-2026-00482
            </button>
          </div>
          <PortalPreview onNav={onNav} />
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-24">
        <div className="grid gap-10 lg:grid-cols-[.82fr_1.18fr]">
          <div>
          <SectionLabel>Why Nivaran</SectionLabel>
            <h2 className="landing-title text-4xl leading-tight sm:text-5xl">
              Everything needed to follow a grievance properly.
            </h2>
            <p className="mt-5 max-w-md leading-7 text-[#63717b]">
              A clear handoff from submitted concern to departmental
              action—without hiding the journey behind paperwork.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              [
                MessageSquareText,
                "Guided lodging",
                "Capture the issue, location, category and urgency in a considered, accessible flow.",
              ],
              [
                Timer,
                "Visible progress",
                "Follow each milestone, see the assigned department, and review updates in context.",
              ],
              [
                SlidersHorizontal,
                "Transparent routing",
                "Local rules make the proposed routing suggestion easy to inspect and explain.",
              ],
              [
                BarChart3,
                "Operational overview",
                "An administration surface keeps the fictional demo queue focused and actionable.",
              ],
            ].map(([Icon, t, d]: any) => (
              <div
                key={t}
                className="rounded-xl border border-[#e6e8e3] bg-white p-5 shadow-[0_1px_2px_rgba(31,53,63,.04)]"
              >
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#fff3e1] text-[#c87b27]">
                  <Icon size={18} />
                </div>
                <h3 className="mt-5 font-bold text-[#183346]">{t}</h3>
                <p className="mt-2 text-sm leading-6 text-[#6b7981]">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="border-y border-[#e4e8e4] bg-[#f0f5f2]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-2">
          <div>
            <SectionLabel>Proposed routing workflow</SectionLabel>
            <h2 className="landing-title text-4xl leading-tight">
              Transparent local rules, not a deployed AI system.
            </h2>
            <p className="mt-5 max-w-xl leading-7 text-[#5e6e77]">
              The supplied presentation proposes chatbot and automation-based
              handling. This frontend demonstrates that concept with inspectable
              category rules and fictional data only.
            </p>
            <Button
              className="mt-7"
              variant="outline"
              onClick={() => onNav("lodge")}
            >
              Explore the demo flow <ArrowRight size={16} />
            </Button>
          </div>
          <Card className="border-[#d9e4de] shadow-none">
            <CardContent className="space-y-3 p-5 sm:p-7">
              {[
                ["Water supply", "Water Board", "High match"],
                ["Roads & transport", "Public Works", "High match"],
                ["Sanitation / utilities", "Municipal Services", "Suggested"],
              ].map(([a, b, c]) => (
                <div
                  className="flex items-center justify-between gap-3 rounded-lg border border-[#e3e8e4] p-4"
                  key={a}
                >
                  <div>
                    <p className="text-sm font-semibold">{a}</p>
                    <p className="mt-1 text-xs text-[#70808a]">
                      Category selected by the citizen
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge>{b}</Badge>
                    <p className="mt-1 text-[11px] text-[#75838a]">{c}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}

function PortalPreview({ onNav }: { onNav: (x: any) => void }) {
  return (
    <div className="preview-shell mx-auto mt-14 max-w-5xl text-left">
      <div className="preview-callout desktop-only">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#fff0dc] text-[#c87b27]">
          <Sparkles size={17} />
        </div>
        <div>
          <b>One civic workspace</b>
          <span>lodge → route → resolve</span>
        </div>
      </div>
      <div className="preview-bar">
        <div className="flex gap-1.5">
          <span className="bg-[#e67965]" />
          <span className="bg-[#eab14d]" />
          <span className="bg-[#66ae83]" />
        </div>
        <span className="ml-4 font-mono text-[11px] text-[#71808a]">
          nivaran / citizen / overview
        </span>
      </div>
      <div className="grid min-h-[370px] grid-cols-1 md:grid-cols-[190px_1fr]">
        <aside className="hidden border-r border-[#e7ebe7] bg-[#f8faf8] p-4 md:block">
          <MiniLogo />
          <div className="mt-8 space-y-1 text-sm">
            <p className="rounded-md bg-[#eaf2ef] px-3 py-2 font-semibold text-[#17665e]">
              Overview
            </p>
            <p className="px-3 py-2 text-[#72818a]">My grievances</p>
            <p className="px-3 py-2 text-[#72818a]">Updates</p>
            <p className="px-3 py-2 text-[#72818a]">Help centre</p>
          </div>
          <div className="mt-16 rounded-lg border border-[#e1e8e3] bg-white p-3">
            <p className="text-xs font-semibold">Need assistance?</p>
            <p className="mt-1 text-[11px] leading-4 text-[#75838a]">
              Use the guided flow to record an issue.
            </p>
          </div>
        </aside>
        <div className="p-5 sm:p-7">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.13em] text-[#78908b]">
                Citizen overview
              </p>
              <h3 className="mt-2 text-xl font-bold text-[#183346]">
                Good morning, Aarav.
              </h3>
              <p className="mt-1 text-sm text-[#71808a]">
                Here is the latest on your submitted grievances.
              </p>
            </div>
            <Button size="sm" variant="saffron" onClick={() => onNav("lodge")}>
              <span className="desktop-only">Lodge grievance</span>
              <span className="md:hidden">Lodge</span>
              <ArrowRight size={14} />
            </Button>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              ["Open cases", "02", "#183346"],
              ["In progress", "01", "#c87b27"],
              ["Resolved", "04", "#168477"],
            ].map(([l, n, c]) => (
              <div className="rounded-lg border border-[#e4e9e5] p-3" key={l}>
                <p className="text-xs text-[#71808a]">{l}</p>
                <p className="mt-1 text-2xl font-bold" style={{ color: c }}>
                  {n}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-lg border border-[#e3e9e5] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold tracking-wide text-[#6c7e87]">
                  JSP-2026-00482
                </p>
                <p className="mt-1 text-sm font-semibold">
                  Streetlight not working near community park
                </p>
                <p className="mt-1 text-xs text-[#74838c]">
                  Municipal Services · Updated 15 Sep
                </p>
              </div>
              <Badge>In progress</Badge>
            </div>
            <div className="mt-4 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((x) => (
                <span
                  className={`h-1.5 flex-1 rounded ${x < 5 ? "bg-[#168477]" : "bg-[#dde7e3]"}`}
                  key={x}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Lodge({
  step,
  setStep,
  form,
  setForm,
  submitted,
  onSubmit,
  onNav,
}: any) {
  const set = (k: string, v: string) => setForm({ ...form, [k]: v });
  const decision = routes[form.category] || routes["Utility services"];
  const steps = [
    "Your details",
    "Issue details",
    "Review & route",
    "Confirmation",
  ];
  return (
    <section className="mx-auto max-w-4xl px-5 py-10 sm:py-14">
      <div className="mb-8">
        <SectionLabel>Lodge a grievance</SectionLabel>
        <h1 className="display text-4xl">Tell us what needs attention.</h1>
        <p className="mt-2 text-sm text-[#647582]">
          This is a local demo. Do not submit real personal or emergency
          information.
        </p>
      </div>
      <div className="mb-8 grid grid-cols-4 gap-2">
        {steps.map((s, i) => (
          <div key={s}>
            <div
              className={`h-1 rounded ${step >= i + 1 ? "bg-[#0f766e]" : "bg-[#d9e3e1]"}`}
            />
            <p
              className={`mt-2 text-xs ${step === i + 1 ? "font-bold text-[#123047]" : "text-[#778791]"}`}
            >
              {i + 1}. <span className="desktop-only">{s}</span>
            </p>
          </div>
        ))}
      </div>
      <Card>
        <CardContent className="p-6 sm:p-8">
          {step === 1 && (
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Full name"
                value={form.name}
                onChange={(v: string) => set("name", v)}
              />
              <Field
                label="Mobile number"
                value={form.phone}
                onChange={(v: string) => set("phone", v)}
              />
              <div className="sm:col-span-2">
                <Field
                  label="Email address (optional)"
                  value={form.email}
                  onChange={(v: string) => set("email", v)}
                  type="email"
                />
              </div>
              <FormFooter next={() => setStep(2)} />
            </div>
          )}
          {step === 2 && (
            <div className="grid gap-5 sm:grid-cols-2">
              <SelectField
                label="Category"
                value={form.category}
                onChange={(v: string) => set("category", v)}
                options={Object.keys(routes)}
              />
              <SelectField
                label="Urgency"
                value={form.urgency}
                onChange={(v: string) => set("urgency", v)}
                options={["Normal", "High"]}
              />
              <div className="sm:col-span-2">
                <Field
                  label="Location"
                  value={form.location}
                  onChange={(v: string) => set("location", v)}
                  icon={<MapPin size={16} />}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-semibold">
                  Describe the issue
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  className="mt-2 min-h-32 w-full rounded-md border border-[#cbd5df] bg-white p-3 text-sm"
                />
                <p className="mt-1 text-xs text-[#73828d]">
                  Avoid sharing sensitive personal information.
                </p>
              </div>
              <label className="sm:col-span-2 flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-[#a9beb9] bg-[#f5faf8] p-4">
                <FileUp className="text-[#0f766e]" />
                <span>
                  <b className="block text-sm">Attach supporting evidence</b>
                  <span className="text-xs text-[#647582]">
                    Local mock only · no file is uploaded
                  </span>
                </span>
                <input type="file" className="sr-only" />
              </label>
              <FormFooter back={() => setStep(1)} next={() => setStep(3)} />
            </div>
          )}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold">Review your submission</h2>
                <p className="mt-1 text-sm text-[#647582]">
                  Confirm the information below before generating a demo
                  reference.
                </p>
              </div>
              <div className="grid gap-3 rounded-lg bg-[#f3f7f6] p-5 text-sm sm:grid-cols-2">
                <Info label="Contact" value={`${form.name} · ${form.phone}`} />
                <Info label="Location" value={form.location} />
                <Info label="Category" value={form.category} />
                <Info label="Urgency" value={form.urgency} />
                <div className="sm:col-span-2">
                  <Info label="Description" value={form.description} />
                </div>
              </div>
              <div className="rounded-lg border border-[#b8d8d1] bg-[#eff8f5] p-4">
                <div className="flex gap-3">
                  <Sparkles className="mt-0.5 text-[#0f766e]" />
                  <div>
                    <p className="font-semibold">
                      Routing simulation: {decision.department}
                    </p>
                    <p className="mt-1 text-sm text-[#49616a]">
                      {decision.rationale} You can request a correction through
                      the administrative sample view.
                    </p>
                  </div>
                </div>
              </div>
              <FormFooter
                back={() => setStep(2)}
                next={onSubmit}
                nextText="Submit demo grievance"
              />
            </div>
          )}
          {step === 4 && (
            <div className="py-5 text-center">
              <CheckCircle2 className="mx-auto h-14 w-14 text-[#0f766e]" />
              <h2 className="mt-5 text-2xl font-bold">
                Your demonstration grievance is recorded.
              </h2>
              <p className="mt-2 text-[#647582]">
                This reference exists only in the current browser session.
              </p>
              <div className="mx-auto mt-6 max-w-sm rounded-lg border border-[#b9d8d2] bg-[#eff8f5] p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-[#52716c]">
                  Reference number
                </p>
                <p className="mt-1 text-2xl font-bold tracking-wide">
                  {submitted}
                </p>
              </div>
              <div className="mt-7 flex justify-center gap-3">
                <Button onClick={() => onNav("track")}>
                  Track this grievance
                </Button>
                <Button variant="outline" onClick={() => onNav("citizen")}>
                  View dashboard
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

function Field({ label, value, onChange, type = "text", icon }: any) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <div className="relative mt-2">
        {icon && (
          <span className="absolute left-3 top-3 text-[#60717d]">{icon}</span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`h-11 w-full rounded-md border border-[#cbd5df] bg-white px-3 text-sm ${icon ? "pl-9" : ""}`}
        />
      </div>
    </label>
  );
}
function SelectField({ label, value, onChange, options }: any) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 h-11 w-full rounded-md border border-[#cbd5df] bg-white px-3 text-sm"
      >
        {options.map((o: string) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}
function FormFooter({ back, next, nextText = "Continue" }: any) {
  return (
    <div className="flex justify-between gap-3 pt-4 sm:col-span-2">
      {back ? (
        <Button variant="outline" onClick={back}>
          Back
        </Button>
      ) : (
        <span />
      )}
      <Button onClick={next}>
        {nextText}
        <ArrowRight size={16} />
      </Button>
    </div>
  );
}
function Info({ label, value }: any) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-[#72818c]">
        {label}
      </p>
      <p className="mt-1 leading-5 text-[#213e50]">{value}</p>
    </div>
  );
}

function Track({ query, setQuery, result, onTrack }: any) {
  return (
    <section className="mx-auto max-w-5xl px-5 py-12">
      <div className="mx-auto max-w-2xl text-center">
        <SectionLabel>Track your grievance</SectionLabel>
        <h1 className="display text-4xl">Check progress with a reference.</h1>
        <p className="mt-3 text-[#647582]">
          Try{" "}
          <button
            className="font-bold underline"
            onClick={() => {
              setQuery("JSP-2026-00482");
              onTrack("JSP-2026-00482");
            }}
          >
            JSP-2026-00482
          </button>{" "}
          for a sample journey.
        </p>
        <div className="mt-6 flex gap-2">
          <input
            aria-label="Grievance reference number"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onTrack(query)}
            placeholder="e.g. JSP-2026-00482"
            className="h-12 flex-1 rounded-md border border-[#cbd5df] bg-white px-4 text-sm"
          />
          <Button onClick={() => onTrack(query)}>
            <Search size={17} /> Track
          </Button>
        </div>
      </div>
      {result === undefined && (
        <Card className="mx-auto mt-10 max-w-3xl">
          <CardContent className="p-8 text-center">
            <ClipboardList className="mx-auto text-[#88a39e]" />
            <p className="mt-3 font-semibold">
              Enter a reference number to view its journey.
            </p>
            <p className="mt-1 text-sm text-[#657783]">
              Updates are simulated using local sample data.
            </p>
          </CardContent>
        </Card>
      )}
      {result === null && (
        <Card className="mx-auto mt-10 max-w-3xl">
          <CardContent className="p-8 text-center">
            <HelpCircle className="mx-auto text-[#c48625]" />
            <h2 className="mt-3 font-bold">We couldn’t find that reference.</h2>
            <p className="mt-1 text-sm text-[#657783]">
              Check the number or use the sample reference above.
            </p>
          </CardContent>
        </Card>
      )}
      {result && <TrackDetail complaint={result} />}
    </section>
  );
}
function TrackDetail({ complaint: c }: { complaint: Complaint }) {
  const stages: [Status, string][] = [
    ["Submitted", "Received"],
    ["In review", "Reviewed"],
    ["Assigned", "Assigned"],
    ["In progress", "Work underway"],
    ["Resolved", "Resolved"],
  ];
  const pos = stages.findIndex((x) => x[0] === c.status);
  return (
    <div className="mx-auto mt-10 max-w-4xl space-y-5">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#687984]">
                {c.id}
              </p>
              <h2 className="mt-1 text-xl font-bold">{c.title}</h2>
              <p className="mt-2 text-sm text-[#627481]">
                <MapPin className="mr-1 inline h-4" />
                {c.location} · {c.department}
              </p>
            </div>
            <StatusBadge status={c.status} />
          </div>
          <div className="mt-7 grid gap-1 sm:grid-cols-5">
            {stages.map(([s, l], i) => (
              <div key={s} className="relative">
                <div
                  className={`h-9 w-9 rounded-full border-2 ${i <= pos ? "border-[#0f766e] bg-[#0f766e] text-white" : "border-[#cad7d5] bg-white text-[#9aaaa8]"} grid place-items-center text-xs`}
                >
                  {i <= pos ? <Check size={16} /> : i + 1}
                </div>
                {i < 4 && (
                  <div
                    className={`absolute left-9 top-4 h-0.5 w-[calc(100%-2.25rem)] ${i < pos ? "bg-[#0f766e]" : "bg-[#d7e1df]"}`}
                  />
                )}
                <p className="mt-2 text-xs font-medium">{l}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Activity history</CardTitle>
          </CardHeader>
          <CardContent>
            {c.updates.map((u, i) => (
              <div className="flex gap-3 pb-5 last:pb-0" key={u.date}>
                <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#0f766e]" />
                <div>
                  <p className="text-sm">{u.text}</p>
                  <p className="mt-1 text-xs text-[#73828d]">{u.date}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Case details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Info label="Assigned department" value={c.department} />
            <Info label="Priority" value={c.priority} />
            <Info label="Assigned officer" value={c.officer} />
            <Button className="w-full" variant="outline">
              <Bell size={15} /> Enable updates (demo)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Citizen({
  cases,
  query,
  setQuery,
  filtered,
  filter,
  setFilter,
  selected,
  setSelected,
  updateCase,
}: any) {
  return (
    <DashboardShell
      title="Citizen dashboard"
      description="Your locally stored sample grievances."
      nav="citizen"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["All grievances", cases.length, "#123047"],
          ["Needs your attention", 1, "#be7b1f"],
          [
            "Resolved",
            cases.filter((c: Complaint) => c.status === "Resolved").length,
            "#0f766e",
          ],
        ].map(([l, n, color]: any) => (
          <Card key={l}>
            <CardContent className="p-5">
              <p className="text-sm text-[#627481]">{l}</p>
              <p className="mt-1 text-3xl font-bold" style={{ color }}>
                {n}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <CaseWorkspace
        cases={filtered}
        query={query}
        setQuery={setQuery}
        filter={filter}
        setFilter={setFilter}
        selected={selected}
        setSelected={setSelected}
        admin={false}
        updateCase={updateCase}
      />
    </DashboardShell>
  );
}
function Admin({
  cases,
  query,
  setQuery,
  filtered,
  filter,
  setFilter,
  selected,
  setSelected,
  updateCase,
  notice,
}: any) {
  return (
    <DashboardShell
      title="Administration dashboard"
      description="Local operational view using fictional seed data."
      nav="admin"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          [
            "Open queue",
            cases.filter((c: Complaint) => c.status !== "Resolved").length,
            ClipboardList,
          ],
          [
            "High priority",
            cases.filter((c: Complaint) => c.priority === "High").length,
            CircleAlert,
          ],
          [
            "In progress",
            cases.filter((c: Complaint) => c.status === "In progress").length,
            Timer,
          ],
          [
            "Resolved",
            cases.filter((c: Complaint) => c.status === "Resolved").length,
            CheckCircle2,
          ],
        ].map(([l, n, Icon]: any) => (
          <Card key={l}>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm text-[#627481]">{l}</p>
                <p className="mt-1 text-3xl font-bold">{n}</p>
              </div>
              <Icon className="text-[#0f766e]" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
        <Card>
          <CardHeader>
            <CardTitle>Queue by department</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {[
                ["Municipal Services", 3],
                ["Water Board", 1],
                ["Public Works", 1],
                ["Housing & Urban Affairs", 0.5],
              ].map(([x, n]: any) => (
                <div key={x}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span>{x}</span>
                    <span className="font-bold">{n}</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#e6edeb]">
                    <div
                      className="h-2 rounded-full bg-[#0f766e]"
                      style={{ width: `${(n / 3) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#123047] text-white">
          <CardContent className="p-6">
            <p className="text-sm font-semibold text-[#b3dcd5]">Demo note</p>
            <p className="mt-3 text-lg font-semibold">
              All assignments and status changes are stored only in page state.
            </p>
            <p className="mt-3 text-sm leading-6 text-[#c7d7dc]">
              No users, data, notifications, or government systems are
              connected.
            </p>
          </CardContent>
        </Card>
      </div>
      {notice && (
        <div className="mt-5 flex items-center gap-2 rounded-md border border-[#a6d3ca] bg-[#edf8f5] p-3 text-sm text-[#185e55]">
          <CheckCircle2 size={16} />
          {notice}
        </div>
      )}
      <CaseWorkspace
        cases={filtered}
        query={query}
        setQuery={setQuery}
        filter={filter}
        setFilter={setFilter}
        selected={selected}
        setSelected={setSelected}
        admin
        updateCase={updateCase}
      />
    </DashboardShell>
  );
}
function DashboardShell({ title, description, children }: any) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-10">
      <SectionLabel>Frontend-only demo</SectionLabel>
      <h1 className="display text-4xl">{title}</h1>
      <p className="mt-2 text-[#647582]">{description}</p>
      <div className="mt-8">{children}</div>
    </section>
  );
}
function CaseWorkspace({
  cases,
  query,
  setQuery,
  filter,
  setFilter,
  selected,
  setSelected,
  admin,
  updateCase,
}: any) {
  const filters = admin
    ? [
        "All",
        "Submitted",
        "In review",
        "Assigned",
        "In progress",
        "Resolved",
        "Municipal Services",
        "Water Board",
      ]
    : ["All", "Submitted", "In progress", "Resolved"];
  return (
    <div className="mt-8 grid gap-5 xl:grid-cols-[1.05fr_.95fr]">
      <Card>
        <CardHeader className="gap-4">
          <div className="flex items-center justify-between">
            <CardTitle>
              {admin ? "Grievance queue" : "Submitted grievances"}
            </CardTitle>
            <Badge variant="neutral">{cases.length} shown</Badge>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 text-[#687984]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-9 w-full rounded-md border border-[#cbd5df] pl-9 text-sm"
                placeholder="Search reference or issue"
              />
            </div>
            <select
              aria-label="Filter cases"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="h-9 rounded-md border border-[#cbd5df] bg-white px-2 text-sm"
            >
              <option value="All">All</option>
              {filters.slice(1).map((x: string) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent className="max-h-[480px] overflow-auto p-2 pt-0">
          {cases.length ? (
            cases.map((c: Complaint) => (
              <button
                onClick={() => setSelected(c)}
                key={c.id}
                className={`mb-1 w-full rounded-lg p-4 text-left transition ${selected?.id === c.id ? "bg-[#e9f4f1]" : "hover:bg-[#f5f8f7]"}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold tracking-wide text-[#5e7180]">
                      {c.id}
                    </p>
                    <p className="mt-1 text-sm font-semibold leading-5">
                      {c.title}
                    </p>
                    <p className="mt-1 text-xs text-[#71818b]">
                      {c.department} · {c.date}
                    </p>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
              </button>
            ))
          ) : (
            <div className="p-10 text-center">
              <Search className="mx-auto text-[#93a6ab]" />
              <p className="mt-3 text-sm font-semibold">
                No grievances match these filters.
              </p>
              <p className="mt-1 text-xs text-[#6d7e89]">
                Try clearing the search or choosing a different status.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      <CasePanel c={selected} admin={admin} updateCase={updateCase} />
    </div>
  );
}
function CasePanel({ c, admin, updateCase }: any) {
  if (!c)
    return (
      <Card>
        <CardContent className="p-8 text-center text-sm text-[#687984]">
          Select a grievance to inspect its details.
        </CardContent>
      </Card>
    );
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold tracking-wide text-[#647582]">
              {c.id}
            </p>
            <CardTitle className="mt-1 leading-6">{c.title}</CardTitle>
          </div>
          <StatusBadge status={c.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-lg bg-[#f3f7f6] p-4">
          <p className="text-sm leading-6">{c.description}</p>
          <div className="mt-3 flex items-center gap-1 text-xs text-[#627481]">
            <MapPin size={14} />
            {c.location}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Info label="Department" value={c.department} />
          <Info label="Officer" value={c.officer} />
          <Info label="Priority" value={c.priority} />
          <Info label="Category" value={c.category} />
        </div>
        {admin ? (
          <div className="space-y-3 border-t pt-5">
            <p className="text-sm font-bold">Local management actions</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <select
                value={c.department}
                onChange={(e) =>
                  updateCase(
                    c.id,
                    { department: e.target.value },
                    `Assigned department changed to ${e.target.value}.`,
                  )
                }
                className="h-10 rounded-md border border-[#cbd5df] bg-white px-2 text-sm"
              >
                <option>Municipal Services</option>
                <option>Water Board</option>
                <option>Public Works</option>
                <option>Housing & Urban Affairs</option>
              </select>
              <select
                value={c.status}
                onChange={(e) =>
                  updateCase(
                    c.id,
                    { status: e.target.value as Status },
                    `Status changed to ${e.target.value}.`,
                  )
                }
                className="h-10 rounded-md border border-[#cbd5df] bg-white px-2 text-sm"
              >
                {(
                  [
                    "Submitted",
                    "In review",
                    "Assigned",
                    "In progress",
                    "Resolved",
                  ] as Status[]
                ).map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <Button
              className="w-full"
              variant="secondary"
              onClick={() =>
                updateCase(
                  c.id,
                  { officer: "N. Rao", status: "Assigned" },
                  "Assigned to N. Rao.",
                )
              }
            >
              <UserRound size={15} /> Assign to N. Rao
            </Button>
          </div>
        ) : (
          <div className="space-y-2 border-t pt-5">
            <p className="text-sm font-bold">Was the update helpful?</p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() =>
                  updateCase(c.id, {}, "Citizen feedback recorded: helpful.")
                }
              >
                Yes, helpful
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  updateCase(
                    c.id,
                    { status: "In review" },
                    "Citizen requested a local demo reopen.",
                  )
                }
              >
                <RotateCcw size={13} /> Reopen (demo)
              </Button>
            </div>
          </div>
        )}
        <div className="border-t pt-4">
          <p className="mb-3 text-sm font-bold">Recent activity</p>
          {c.updates
            .slice(-3)
            .reverse()
            .map((u: any) => (
              <div key={u.date + u.text} className="mb-3 flex gap-2 text-xs">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0f766e]" />
                <span>
                  <b className="font-medium">{u.date}</b>
                  <br />
                  {u.text}
                </span>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
