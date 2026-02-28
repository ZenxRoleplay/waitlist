import { useState, useRef, useEffect } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useInView,
} from 'framer-motion'

// ── Replace with your deployed Google Apps Script URL ──────────────────────
const WAITLIST_ENDPOINT = 'https://script.google.com/macros/s/AKfycbx56no0umLeuYjT2W5Q-zQMnAo5kfs-s-pscvzIFdsOOo9Q-6WshAg6XiMnMUJsdc2q/exec'
// ───────────────────────────────────────────────────────────────────────────

// ── Reusable fade-up variant ────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
}

// ─────────────────────────────────────────────────────────────────────────────
// Logo mark
// ─────────────────────────────────────────────────────────────────────────────
function HexLogo({ size = 28, color = '#7c3aed' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 26 26" fill="none">
      <polygon points="13,2 23,7.5 23,18.5 13,24 3,18.5 3,7.5"
        fill={color} opacity="0.13" />
      <polygon points="13,5 21,9.5 21,18 13,22 5,18 5,9.5"
        fill="none" stroke={color} strokeWidth="1.4" />
      <circle cx="13" cy="13" r="3.5" fill={color} />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Animated Blob
// ─────────────────────────────────────────────────────────────────────────────
function Blob({ className }) {
  return (
    <div
      className={`absolute rounded-full pointer-events-none will-change-transform ${className}`}
    />
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Count-up number
// ─────────────────────────────────────────────────────────────────────────────
function CountUp({ to, duration = 1.6 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const startTime = performance.now()
    const tick = (now) => {
      const t = Math.min((now - startTime) / (duration * 1000), 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setCount(Math.floor(eased * to))
      if (t < 1) requestAnimationFrame(tick)
      else setCount(to)
    }
    requestAnimationFrame(tick)
  }, [isInView, to, duration])

  return <span ref={ref}>{count}</span>
}

// ─────────────────────────────────────────────────────────────────────────────
// Section reveal wrapper
// ─────────────────────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-xl border-b border-white/60 shadow-sm shadow-violet-100/40'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HexLogo />
          <span className="font-bold text-gray-900 text-[1.07rem] tracking-tight">HiveOut</span>
        </div>
        <motion.a
          href="#waitlist"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-xl transition-colors shadow-md shadow-violet-300/30"
        >
          Join Waitlist
        </motion.a>
      </div>
    </motion.nav>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────────────────────────
function Hero() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const yParallax  = useTransform(scrollYProgress, [0, 1], [0, 80])
  const opParallax = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section
      ref={heroRef}
      className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden mesh-bg"
    >
      {/* ── Animated blobs ── */}
      <Blob className="blob-1 w-[520px] h-[520px] bg-violet-400/20 blur-[90px] top-[-120px] left-[-80px]" />
      <Blob className="blob-2 w-[400px] h-[400px] bg-indigo-400/15  blur-[80px] top-[10%]  right-[-60px]" />
      <Blob className="blob-3 w-[300px] h-[300px] bg-purple-300/18  blur-[70px] bottom-[5%] left-[30%]" />

      <motion.div
        style={{ y: yParallax, opacity: opParallax }}
        className="relative z-10 max-w-4xl mx-auto px-5 pt-28 pb-24 text-center"
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.88 }}
          animate={{ opacity: 1, y: 0,  scale: 1 }}
          transition={{ type: 'spring', stiffness: 280, damping: 18, delay: 0.05 }}
        >
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.06 }}
            className="inline-flex items-center gap-2 relative overflow-hidden bg-white/65 backdrop-blur-sm border border-violet-200/60 text-violet-700 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-10 tracking-wide uppercase shadow-sm cursor-default"
          >
            {/* shimmer sweep */}
            <span className="absolute inset-0 rounded-full pill-shimmer pointer-events-none" />
            <span className="relative w-1.5 h-1.5 rounded-full bg-violet-500 dot-glow" />
            <span className="relative">Launching Soon in Mumbai</span>
          </motion.div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="mb-4"
        >
          <motion.span
            variants={fadeUp}
            className="block text-[clamp(4rem,12vw,7rem)] font-black tracking-tighter text-gray-900 leading-none"
          >
            HiveOut
          </motion.span>
          <motion.span
            variants={fadeUp}
            className="block text-[clamp(1.5rem,5vw,3rem)] font-semibold text-violet-600 tracking-tight mt-2"
          >
            Where Mumbai Hives Out.
          </motion.span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          className="text-gray-500 text-[1.1rem] max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Discover college fests and city experiences —{' '}
          <span className="text-gray-700 font-medium">all in one place.</span>
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1,  y: 0  }}
          transition={{ delay: 0.45, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.a
            href="#waitlist"
            initial="rest"
            whileHover="hover"
            whileTap={{ scale: 0.97 }}
            variants={{
              rest:  { scale: 1,    boxShadow: '0 8px 24px rgba(124,58,237,0.22)' },
              hover: { scale: 1.05, boxShadow: '0 16px 40px rgba(124,58,237,0.32)' },
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="inline-flex items-center gap-2.5 bg-violet-600 text-white text-[0.95rem] font-semibold px-8 py-3.5 rounded-2xl shadow-lg shadow-violet-300/40"
          >
            Join the Waitlist
            <motion.svg
              xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              variants={{ rest: { x: 0 }, hover: { x: 5 } }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            >
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </motion.svg>
          </motion.a>

          <span className="text-sm text-gray-400 font-medium select-none">
            No spam. Just the launch.
          </span>
        </motion.div>

        {/* Social pill */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1,  y: 0  }}
          transition={{ delay: 0.65, duration: 0.5 }}
          className="mt-16 flex justify-center"
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: 0.8 } } }}
            className="glass-card rounded-2xl px-6 py-3 shadow-sm text-sm text-gray-500 flex items-center gap-3"
          >
            {[['🎓','College fests'], ['🌆','City events'], ['🐝','One hive']].map(([icon, label], i) => (
              <motion.span
                key={i}
                variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22,1,0.36,1] } } }}
                className="flex items-center gap-1.5"
              >
                {i > 0 && <span className="w-px h-4 bg-gray-200 mx-0.5" />}
                <span>{icon}</span> {label}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full border-2 border-gray-300 flex justify-center pt-1.5"
        >
          <div className="w-1 h-1.5 rounded-full bg-gray-400" />
        </motion.div>
      </motion.div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// FEATURE CARDS
