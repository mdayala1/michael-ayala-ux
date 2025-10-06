import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Mail,
  FileText,
  Github,
  Linkedin,
  Moon,
  Sun,
  Settings,
  Save,
  Upload,
  Download,
  ShieldQuestion,
  Undo2,
} from "lucide-react";

// ---- Default content (used on first load or after reset) ----
const DEFAULT_CONTENT = {
  nav: [
    { label: "Work", href: "#work" },
    { label: "About", href: "#about" },
    { label: "Writing", href: "#writing" },
    { label: "Resume", href: "#resume" },
    { label: "Contact", href: "#contact" },
  ],
  hero: {
    headline: "I design clear, trustworthy experiences for complex systems.",
    sub: `I blend research, prototyping, and content strategy to reduce friction and help people feel heard—
from healthcare intake to smart‑home entertainment.`,
  },
  caseStudies: [
    {
      title: "Clinic Intake Redesign",
      tags: ["Research", "UX Writing", "Design System"],
      summary:
        "Reduced check‑in time by 34% through journey mapping, prototyping, and moderated tests with 12 patients.",
      link: "#",
    },
    {
      title: "Smart Home Hub – Entertainment UI",
      tags: ["IoT", "Voice", "Prototyping"],
      summary:
        "Built a preferences‑driven TV interface (Raspberry Pi) with parental controls and profiles.",
      link: "#",
    },
    {
      title: "Menu Board for Local Restaurant",
      tags: ["Service Design", "Accessibility"],
      summary:
        "Improved readability (WCAG AA) and +18% upsell via hierarchical layout and A/B tested labels.",
      link: "#",
    },
  ],
  writing: [
    { title: "Measuring Trust in Healthcare UX", date: "2025", link: "#" },
    { title: "Rapid Case Study Format for Students", date: "2025", link: "#" },
    { title: "Voice UI Heuristics at Home", date: "2024", link: "#" },
  ],
  about: {
    body:
      "I’m a UX designer focused on healthcare, home security, and automotive displays. I enjoy simplifying complex flows, facilitating workshops, and translating research into design systems that scale.",
    bullets: [
      "Heuristic reviews & usability testing",
      "Journey maps, service blueprints",
      "Information architecture & content strategy",
      "Prototyping (Figma) & design systems",
      "Basic analytics and A/B testing",
    ],
    quickFacts: [
      "🎓 BS GIT (UX), ASU — in progress",
      "🛠 Tools: Figma, Notion, Jira/Trello (school), Miro",
      "💬 Mentors peers in math/science; volunteers locally",
      "📍 Oklahoma • Remote‑friendly",
    ],
  },
  resume: {
    core: ["Research & Testing", "IA & Interaction Design", "Prototyping & Handoff"],
    domains: ["Healthcare", "Smart Home / IoT", "Small Biz / Service"],
    tools: ["Figma, FigJam, Miro", "Notion, Google Suite", "Basic HTML/CSS/JS"],
  },
  contact: { email: "hello@michael-ayala.com", linkedin: "#", github: "#" },
};

// ---- Helpers ----
const STORAGE_KEY = "portfolioData@v1";
function loadContent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_CONTENT, ...JSON.parse(raw) } : DEFAULT_CONTENT;
  } catch {
    return DEFAULT_CONTENT;
  }
}

function download(filename, text) {
  const el = document.createElement("a");
  el.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  el.setAttribute("download", filename);
  document.body.appendChild(el);
  el.click();
  el.remove();
}

