import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { FaGithub, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6'
import { LuArrowLeft, LuArrowRight, LuArrowUpRight, LuBot, LuCodeXml, LuMail, LuMenu, LuPanelsTopLeft, LuPhone, LuServer, LuSparkles, LuX } from 'react-icons/lu'
import './styles.css'

const github = 'https://github.com/rajat-blr'
const project = `${github}/agent-workbench`
const screenshots = [
  { src: '/images/Screenshot 2026-09-20 at 1.02.42 PM.png', label: 'Workspace & agent runs', alt: 'Agent Workbench workspace showing a Codex conversation and session controls' },
  { src: '/images/Screenshot 2026-09-20 at 1.02.55 PM.png', label: 'Interactive codebase map', alt: 'Agent Workbench codebase map showing components and their relationships' },
  { src: '/images/Screenshot 2026-09-20 at 1.03.03 PM.png', label: 'Per-run change review', alt: 'Agent Workbench change review showing a readable code diff' },
]

function Arrow({ diagonal = false }) {
  return <span className="arrow" aria-hidden="true">{diagonal ? <LuArrowUpRight /> : <LuArrowRight />}</span>
}

function Wordmark() {
  return <span className="wordmark">RAJAT <span>VARMA<span className="wordmark-dot">.</span></span></span>
}

function ProjectVisual() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setInterval(() => setActive((index) => (index + 1) % screenshots.length), 6500)
    return () => window.clearInterval(timer)
  }, [paused])

  const showPrevious = () => setActive((index) => (index - 1 + screenshots.length) % screenshots.length)
  const showNext = () => setActive((index) => (index + 1) % screenshots.length)

  return (
    <div
      className="project-visual"
      role="region"
      aria-roledescription="carousel"
      aria-label="Agent Workbench screenshots"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false) }}
    >
      <div className="visual-glow" />
      <a className="screenshot-stage" href={screenshots[active].src} target="_blank" rel="noreferrer" aria-label={`Open ${screenshots[active].label} image in a new tab`}>
        <img
          className="project-screenshot"
          src={screenshots[active].src}
          alt={screenshots[active].alt}
          loading="lazy"
        />
      </a>
      <button className="slide-arrow slide-previous" type="button" onClick={showPrevious} aria-label="Previous screenshot"><LuArrowLeft /></button>
      <button className="slide-arrow slide-next" type="button" onClick={showNext} aria-label="Next screenshot"><LuArrowRight /></button>
      <div className="slideshow-footer">
        <div className="slide-caption" aria-live="polite"><span className="caption-dot" /> <span>{screenshots[active].label}</span></div>
        <div className="slide-dots" aria-label="Choose screenshot">
          {screenshots.map((screenshot, index) => <button key={screenshot.src} className={index === active ? 'active' : ''} type="button" aria-label={`Show ${screenshot.label}`} aria-current={index === active ? 'true' : undefined} onClick={() => setActive(index)} />)}
        </div>
        <span className="slide-count">0{active + 1} / 0{screenshots.length}</span>
      </div>
    </div>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Rajat Varma, home" onClick={closeMenu}><Wordmark /></a>
        <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <LuX /> : <LuMenu />}</button>
        <nav className={menuOpen ? 'nav-links open' : 'nav-links'} aria-label="Main navigation">
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#experience" onClick={closeMenu}>Experience</a>
          <a href="#expertise" onClick={closeMenu}>Expertise</a>
          <a href="#work" onClick={closeMenu}>Work</a>
          <a className="nav-contact" href="#contact" onClick={closeMenu}>Let's connect <Arrow diagonal /></a>
        </nav>
      </header>

      <main id="top">
        <section className="hero section-shell" aria-labelledby="hero-heading">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> SENIOR SOFTWARE ENGINEER · 5 YEARS EXPERIENCE</div>
            <h1 id="hero-heading">Building the<br /><em>next layer</em> of<br />software<span className="period">.</span></h1>
            <p className="hero-description">I'm Rajat, I build reliable AI systems, with a focus on LLMOps and observability for AI agents with full-stack engineering skills in React, Java Spring Boot, and Go.</p>
            <div className="hero-actions">
              <a className="button button-dark" href="#work">Explore my work <Arrow diagonal /></a>
              <a className="text-link" href="#about">More about me <Arrow /></a>
            </div>
          </div>
          <div className="hero-art" role="img" aria-label="Portrait of Rajat Varma surrounded by full-stack engineering and agentic AI motifs">
            <div className="hero-orbit orbit-outer" aria-hidden="true" /><div className="hero-orbit orbit-inner" aria-hidden="true" />
            <div className="orbit-label label-top" aria-hidden="true">01 / ENGINEER</div>
            <div className="orbit-label label-right" aria-hidden="true">BUILD • SHIP • ITERATE</div>
            <div className="hero-core portrait-core"><img src="/images/ppf.png" alt="" fetchPriority="high" /></div>
            <div className="floating-card card-code" aria-hidden="true"><span className="floating-icon"><LuCodeXml /></span><span>FULL-STACK<br /><b>ENGINEERING</b></span></div>
            <div className="floating-card card-ai" aria-hidden="true"><span className="floating-icon"><LuSparkles /></span><span>AGENTIC AI<br /><b>& LLMOPS</b></span></div>
            <span className="orbit-spark spark-one" aria-hidden="true">✳</span><span className="orbit-spark spark-two" aria-hidden="true">✦</span>
          </div>
          <div className="hero-footer"><span>BASED IN INDIA · BUILDING FOR EVERYWHERE</span><span>SCROLL TO EXPLORE ↓</span></div>
        </section>

        <section id="about" className="intro section-shell">
          <div className="section-kicker"><span className="kicker-number">01</span><span>ABOUT ME</span></div>
          <div className="intro-content"><h2>I work where <span>solid engineering</span> meets new possibilities.</h2><div><p>For five years, I’ve built software across the stack, from responsive React interfaces to reliable services in Java, Spring Boot, and Go.</p><p>Today, I’m especially focused on agentic AI: building useful agent experiences and the LLMOps and observability foundations that make them easier to understand, operate, and improve.</p><a className="underlined-link" href={github} target="_blank" rel="noreferrer">Find me on GitHub <Arrow diagonal /></a></div></div>
        </section>

        <section id="experience" className="experience section-shell" aria-labelledby="experience-heading">
          <div className="section-kicker"><span className="kicker-number">02</span><span>EXPERIENCE</span></div>
          <div className="experience-layout">
            <div className="experience-intro"><h2 id="experience-heading">Where I’ve<br /><em>built & grown.</em></h2><p>Five years of engineering experience across product interfaces, backend services, and the systems behind them.</p></div>
            <div className="experience-timeline">
              <article className="experience-item"><span className="experience-node" /><div className="experience-topline"><span>CURRENT</span><span>01 / 02</span></div><h3>Microsoft<span className="period">.</span></h3><p className="experience-role">Senior Software Engineer</p><p className="experience-note"> Leading the design and delivery of high performance backend systems that improve the performance and efficiency of AI agents.</p></article>
              <article className="experience-item"><span className="experience-node" /><div className="experience-topline"><span>PREVIOUS</span><span>02 / 02</span></div><h3>Flipkart<span className="period">.</span></h3><p className="experience-role">SDE 2</p><p className="experience-note"> Improved performance during Big Billion Days, built a RAG pipeline for data observability, and optimized a payments microservice serving millions.</p></article>
            </div>
          </div>
        </section>

        <section id="expertise" className="expertise section-shell">
          <div className="section-kicker"><span className="kicker-number">03</span><span>WHAT I DO</span></div>
          <div className="section-heading-row"><h2>My toolkit<span className="period">.</span></h2><p>From product interfaces to the systems and intelligence behind them.</p></div>
          <div className="expertise-grid">
            <article className="expertise-card"><span className="card-index">01 / INTERFACE</span><span className="skill-symbol"><LuPanelsTopLeft /></span><h3>Frontend<br />engineering</h3><p>Thoughtful, responsive interfaces with React that make complex workflows feel clear.</p><div className="skill-tags"><span>React</span><span>UI architecture</span><span>Product UX</span></div></article>
            <article className="expertise-card"><span className="card-index">02 / SYSTEMS</span><span className="skill-symbol"><LuServer /></span><h3>Backend<br />systems</h3><p>Services and APIs designed for maintainability, reliability, and real-world scale.</p><div className="skill-tags"><span>Java</span><span>Spring Boot</span><span>Go</span></div></article>
            <article className="expertise-card expertise-card-accent"><span className="card-index">03 / INTELLIGENCE</span><span className="skill-symbol"><LuBot /></span><h3>Agentic AI<br />& operations</h3><p>Agent experiences backed by practical LLMOps and observability, so behavior stays visible.</p><div className="skill-tags"><span>AI agents</span><span>LLMOps</span><span>Observability</span></div></article>
          </div>
        </section>

        <section id="work" className="work section-shell">
          <div className="section-kicker"><span className="kicker-number">04</span><span>SELECTED WORK</span></div>
          <div className="section-heading-row"><h2>Featured project<span className="period">.</span></h2><p>A closer look at something I’ve built.</p></div>
          <article className="project-card">
            <ProjectVisual />
            <div className="project-copy"><div className="project-meta"><span>FEATURED PROJECT</span><span>2026</span></div><h3>Agent<br />Workbench<span>.</span></h3><p className="project-lead">A local-first desktop workspace for working with Codex inside your own codebase.</p><p>Open a project, keep conversations organized, explore an interactive codebase map, and review each run’s changes in one place. Built with an Electron and React interface, a local FastAPI backend, and SQLite persistence.</p><div className="project-tags"><span>Electron</span><span>React</span><span>FastAPI</span><span>SQLite</span><span>Codex CLI</span></div><a className="button button-lime" href={project} target="_blank" rel="noreferrer">View on GitHub <Arrow diagonal /></a></div>
          </article>
        </section>

        <section className="principles section-shell" aria-labelledby="principles-heading"><div className="section-kicker"><span className="kicker-number">05</span><span>HOW I THINK</span></div><div className="principles-layout"><h2 id="principles-heading">Curious by nature.<br /><em>Practical</em> by design.</h2><div className="principles-list"><div><span>01</span><p>Start with the problem, then find the simplest useful solution.</p></div><div><span>02</span><p>Build for clarity, from the interface to the underlying architecture.</p></div><div><span>03</span><p>Make systems observable so they can be trusted and improved.</p></div></div></div></section>

        <section id="contact" className="contact section-shell" aria-labelledby="contact-heading">
          <div className="section-kicker"><span className="kicker-number">06</span><span>LET'S CONNECT</span></div>
          <div className="contact-panel">
            <div className="contact-intro">
              <span className="contact-availability"><span /> OPEN TO CONVERSATION</span>
              <h2 id="contact-heading">Have an idea?<br /><em>Let’s talk.</em></h2>
              <p>I’m always interested in thoughtful products, hard engineering problems, and what AI can make possible.</p>
              <div className="contact-decoration" aria-hidden="true"><LuSparkles /></div>
            </div>
            <div className="contact-info">
              <p className="contact-label">DIRECT DETAILS</p>
              <div className="contact-detail"><span className="contact-icon"><LuMail /></span><div><span className="detail-label">EMAIL</span><span className="detail-value">vrajatlink@gmail.com</span></div></div>
              <div className="contact-detail"><span className="contact-icon"><LuPhone /></span><div><span className="detail-label">PHONE</span><span className="detail-value">+91-7507975485</span></div></div>
              <p className="contact-label social-label">FIND ME ONLINE</p>
              <div className="contact-socials">
                <a href={github} target="_blank" rel="noreferrer" aria-label="GitHub profile"><FaGithub /><span>GitHub</span><LuArrowUpRight className="social-arrow" /></a>
                <a href="https://x.com/rajat_2709" target="_blank" rel="noreferrer" aria-label="X profile"><FaXTwitter /><span>X / Twitter</span><LuArrowUpRight className="social-arrow" /></a>
                <a href="https://www.linkedin.com/in/rajat-v-2bbb693b1/" target="_blank" rel="noreferrer" aria-label="LinkedIn profile"><FaLinkedinIn /><span>LinkedIn</span><LuArrowUpRight className="social-arrow" /></a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer section-shell"><a href="#top" className="footer-brand" aria-label="Rajat Varma, back to top"><Wordmark /></a><span>DESIGNED & BUILT WITH INTENTION.</span><a href="#top">BACK TO TOP ↑</a></footer>
    </>
  )
}

createRoot(document.getElementById('root')).render(<App />)