// ─────────────────────────────────────────────────────────────────────────────
const features = [
  {
    emoji: '🎓',
    title: 'College Fests',
    desc:  'Entry passes, event registrations, and digital access — all under one roof for Mumbai\'s best college fests.',
    accent: 'violet',
  },
  {
    emoji: '🌆',
    title: 'City Events',
    desc:  'Discover curated pop-ups, gigs, and workshops happening across Mumbai every week.',
    accent: 'indigo',
  },
  {
    emoji: '�',
    title: 'Join the Hive',
    desc:  'One account. Multiple experiences across Mumbai.',
    accent: 'violet',
  },
]

const cardAccent = {
  violet: {
    bg:     'bg-violet-50/80',
    border: 'border-violet-100/80',
    icon:   'bg-violet-100',
    glow:   'rgba(139,92,246,0.18)',
  },
  indigo: {
    bg:     'bg-indigo-50/80',
    border: 'border-indigo-100/80',
    icon:   'bg-indigo-100',
    glow:   'rgba(99,102,241,0.18)',
  },
}

function FeatureCard({ card, index }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const a = cardAccent[card.accent]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.14, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        y: -6,
        boxShadow: `0 20px 48px ${a.glow}`,
        transition: { type: 'spring', stiffness: 260, damping: 18 },
      }}
      className={`glass-card ${a.bg} ${a.border} rounded-2xl p-7 cursor-default group`}
    >
      <motion.div
        className={`w-12 h-12 ${a.icon} rounded-xl flex items-center justify-center text-2xl mb-5`}
        whileHover={{ scale: 1.22, rotate: -8 }}
        transition={{ type: 'spring', stiffness: 380, damping: 14 }}
      >
        {card.emoji}
      </motion.div>
      <h4 className="text-lg font-bold text-gray-900 mb-2">{card.title}</h4>
      <p className="text-gray-500 text-sm leading-relaxed">{card.desc}</p>
    </motion.div>
  )
}