export default function PortfolioSite() {
  const [dark, setDark] = useState(true);
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [admin, setAdmin] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [jsonDraft, setJsonDraft] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setContent(loadContent());
  }, []);

  // --- Admin actions ---
  const enterAdmin = () => {
    const answer = prompt(
      "Enter edit key (tip: start with 'edit' now, wire real auth later)",
      ""
    );
    if (answer === "edit") {
      setAdmin(true);
      setPanelOpen(true);
      setJsonDraft(JSON.stringify(content, null, 2));
      setError("");
    } else if (answer != null) {
      alert("Incorrect key");
    }
  };

  const openPanel = () => {
    setPanelOpen(true);
    setJsonDraft(JSON.stringify(content, null, 2));
    setError("");
  };

  const saveDraft = () => {
    try {
      const parsed = JSON.parse(jsonDraft);
      setContent(parsed);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      setError("");
      alert("Saved to localStorage ✓");
    } catch (e) {
      setError(String(e));
    }
  };

  const resetAll = () => {
    if (confirm("Reset to defaults? This clears localStorage.")) {
      localStorage.removeItem(STORAGE_KEY);
      setContent(DEFAULT_CONTENT);
      setJsonDraft(JSON.stringify(DEFAULT_CONTENT, null, 2));
    }
  };

  const importJsonFile = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const text = String(reader.result);
        setJsonDraft(text);
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const exportJson = () => {
    download("portfolio-content.json", JSON.stringify(content, null, 2));
  };

  const NAV = content.nav;
  const CASE_STUDIES = content.caseStudies;
  const WRITING = content.writing;

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 transition-colors">
        {/* Admin bar */}
        <div className="sticky top-0 z-50">
          <div className="mx-auto max-w-6xl px-4 pt-3 flex items-center justify-end gap-2 text-xs">
            {!admin ? (
              <button
                onClick={enterAdmin}
                className="inline-flex items-center gap-1 rounded-xl border border-zinc-300 dark:border-zinc-700 px-3 py-1 hover:shadow"
                title="Enter edit mode"
              >
                <Settings size={14} /> Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setPanelOpen((v) => !v)}
                  className="inline-flex items-center gap-1 rounded-xl border border-zinc-300 dark:border-zinc-700 px-3 py-1 hover:shadow"
                >
                  <Settings size={14} /> {panelOpen ? "Close Panel" : "Open Panel"}
                </button>
                <button
                  onClick={saveDraft}
                  className="inline-flex items-center gap-1 rounded-xl border border-zinc-300 dark:border-zinc-700 px-3 py-1 hover:shadow"
                >
                  <Save size={14} /> Save
                </button>
                <button
                  onClick={importJsonFile}
                  className="inline-flex items-center gap-1 rounded-xl border border-zinc-300 dark:border-zinc-700 px-3 py-1 hover:shadow"
                >
                  <Upload size={14} /> Import JSON
                </button>
                <button
                  onClick={exportJson}
                  className="inline-flex items-center gap-1 rounded-xl border border-zinc-300 dark:border-zinc-700 px-3 py-1 hover:shadow"
                >
                  <Download size={14} /> Export JSON
                </button>
                <button
                  onClick={resetAll}
                  className="inline-flex items-center gap-1 rounded-xl border border-rose-300 dark:border-rose-700 px-3 py-1 hover:shadow text-rose-600 dark:text-rose-300"
                >
                  <Undo2 size={14} /> Reset
                </button>
              </div>
            )}
          </div>

          {/* Top header */}
          <header className="mt-2 sticky top-6 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-zinc-900/60 border-y border-zinc-200 dark:border-zinc-800">
            <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
              <a href="#home" className="font-semibold tracking-tight text-lg">
                Michael Ayala <span className="opacity-60">— UX Designer</span>
              </a>
              <nav className="hidden md:flex gap-6 text-sm">
                {NAV.map((n) => (
                  <a key={n.label} href={n.href} className="hover:opacity-80">
                    {n.label}
                  </a>
                ))}
              </nav>
              <div className="flex items-center gap-2">
                <a
                  href="#contact"
                  className="hidden sm:inline-flex items-center gap-2 rounded-2xl border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 text-sm hover:shadow"
                >
                  <Mail size={16} /> Contact
                </a>
                <button
                  onClick={() => setDark((d) => !d)}
                  className="inline-flex items-center rounded-2xl border border-zinc-300 dark:border-zinc-700 p-2 hover:shadow"
                  aria-label="Toggle theme"
                  title="Toggle theme"
                >
                  {dark ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              </div>
            </div>
          </header>
        </div>

        {/* Slide-over Admin Panel */}
        {admin && panelOpen && (
          <aside className="fixed right-0 top-0 h-full w-[min(560px,100%)] bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 p-4 md:p-6 z-[60] overflow-auto">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Settings size={18} /> Content editor
              </h3>
              <button
                onClick={() => setPanelOpen(false)}
                className="rounded-xl border border-zinc-300 dark:border-zinc-700 px-3 py-1 text-sm"
              >
                Close
              </button>
            </div>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
              Edit the JSON below to update nav, hero, case studies, writing, about, resume, and contact. Changes are
              saved to your browser (localStorage). Later we can wire GitHub, Notion, or a headless CMS for real auth.
            </p>
            <div className="mt-3 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              <textarea
                className="w-full h-[60vh] p-3 font-mono text-sm bg-transparent outline-none"
                value={jsonDraft}
                onChange={(e) => setJsonDraft(e.target.value)}
                spellCheck={false}
              />
            </div>
            {error && (
              <div className="mt-2 text-sm text-rose-500 flex items-center gap-2">
                <ShieldQuestion size={16} /> {error}
              </div>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              <button onClick={saveDraft} className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 text-sm">
                <Save size={16} /> Save
              </button>
              <button onClick={importJsonFile} className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 text-sm">
                <Upload size={16} /> Import JSON
              </button>
              <button onClick={exportJson} className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 text-sm">
                <Download size={16} /> Export JSON
              </button>
              <button onClick={resetAll} className="inline-flex items-center gap-2 rounded-xl border border-rose-300 dark:border-rose-700 px-3 py-1.5 text-sm text-rose-600 dark:text-rose-300">
                <Undo2 size={16} /> Reset to defaults
              </button>
            </div>
          </aside>
        )}

        {/* Hero */}
        <section id="home" className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl md:text-5xl font-bold leading-tight"
              >
                {content.hero.headline}
              </motion.h1>
              <p className="mt-5 text-lg text-zinc-600 dark:text-zinc-300 whitespace-pre-line">
                {content.hero.sub}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#work"
                  className="inline-flex items-center gap-2 rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-4 py-2 text-sm"
                >
                  View work <ArrowUpRight size={16} />
                </a>
                <a
                  href="#resume"
                  className="inline-flex items-center gap-2 rounded-2xl border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-sm"
                >
                  <FileText size={16} /> Resume
                </a>
              </div>
              <div className="mt-6 flex gap-4 text-sm opacity-80">
                <a href={content.contact.github || "#"} className="inline-flex items-center gap-2">
                  <Github size={16} />GitHub
                </a>
                <a href={content.contact.linkedin || "#"} className="inline-flex items-center gap-2">
                  <Linkedin size={16} />LinkedIn
                </a>
              </div>
            </div>
            <div>
              <div className="aspect-[4/3] rounded-2xl border border-zinc-200 dark:border-zinc-800 p-2">
                <div className="h-full w-full rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800 grid place-items-center text-center p-6">
                  <p className="max-w-sm text-zinc-600 dark:text-zinc-300">
                    Drop a hero image or looping prototype here. Until then, this card keeps layout tidy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Work */}
        <section id="work" className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-2xl md:text-3xl font-semibold">Selected work</h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-300">
            Three concise case studies. Each links to a long form write‑up.
          </p>

          <div className="mt-8 grid md:grid-cols-3 gap-6">
            {CASE_STUDIES.map((c, i) => (
              <a key={c.title + i} href={c.link} className="group">
                <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-[4/3] bg-zinc-100 dark:bg-zinc-900" />
                  <div className="p-4">
                    <h3 className="font-semibold flex items-center justify-between">
                      {c.title}{" "}
                      <ArrowUpRight
                        className="opacity-50 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                        size={16}
                      />
                    </h3>
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{c.summary}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {c.tags?.map((t) => (
                        <span
                          key={t}
                          className="text-xs rounded-full border border-zinc-300 dark:border-zinc-700 px-2 py-0.5"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* About */}
        <section id="about" className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-2xl md:text-3xl font-semibold">About</h2>
          <div className="mt-4 grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <p className="leading-7 text-zinc-700 dark:text-zinc-300">{content.about.body}</p>
              <ul className="mt-4 grid sm:grid-cols-2 gap-2 text-sm">
                {content.about.bullets.map((b) => (
                  <li key={b}>• {b}</li>
                ))}
              </ul>
            </div>
            <aside className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4">
              <h3 className="font-medium">Quick facts</h3>
              <ul className="mt-3 space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
                {content.about.quickFacts.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ul>
            </aside>
          </div>
        </section>

        {/* Writing */}
        <section id="writing" className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-2xl md:text-3xl font-semibold">Writing</h2>
          <div className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-800 border rounded-2xl overflow-hidden">
            {WRITING.map((w, i) => (
              <a key={w.title + i} href={w.link} className="flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900">
                <span>{w.title}</span>
                <span className="text-sm opacity-60">{w.date}</span>
              </a>
            ))}
          </div>
        </section>

        {/* Resume (embed later) */}
        <section id="resume" className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-2xl md:text-3xl font-semibold">Resume</h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-300">
            Link a PDF or Notion page. Keep a short skills snapshot here and move details into the PDF.
          </p>
          <div className="mt-4 grid sm:grid-cols-3 gap-4 text-sm">
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4">
              <h3 className="font-medium">Core skills</h3>
              <ul className="mt-2 space-y-1">
                {content.resume.core.map((s) => (
                  <li key={s}>• {s}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4">
              <h3 className="font-medium">Domains</h3>
              <ul className="mt-2 space-y-1">
                {content.resume.domains.map((s) => (
                  <li key={s}>• {s}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4">
              <h3 className="font-medium">Tooling</h3>
              <ul className="mt-2 space-y-1">
                {content.resume.tools.map((s) => (
                  <li key={s}>• {s}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="mx-auto max-w-6xl px-4 py-16">
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 md:p-10">
            <h2 className="text-2xl md:text-3xl font-semibold">Let’s talk</h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-300 max-w-2xl">
              I’m open to internships, junior roles, and freelance projects. If you’re improving care, safety, or
              everyday life, I’d love to help.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={`mailto:${content.contact.email}`}
                className="inline-flex items-center gap-2 rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-4 py-2 text-sm"
              >
                <Mail size={16} /> {content.contact.email}
              </a>
              <a
                href={content.contact.linkedin || "#"}
                className="inline-flex items-center gap-2 rounded-2xl border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-sm"
              >
                <Linkedin size={16} /> LinkedIn
              </a>
            </div>
          </div>
          <footer className="py-10 text-center text-sm opacity-70">
            © {new Date().getFullYear()} Michael Ayala. Built with React & Tailwind.
          </footer>
        </section>
      </div>
    </div>
  );
}
