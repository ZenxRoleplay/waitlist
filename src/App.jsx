import { useState, useEffect, useRef } from "react";

const WAITLIST_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbwKHSf_4O0eHgtLDku-nw72wxcYcex3jfOgqPJRuPvqaXIBFu63bRicsZxplBEokvld/exec";

const LAUNCH = new Date("2026-06-02T00:00:00+05:30");

const CHIPS = [
  { icon: "???", label: "College Fests" },
  { icon: "??", label: "Live Concerts" },
  { icon: "?", label: "Hackathons" },
  { icon: "??", label: "Sports Meets" },
  { icon: "??", label: "Cultural Nights" },
  { icon: "??", label: "Tech Summits" },
];

function pad(n) { return String(n).padStart(2, "0"); }

function useCountdown() {
  const [t, setT] = useState({ dd: "00", hh: "00", mm: "00", ss: "00" });
  useEffect(() => {
    function tick() {
      const diff = LAUNCH - Date.now();
      if (diff <= 0) { setT({ dd: "00", hh: "00", mm: "00", ss: "00" }); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setT({ dd: pad(d), hh: pad(h), mm: pad(m), ss: pad(s) });
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

function Toast({ msg }) {
  return <div className={`toast${msg ? " show" : ""}`}>{msg}</div>;
}

export default function App() {
  const { dd, hh, mm, ss } = useCountdown();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | duplicate | error
  const [msg, setMsg] = useState("");
  const [toast, setToast] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    const h = new Date().getHours();
    document.body.dataset.theme = h < 6 || h >= 18 ? "dark" : "light";
  }, []);

  function showToast(text) {
    setToast(text);
    setTimeout(() => setToast(""), 3000);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus("error"); setMsg("Please enter a valid email."); return;
    }
    setStatus("loading"); setMsg("");
    const ts = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", hour12: false }).replace(",", "");
    try {
      const res = await fetch(WAITLIST_ENDPOINT, {
        method: "POST", mode: "cors",
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: JSON.stringify({ email: trimmed, timestamp: ts }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.status === "duplicate") {
        setStatus("duplicate"); setMsg("You're already on the list! We'll reach out soon. ??");
      } else {
        setStatus("success"); setMsg("");
        setEmail("");
        showToast("You're on the list! ?? See you at launch.");
      }
    } catch {
      setStatus("error"); setMsg("Something went wrong. Please try again.");
    }
  }

  const tiles = [
    { n: dd, l: "Days",    o: true },
    { n: hh, l: "Hours",   o: false },
    { n: mm, l: "Minutes", o: false },
    { n: ss, l: "Seconds", o: false },
  ];

  return (
    <>
      <div className="blobs" aria-hidden="true">
        <div className="blob blob-a" />
        <div className="blob blob-b" />
        <div className="blob blob-c" />
      </div>

      <div className="page">
        <nav className="nav">
          <span className="logo-wordmark">hiveout</span>
          <div className="badge">Coming Soon</div>
        </nav>

        <main>
          <section className="hero">
            <div className="eyebrow">hiveout.in</div>

            <h1 className="h1">
              <span className="gw">Every Event.</span>
              <br />
              One&nbsp;Platform.
            </h1>

            <p className="sub">
              Discover college fests, live concerts, hackathons, and more —
              all in one place. Early access is limited.
            </p>

            <div className="countdown" role="timer" aria-label="Countdown to launch">
              {tiles.map(({ n, l, o }) => (
                <div className="cb" key={l}>
                  <span className={`cn${o ? " o" : ""}`}>{n}</span>
                  <span className="cl">{l}</span>
                </div>
              ))}
            </div>

            <p className="launch-date">
              Launching <strong>2nd June 2026 ??</strong>
            </p>

            <div className="form-wrap">
              <form className="form" onSubmit={handleSubmit} noValidate>
                <input
                  ref={inputRef}
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setStatus("idle"); setMsg(""); }}
                  disabled={status === "loading" || status === "success"}
                  aria-label="Email address"
                  autoComplete="email"
                />
                <button className="btn" type="submit" disabled={status === "loading" || status === "success"}>
                  {status === "loading"
                    ? <><span className="spinner" /> Joining…</>
                    : status === "success"
                      ? "? You're in!"
                      : "Get Early Access ?"}
                </button>
              </form>
              {msg && (
                <p className={`feedback ${status === "duplicate" ? "duplicate" : status === "error" ? "error" : "success"}`}>
                  {msg}
                </p>
              )}
              <p className="fnote">No spam. Unsubscribe anytime.</p>
            </div>

            <div className="chips" role="list" aria-label="Event categories">
              {CHIPS.map(({ icon, label }) => (
                <span className="chip" key={label} role="listitem">{icon} {label}</span>
              ))}
            </div>

            <div className="rule" />
          </section>
        </main>

        <footer>
          <span>© 2026 HiveOut. Built with ?? in India.</span>
          <a href="mailto:hello@hiveout.in">hello@hiveout.in</a>
        </footer>
      </div>

      <Toast msg={toast} />
    </>
  );
}