function Features() {
  return (
    <section className="py-28 px-5 bg-white relative overflow-hidden">
      <Blob className="blob-1 w-[400px] h-[400px] bg-violet-300/10 blur-[80px] top-0 right-[-80px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <Reveal className="text-center mb-14">
          <span className="text-xs font-semibold text-violet-600 uppercase tracking-widest">What is HiveOut</span>
          <h3 className="text-[clamp(1.75rem,4vw,2.6rem)] font-bold text-gray-900 mt-3 tracking-tight leading-tight">
            Everything Mumbai.<br className="sm:hidden" /> One hive.
          </h3>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((card, i) => (
            <FeatureCard key={card.title} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// HOW IT WORKS
// ─────────────────────────────────────────────────────────────────────────────
const steps = [
  { n: '1', title: 'Discover',       desc: 'Browse college fests and city events happening near you across Mumbai.' },
  { n: '2', title: 'Get Your Pass',  desc: 'Claim your digital entry pass or register for individual events — instantly.' },
  { n: '3', title: 'Show Up',        desc: 'Flash your QR at the door. No print, no hassle, no FOMO.' },
]

function StepItem({ step, index, total }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <div ref={ref} className="relative text-center">
      {/* Animated connector line */}
      {index < total - 1 && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ delay: index * 0.15 + 0.45, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="hidden md:block absolute h-px bg-gradient-to-r from-violet-300/70 to-transparent"
          style={{ originX: 0, left: 'calc(50% + 44px)', width: 'calc(100% - 88px)', top: '28px' }}
        />
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: index * 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.1, boxShadow: '0 12px 32px rgba(124,58,237,0.35)' }}
        className="w-14 h-14 bg-violet-600 rounded-2xl flex items-center justify-center text-white text-xl font-black mx-auto mb-5 shadow-lg shadow-violet-300/40 cursor-default"
      >
        {step.n}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: index * 0.15 + 0.1, duration: 0.5 }}
      >
        <h4 className="text-base font-bold text-gray-900 mb-2">{step.title}</h4>
        <p className="text-sm text-gray-500 leading-relaxed max-w-[240px] mx-auto">{step.desc}</p>
      </motion.div>
    </div>
  )
}

function Steps() {
  return (
    <section className="py-28 px-5 mesh-bg relative overflow-hidden">
      <Blob className="blob-2 w-[380px] h-[380px] bg-indigo-300/12 blur-[80px] bottom-0 left-[-60px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <Reveal className="text-center mb-16">
          <span className="text-xs font-semibold text-violet-600 uppercase tracking-widest">How It Works</span>
          <h3 className="text-[clamp(1.75rem,4vw,2.6rem)] font-bold text-gray-900 mt-3 tracking-tight">
            Three steps to the hive.
          </h3>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
          {steps.map((step, i) => (
            <StepItem key={step.n} step={step} index={i} total={steps.length} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// WAITLIST
// ─────────────────────────────────────────────────────────────────────────────
function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
}

function Waitlist() {
  const [email,   setEmail]   = useState('')
  const [error,   setError]   = useState('')
  const [status,  setStatus]  = useState('idle') // idle | loading | success | error

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.')
      return
    }

    setStatus('loading')

    const payload = {
      email: email.trim(),
      source: 'hiveout.in',
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }).replace(',', ''),
    }

    try {
      await fetch(WAITLIST_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
        body: JSON.stringify(payload),
      })
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="waitlist" className="py-28 px-5 bg-white relative overflow-hidden">
      <Blob className="blob-3 w-[350px] h-[350px] bg-violet-400/12 blur-[80px] top-0 left-[10%] pointer-events-none" />
      <Blob className="blob-1 w-[280px] h-[280px] bg-indigo-300/10  blur-[70px] bottom-0 right-[5%] pointer-events-none" />

      <div className="max-w-lg mx-auto relative z-10 text-center">
        <Reveal>
          <span className="text-xs font-semibold text-violet-600 uppercase tracking-widest">Early Access</span>
          <h3 className="text-[clamp(1.75rem,4vw,2.6rem)] font-bold text-gray-900 mt-3 mb-3 tracking-tight">
            Join the Hive.
          </h3>
          <p className="text-gray-500 text-base mb-10">
            Be the first to know when HiveOut goes live in Mumbai.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="glass-card bg-white/80 border-white/70 rounded-3xl p-8 shadow-2xl shadow-violet-100/40">
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col items-center gap-3 py-2"
                >
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 240, damping: 14 }}
                    className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-3xl"
                  >
                    ✅
                  </motion.div>
                  <p className="font-bold text-gray-900 text-lg">You're on the list.</p>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    We'll notify you as soon as HiveOut launches in Mumbai.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  noValidate
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="mb-4">
                    <input
                      type="email"
                      value={email}
                      onChange={e => {
                        setEmail(e.target.value)
                        if (error && isValidEmail(e.target.value)) setError('')
                        if (status === 'error') setStatus('idle')
                      }}
                      placeholder="you@example.com"
                      autoComplete="email"
                      disabled={status === 'loading'}
                      className={`input-glow w-full bg-gray-50 border rounded-xl px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 disabled:opacity-60 ${
                        error ? 'border-red-400' : 'border-gray-200'
                      }`}
                    />
                    <AnimatePresence>
                      {error && (
                        <motion.p
                          key="err"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-red-500 text-xs mt-2 text-left overflow-hidden"
                        >
                          {error}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <AnimatePresence>
                    {status === 'error' && (
                      <motion.div
                        key="net-err"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-4 text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 text-left overflow-hidden"
                      >
                        Something went wrong. Please try again.
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    type="submit"
                    disabled={status === 'loading'}
                    whileHover={status !== 'loading' ? { scale: 1.03 } : {}}
                    whileTap={status  !== 'loading' ? { scale: 0.97 } : {}}
                    className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2 shadow-md shadow-violet-300/30"
                  >
                    {status === 'loading' ? (
                      <>
                        <span className="spinner" />
                        Joining…
                      </>
                    ) : 'Join Hive'}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          <p className="text-xs text-gray-400 mt-6">
            <CountUp to={500} />+ students from colleges across Mumbai already on the waitlist.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────────────────────
function Footer() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.footer
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="border-t border-gray-100 py-10 px-5 bg-white"
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <HexLogo size={20} />
          <span className="text-sm font-semibold text-gray-700">HiveOut</span>
          <span className="text-gray-300 text-sm">—</span>
          <span className="text-xs text-gray-400">Made in Mumbai · © 2026</span>
        </div>
        <nav className="flex items-center gap-5">
          <a href="/privacy.html"
            className="nav-link text-xs text-gray-400 hover:text-gray-600 transition-colors">
            Privacy
          </a>
          <a href="https://instagram.com/hiveout.in"
            target="_blank" rel="noopener noreferrer"
            className="nav-link text-xs text-gray-400 hover:text-violet-600 transition-colors flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
            </svg>
            Instagram
          </a>
        </nav>
      </div>
    </motion.footer>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Steps />
        <Waitlist />
      </main>
      <Footer />
    </>
  )
}
