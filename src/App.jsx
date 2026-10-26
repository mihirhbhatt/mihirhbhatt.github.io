import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const USERNAME = 'mihirhbhatt'
const IS_MAC = typeof navigator !== 'undefined' && /mac|iphone|ipad/i.test(navigator.userAgent)
const MOD_LABEL = IS_MAC ? 'Cmd' : 'Ctrl'
const CV_URL = `${import.meta.env.BASE_URL}Mihir_Bhatt_CV.docx`
const REPO_ENDPOINT = `https://api.github.com/users/${USERNAME}/repos?type=owner&sort=updated&direction=desc&per_page=100`

const skills = [
  { group: 'GRC', items: ['Governance, risk & compliance', 'PCI DSS', 'Compliance workflows'] },
  { group: 'DevSecOps', items: ['CI/CD security', 'GitHub Actions', 'Jenkins', 'GitLab CI/CD'] },
  { group: 'Infrastructure as Code', items: ['Terraform', 'Ansible', 'Python', 'PowerShell'] },
  { group: 'AI', items: ['AI and DevOps', 'AI-assisted workflows', 'RAG systems'] },
  { group: 'AI Governance', items: ['AI risk', 'Governance & compliance', 'Responsible AI'] },
  { group: 'AI Security', items: ['AI artifact scanning', 'RAG content security', 'Local-first scanning'] },
]

const featuredAreas = [
  {
    number: '01',
    tag: 'AI · DEVOPS · PLATFORM ENGINEERING',
    title: 'AI and DevOps',
    description: 'Practical, implementation-focused ideas for bringing AI into DevOps, platform engineering, cloud, CI/CD, SRE, security, and infrastructure workflows.',
    tech: ['AI', 'DevOps', 'Cloud', 'Platform engineering'],
    href: `https://github.com/${USERNAME}/aianddevops`,
    cta: 'Explore on GitHub',
  },
  {
    number: '02',
    tag: 'POST-QUANTUM · COMPLIANCE',
    title: 'PQC + PCI-DSS Compliance Lab',
    description: 'A hands-on lab exploring post-quantum cryptography (PQC) and PCI-DSS compliance.',
    tech: ['Python', 'Post-quantum cryptography', 'PCI DSS'],
    href: `https://github.com/${USERNAME}/pqc-pci-dss-lab`,
    cta: 'Explore on GitHub',
  },
  {
    number: '03',
    tag: 'AI SECURITY · DEVELOPER TOOLS',
    title: 'Verifii',
    description: 'A local-first security scanner for AI artifacts and RAG content, with a shared heuristic scanner for CLI, CI, and browser workflows.',
    tech: ['JavaScript', 'AI security', 'CLI', 'CI'],
    href: `https://github.com/${USERNAME}/verifii`,
    cta: 'Explore on GitHub',
  },
]

const agentSuggestions = ['What does Mihir work on?', 'Show me featured projects', 'How can I get in touch?']

function getAgentResponse(question) {
  const query = question.toLowerCase()

  if (/\b(ai security|rag|ai artifact|llm security)\b/.test(query)) {
    return {
      text: 'Mihir is exploring AI security through local-first scanning of AI artifacts and RAG content. His Verifii project supports developer and CI workflows while keeping file contents on the machine running the scan.',
      link: { label: 'Explore Verifii', href: `https://github.com/${USERNAME}/verifii` },
    }
  }
  if (/\b(ai governance|responsible ai|ai risk)\b/.test(query)) {
    return {
      text: 'Mihir is interested in AI governance, including how AI risk, governance, and compliance can be approached through practical engineering workflows.',
      link: { label: 'Explore AI and DevOps', href: `https://github.com/${USERNAME}/aianddevops` },
    }
  }
  if (/\b(infrastructure as code|iac|terraform|ansible)\b/.test(query)) {
    return {
      text: 'Mihir’s Infrastructure as Code interests include Terraform and Ansible, alongside Python and PowerShell automation.',
      link: { label: 'Explore expertise', href: '#skills' },
    }
  }
  if (/\b(grc|governance|risk|compliance|pci.?dss)\b/.test(query)) {
    return {
      text: 'Mihir is interested in making governance, risk, and compliance workflows clearer and more repeatable. His public projects include a hands-on PCI-DSS and post-quantum cryptography lab.',
      link: { label: 'View the compliance lab', href: `https://github.com/${USERNAME}/pqc-pci-dss-lab` },
    }
  }
  if (/\b(devsecops|ci\/cd|security checks)\b/.test(query)) {
    return {
      text: 'Mihir focuses on bringing security and compliance checks closer to CI/CD and repeatable engineering workflows, alongside cloud and infrastructure automation.',
      link: { label: 'Read about Mihir', href: '#about' },
    }
  }
  if (/\bcloud security\b/.test(query)) {
    return {
      text: 'Mihir’s cloud security interests include AWS and Azure, policy and configuration controls, and infrastructure automation with tools such as Terraform and Ansible.',
      link: { label: 'Explore expertise', href: '#skills' },
    }
  }
  if (/\b(projects?|work(?:s|ing)?|repos?|github|verifii|pqc|aianddevops)\b/.test(query)) {
    return {
      text: 'Featured projects include AI and DevOps (practical AI-in-engineering ideas), the PQC + PCI-DSS Compliance Lab, and Verifii (a local-first AI artifact and RAG security scanner).',
      link: { label: 'Browse all projects', href: '#work' },
    }
  }
  if (/\bai\b/.test(query)) {
    return {
      text: 'Mihir explores practical AI applications in engineering, including AI and DevOps, AI governance, and AI security for artifacts and RAG content.',
      link: { label: 'Browse selected projects', href: '#work' },
    }
  }
  if (/\b(?:skills?|tools?|technology|technologies|tech stack|languages?|cloud|devops|automation|security)\b/.test(query)) {
    return {
      text: 'Mihir’s focus areas are GRC, DevSecOps, Infrastructure as Code, AI, AI governance, and AI security. He explores these through practical projects and ongoing learning.',
      link: { label: 'Explore expertise', href: '#skills' },
    }
  }
  if (/\b(contact|email|reach|connect|touch|website|location|where|toronto)\b/.test(query)) {
    return {
      text: 'Mihir is based in Toronto. You’re already on his portfolio website. To connect, visit his GitHub profile.',
      link: { label: 'Connect on GitHub', href: `https://github.com/${USERNAME}` },
    }
  }
  if (/\b(who|about|mihir|bio|background)\b/.test(query)) {
    return {
      text: 'Mihir Bhatt is an automation engineer and Cloud & DevOps enthusiast based in Toronto. He enjoys building practical, repeatable workflows across cloud, DevOps, security, and compliance.',
      link: { label: 'Read about Mihir', href: '#about' },
    }
  }
  return {
    text: 'I can help with information on Mihir’s background, skills, projects, and contact links. Try asking about one of those topics.',
  }
}

function Icon({ name }) {
  const paths = {
    arrow: <><path d="M7 17 17 7" /><path d="M7 7h10v10" /></>,
    bot: <><rect x="4" y="8" width="16" height="12" rx="3" /><path d="M12 4v4m-4 5h.01M16 13h.01M9 17h6" /><path d="M9 4h6" /></>,
    github: <><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 19 4.77 5.07 5.07 0 0 0 18.91 1S17.73.65 15 2.48a13.38 13.38 0 0 0-7 0C5.27.65 4.09 1 4.09 1A5.07 5.07 0 0 0 4 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 8 18.13V22" /></>,
    moon: <><path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></>,
    code: <><path d="m16 18 6-6-6-6M8 6l-6 6 6 6m6-16-4 20" /></>,
    shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>,
    cloud: <><path d="M20 16.2A4.5 4.5 0 0 0 18 7.5h-1.3A7 7 0 1 0 4 15.8" /><path d="M8 16h8m-4-4v8" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
    terminal: <><path d="m4 17 6-6-6-6m8 14h8" /></>,
    star: <><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" /></>,
    fork: <><circle cx="6" cy="6" r="2" /><circle cx="18" cy="18" r="2" /><circle cx="6" cy="18" r="2" /><path d="M6 8v8m12 0v-3a5 5 0 0 0-5-5H8" /></>,
    "download": <><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name] || paths.code}</svg>
}

function SectionHeading({ eyebrow, title, note }) {
  return <div className="section-heading">
    <div>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
    </div>
    {note && <p className="section-note">{note}</p>}
  </div>
}

function RepoCard({ repo }) {
  const description = repo.description || 'No description added yet. Visit the repository to learn more.'
  return <article className="repo-card">
    <div className="repo-top">
      <span className="repo-icon"><Icon name="code" /></span>
      <a className="repo-link" href={repo.html_url} target="_blank" rel="noreferrer" aria-label={`Open ${repo.name} on GitHub`}><Icon name="arrow" /></a>
    </div>
    <h3><a href={repo.html_url} target="_blank" rel="noreferrer">{repo.name.replaceAll('-', ' ').replaceAll('_', ' ')}</a></h3>
    <p className="repo-description">{description}</p>
    <div className="repo-meta">
      {repo.language && <span className="language"><i />{repo.language}</span>}
      <span><Icon name="star" />{repo.stargazers_count}</span>
      <span><Icon name="fork" />{repo.forks_count}</span>
    </div>
    {repo.topics?.length > 0 && <div className="topic-list">{repo.topics.slice(0, 3).map(topic => <span key={topic}>{topic}</span>)}</div>}
  </article>
}

function AskAgent() {
  const [open, setOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([])
  const inputRef = useRef(null)
  const messagesRef = useRef(null)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (open) messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, open])

  function ask(value) {
    const text = value.trim()
    if (!text) return
    setMessages(current => [...current, { role: 'visitor', text }, { role: 'agent', ...getAgentResponse(text) }])
    setQuestion('')
  }

  return <div className="ask-agent">
    {open && <section className="agent-panel" role="dialog" aria-label="Ask Mihir's portfolio agent">
      <div className="agent-header">
        <span className="agent-avatar"><Icon name="bot" /></span>
        <div><b>Ask Agent</b><small><span className="status-dot" /> Portfolio assistant</small></div>
        <button className="agent-close" type="button" onClick={() => setOpen(false)} aria-label="Close Ask Agent">×</button>
      </div>
      <div className="agent-messages" ref={messagesRef} aria-live="polite">
        <div className="agent-message agent-reply">Hi! I can answer questions about Mihir’s background, projects, and skills using information from this portfolio.</div>
        {messages.map((message, index) => <div className={`agent-message ${message.role === 'visitor' ? 'agent-question' : 'agent-reply'}`} key={`${index}-${message.role}`}>
          <p>{message.text}</p>
          {message.link && <a href={message.link.href} onClick={() => { if (message.link.href.startsWith('#')) setOpen(false) }}>{message.link.label} <Icon name="arrow" /></a>}
        </div>)}
        {messages.length === 0 && <div className="agent-suggestions">{agentSuggestions.map(suggestion => <button type="button" key={suggestion} onClick={() => ask(suggestion)}>{suggestion}</button>)}</div>}
      </div>
      <form className="agent-form" onSubmit={event => { event.preventDefault(); ask(question) }}>
        <label className="sr-only" htmlFor="agent-question">Ask a question about Mihir</label>
        <input id="agent-question" ref={inputRef} value={question} onChange={event => setQuestion(event.target.value)} placeholder="Ask about projects, skills..." autoComplete="off" />
        <button type="submit" aria-label="Send question" disabled={!question.trim()}><Icon name="arrow" /></button>
      </form>
      <p className="agent-disclaimer">Answers are based on this portfolio, not a live AI service.</p>
    </section>}
    <button className="agent-launcher" type="button" aria-expanded={open} aria-label={open ? 'Close Ask Agent' : 'Open Ask Agent'} onClick={() => setOpen(value => !value)}>
      <Icon name={open ? 'code' : 'bot'} /><span>{open ? 'Close' : 'Ask Agent'}</span>
    </button>
  </div>
}

function CommandPalette({ open, onClose, theme, toggleTheme, repos }) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const [output, setOutput] = useState(null)
  const inputRef = useRef(null)

  const commands = useMemo(() => {
    const go = hash => () => { window.location.hash = hash; return null }
    const open = url => () => { window.open(url, '_blank', 'noopener'); return null }
    return [
      { id: 'home', label: 'Go to Home', hint: 'goto home', run: go('#home') },
      { id: 'about', label: 'Go to About', hint: 'goto about', run: go('#about') },
      { id: 'work', label: 'Go to Selected work', hint: 'goto work', run: go('#work') },
      { id: 'repos', label: 'Go to Repositories', hint: 'goto repos', run: go('#repositories') },
      { id: 'skills', label: 'Go to Expertise', hint: 'goto skills', run: go('#skills') },
      { id: 'contact', label: 'Go to Contact', hint: 'goto contact', run: go('#contact') },
      { id: 'cv', label: 'Download CV', hint: 'download cv', run: () => { const a = document.createElement('a'); a.href = CV_URL; a.download = 'Mihir_Bhatt_CV.docx'; a.click(); return null } },
      { id: 'github', label: 'Open GitHub profile', hint: 'open github', run: open(`https://github.com/${USERNAME}`) },
      { id: 'theme', label: `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`, hint: 'theme', run: () => { toggleTheme(); return null } },
      { id: 'whoami', label: 'whoami', hint: 'print bio', stay: true, run: () => ['Mihir Bhatt — automation engineer & Cloud/DevOps enthusiast', 'Toronto · GRC · DevSecOps · IaC · AI Governance & Security'] },
      { id: 'skills-list', label: 'skills', hint: 'list expertise', stay: true, run: () => skills.map(s => `${s.group.padEnd(24)} ${s.items.join(', ')}`) },
      { id: 'repos-list', label: 'ls repos', hint: 'list repositories', stay: true, run: () => repos.length ? repos.slice(0, 10).map(r => `${r.name}${r.language ? ` [${r.language}]` : ''}`) : ['No repositories loaded yet.'] },
      { id: 'help', label: 'help', hint: 'show commands', stay: true, run: () => ['Type to filter, ↑↓ to move, Enter to run, Esc to close.', 'Commands: goto <section>, open github, theme, whoami, skills, ls repos'] },
    ]
  }, [theme, toggleTheme, repos])

  const results = useMemo(() => {
    const term = query.trim().toLowerCase()
    return term ? commands.filter(c => `${c.label} ${c.hint}`.toLowerCase().includes(term)) : commands
  }, [commands, query])

  useEffect(() => {
    if (open) { setQuery(''); setActive(0); setOutput(null); setTimeout(() => inputRef.current?.focus(), 0) }
  }, [open])

  useEffect(() => { setActive(0) }, [query])

  const execute = command => {
    if (!command) return
    const lines = command.run()
    if (command.stay) { setOutput({ title: command.label, lines }); setQuery('') } else onClose()
  }

  const onKeyDown = event => {
    if (event.key === 'ArrowDown') { event.preventDefault(); setActive(i => Math.min(i + 1, results.length - 1)) }
    else if (event.key === 'ArrowUp') { event.preventDefault(); setActive(i => Math.max(i - 1, 0)) }
    else if (event.key === 'Enter') { event.preventDefault(); execute(results[active]) }
    else if (event.key === 'Escape') onClose()
  }

  if (!open) return null
  return <div className="palette-backdrop" onMouseDown={onClose}>
    <div className="palette" role="dialog" aria-label="Command palette" onMouseDown={event => event.stopPropagation()}>
      <div className="palette-input"><span className="mono">$</span><input ref={inputRef} value={query} onChange={event => setQuery(event.target.value)} onKeyDown={onKeyDown} placeholder="Type a command or search…" aria-label="Command" autoComplete="off" spellCheck="false" /><kbd>esc</kbd></div>
      {output && <pre className="palette-output"><b>$ {output.title}</b>{'\n'}{output.lines.join('\n')}</pre>}
      <ul className="palette-list" role="listbox">
        {results.length ? results.map((c, i) => <li key={c.id} role="option" aria-selected={i === active} className={i === active ? 'active' : ''} onMouseEnter={() => setActive(i)} onClick={() => execute(c)}><span>{c.label}</span><small className="mono">{c.hint}</small></li>) : <li className="palette-empty">No matching command. Try “help”.</li>}
      </ul>
      <div className="palette-foot mono"><span>↑↓ navigate</span><span>↵ run</span><span>esc close</span></div>
    </div>
  </div>
}

function StatusBadge({ loading, error, repos }) {
  const [open, setOpen] = useState(false)
  const state = loading ? 'checking' : error ? 'off' : 'live'
  const label = { checking: 'SYNC', off: 'OFF', live: 'LIVE' }[state]

  useEffect(() => {
    if (!open) return
    const onKey = event => event.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const stats = useMemo(() => {
    if (!repos.length) return null
    const days = repo => (Date.now() - new Date(repo.pushed_at).getTime()) / 86400000
    const pct = n => Math.round((n / repos.length) * 100)
    const active = pct(repos.filter(repo => days(repo) <= 90).length)
    const documented = pct(repos.filter(repo => repo.description).length)
    const tagged = pct(repos.filter(repo => (repo.topics || []).length).length)
    const licensed = pct(repos.filter(repo => repo.license).length)
    const score = Math.round(active * 0.4 + documented * 0.25 + tagged * 0.2 + licensed * 0.15)
    return { score, active, documented, tagged, licensed, latest: Math.min(...repos.map(days)), languages: new Set(repos.map(repo => repo.language).filter(Boolean)).size }
  }, [repos])

  const score = stats?.score ?? 0
  const health = !stats ? (error ? 'DEGRADED' : 'SYNCING') : score >= 75 ? 'HEALTHY' : score >= 50 ? 'STABLE' : 'ATTENTION'
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const bars = stats ? [['Recent activity', stats.active], ['Documented repos', stats.documented], ['Topic coverage', stats.tagged], ['Licensed repos', stats.licensed]] : []

  return <>
    <button type="button" className={`status-badge status-${state}`} onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open} title="Open platform telemetry"><span className="status-dot" />{label}</button>
    {open && <div className="telemetry-backdrop" onClick={() => setOpen(false)} />}
    <aside className={open ? 'telemetry-panel open' : 'telemetry-panel'} role="dialog" aria-label="Platform telemetry" aria-hidden={!open}>
      <div className="telemetry-panel-head"><span className="eyebrow">PLATFORM TELEMETRY</span><button type="button" className="agent-close" onClick={() => setOpen(false)} aria-label="Close telemetry panel" tabIndex={open ? 0 : -1}>×</button></div>
      <div className="health-meter" role="meter" aria-label="Portfolio health score" aria-valuemin="0" aria-valuemax="100" aria-valuenow={score}>
        <svg viewBox="0 0 140 140" aria-hidden="true">
          <circle className="meter-track" cx="70" cy="70" r={radius} />
          <circle className="meter-fill" cx="70" cy="70" r={radius} strokeDasharray={circumference} strokeDashoffset={circumference * (1 - score / 100)} transform="rotate(-90 70 70)" />
        </svg>
        <div className="meter-value"><b>{loading ? '…' : stats ? score : '--'}</b><small>{health}</small></div>
      </div>
      <p className="telemetry-source mono"><span className={`status-badge-dot status-${state}`}><span className="status-dot" /></span> {state === 'live' ? 'LIVE · GITHUB API' : state === 'off' ? 'OFFLINE · GITHUB API' : 'CHECKING…'}</p>
      <div className="telemetry-bars">
        {stats ? bars.map(([name, value]) => <div className="bar-row" key={name}>
          <div className="bar-label"><span>{name}</span><span className="mono">{value}%</span></div>
          <div className="bar-track"><div className="bar-fill" style={{ width: `${value}%` }} /></div>
        </div>) : <p className="telemetry-empty">{loading ? 'Collecting telemetry…' : error || 'No telemetry available.'}</p>}
      </div>
      <div className="telemetry-stats">
        <div><b>{stats ? repos.length : '--'}</b><small>PUBLIC REPOS</small></div>
        <div><b>{stats ? stats.languages : '--'}</b><small>LANGUAGES</small></div>
        <div><b>{stats ? `${Math.max(0, Math.round(stats.latest))}d` : '--'}</b><small>LAST PUSH</small></div>
      </div>
    </aside>
  </>
}

function App() {
  const [theme, setTheme] = useState(() => window.localStorage.getItem('portfolio-theme') === 'light' ? 'light' : 'dark')
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [language, setLanguage] = useState('All')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const toggleTheme = useCallback(() => setTheme(current => current === 'dark' ? 'light' : 'dark'), [])

  useEffect(() => {
    const onKey = event => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setPaletteOpen(open => !open) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f7f9fc' : '#090d19')
    window.localStorage.setItem('portfolio-theme', theme)
  }, [theme])

  useEffect(() => {
    const controller = new AbortController()
    async function loadRepos() {
      try {
        const response = await fetch(REPO_ENDPOINT, {
          headers: { Accept: 'application/vnd.github+json' },
          signal: controller.signal,
        })
        if (!response.ok) {
          if (response.status === 403) throw new Error('GitHub API rate limit reached. Please try again in a little while.')
          throw new Error(`GitHub returned status ${response.status}.`)
        }
        const data = await response.json()
        setRepos(data.filter(repo => !repo.fork && !repo.archived && !repo.disabled))
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message || 'Could not load repositories.')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    loadRepos()
    return () => controller.abort()
  }, [])

  const languages = useMemo(() => ['All', ...new Set(repos.map(repo => repo.language).filter(Boolean).sort())], [repos])
  const visibleRepos = useMemo(() => {
    const term = search.trim().toLowerCase()
    return repos.filter(repo => {
      const matchesLanguage = language === 'All' || repo.language === language
      const haystack = `${repo.name} ${repo.description || ''} ${(repo.topics || []).join(' ')}`.toLowerCase()
      return matchesLanguage && (!term || haystack.includes(term))
    })
  }, [repos, search, language])

  const closeMenu = () => setMobileOpen(false)

  return <div className="site-shell">
    <div className="ambient ambient-one" />
    <div className="ambient ambient-two" />
    <header className="site-header">
      <a className="brand" href="#home" onClick={closeMenu} aria-label="Mihir Bhatt home"><span className="brand-mark">MB</span><span>mihir<span className="brand-dot">.</span></span></a>
      <StatusBadge loading={loading} error={error} repos={repos} />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} theme={theme} toggleTheme={toggleTheme} repos={repos} />
      <button className="mobile-menu" aria-label="Toggle navigation" aria-expanded={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)}><Icon name="menu" /></button>
      <nav className={mobileOpen ? 'nav-links open' : 'nav-links'} aria-label="Main navigation">
        <a href="#about" onClick={closeMenu}>About</a>
        <a href="#work" onClick={closeMenu}>Selected work</a>
        <a href="#repositories" onClick={closeMenu}>Repositories</a>
        <a href="#skills" onClick={closeMenu}>Expertise</a>
        <button className="theme-toggle" type="button" onClick={() => setTheme(current => current === 'dark' ? 'light' : 'dark')} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} /><span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
        </button>
        <a className="nav-contact" href="#contact" onClick={closeMenu}>Let's connect <Icon name="arrow" /></a>
      </nav>
      <a className="cv-link" href={CV_URL} download="Mihir_Bhatt_CV.docx" aria-label="Download CV"><Icon name="download" /><span>CV</span></a>
      <button type="button" className="palette-trigger" onClick={() => setPaletteOpen(true)} aria-label={`Open command palette (${MOD_LABEL}+K)`}><Icon name="terminal" /><span>Command</span><kbd>{IS_MAC ? '⌘' : 'Ctrl'} K</kbd></button>
    </header>

    <main>
      <section className="hero section-wrap" id="home">
        <div className="hero-copy">
          <div className="availability"><span className="status-dot" /> GRC · DEVSECOPS · IAC · AI GOVERNANCE & SECURITY</div>
          <h1>Cloud systems,<br /><span>automated with care.</span></h1>
          <p className="hero-lede">I'm Mihir Bhatt, an automation engineer and Cloud & DevOps enthusiast based in Toronto. I enjoy turning complex engineering challenges into practical, repeatable workflows.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#repositories">Explore my work <Icon name="arrow" /></a>
            <a className="button button-quiet" href={`https://github.com/${USERNAME}`} target="_blank" rel="noreferrer"><Icon name="github" /> GitHub profile</a>
          </div>
          <div className="hero-footnote"><span className="mono">AREAS / 06</span><span>GRC · DevSecOps · IaC · AI · AI Governance · AI Security</span></div>
        </div>
        <div className="hero-visual" aria-label="Abstract cloud security architecture illustration">
          <div className="visual-grid" />
          <div className="orbit orbit-a" /><div className="orbit orbit-b" />
          <div className="visual-center"><img className="profile-photo" src="https://github.com/mihirhbhatt.png?size=240" alt="Mihir Bhatt's GitHub profile photo" /><span>MIHIR BHATT</span></div>
          {[
            ['shield', 'AI Security', 'Artifact & RAG scanning'],
            ['cloud', 'GRC', 'Risk · Compliance'],
            ['code', 'DevSecOps', 'CI/CD security'],
            ['terminal', 'IaC', 'Terraform · Ansible'],
            ['bot', 'AI', 'AI-assisted workflows'],
            ['star', 'AI Governance', 'Responsible AI'],
          ].map(([icon, title, sub], i) => <div className={`float-card pos-${i + 1}`} key={title}><span className="float-icon"><Icon name={icon} /></span><div><b>{title}</b><small>{sub}</small></div></div>)}
          <div className="visual-caption"><span className="status-dot" /> CLOUD SYSTEMS / AUTOMATION</div>
        </div>
        <div className="hero-scroll"><span /> SCROLL TO EXPLORE</div>
      </section>

      <section className="intro-strip">
        <div className="section-wrap strip-inner"><span className="eyebrow">MY APPROACH</span><p>Less manual toil. More <span>reliable automation.</span> Security that fits the way teams build and operate.</p><span className="strip-index mono">[ 001 — 004 ]</span></div>
      </section>

      <section className="section-wrap section-block" id="about">
        <SectionHeading eyebrow="ABOUT ME" title="Security and automation for the systems we build." note="Based in Toronto, exploring GRC, DevSecOps, Infrastructure as Code, AI, AI governance, and AI security." />
        <div className="about-grid">
          <div className="about-main">
            <p className="about-statement">I’m interested in making security and compliance <span>practical parts of engineering—not afterthoughts.</span></p>
            <p className="body-copy">In AI security, I’m exploring how to identify risks in AI artifacts and retrieval-augmented generation (RAG) content. My Verifii project takes a local-first approach, with a shared scanner for developer and CI workflows.</p>
            <p className="body-copy">My broader interests include governance, risk, and compliance (GRC), infrastructure as code (IaC), and DevSecOps—bringing security and governance closer to how cloud systems and software are built. I’m also exploring AI governance: how AI risks and requirements can be addressed with clear, practical processes.</p>
            <a className="text-link" href="#work">Explore selected projects <Icon name="arrow" /></a>
          </div>
          <div className="about-aside">
            <div className="aside-number">01 <span>/ AREAS OF FOCUS</span></div>
            <div className="principle"><b>AI security</b><p>Local-first scanning for AI artifacts and RAG content, designed to fit developer and CI workflows.</p></div>
            <div className="principle"><b>GRC</b><p>Making security requirements easier to reason about, with hands-on exploration of PCI DSS and post-quantum readiness.</p></div>
            <div className="principle"><b>DevSecOps</b><p>Bringing security and compliance checks closer to CI/CD and repeatable engineering workflows.</p></div>
            <div className="principle"><b>Infrastructure as Code</b><p>Using code and automation to make infrastructure changes more consistent and reviewable.</p></div>
            <div className="principle"><b>AI</b><p>Exploring practical ways to apply AI across engineering and DevOps workflows.</p></div>
            <div className="principle"><b>AI Governance</b><p>Thinking through AI risk, governance, and compliance as part of responsible AI adoption.</p></div>
          </div>
        </div>
      </section>

      <section className="section-wrap section-block" id="work">
        <SectionHeading eyebrow="SELECTED PROJECTS" title="A few things from my GitHub." note="A selection of public projects across DevOps, compliance, and AI security." />
        <div className="featured-grid">{featuredAreas.map(item => <article className="featured-card" key={item.number}><div className="featured-top"><span className="mono">{item.number} / 03</span><span className="featured-symbol"><Icon name={item.number === '01' ? 'shield' : item.number === '02' ? 'terminal' : 'cloud'} /></span></div><p className="eyebrow">{item.tag}</p><h3>{item.title}</h3><p className="featured-description">{item.description}</p><div className="topic-list">{item.tech.map(tech => <span key={tech}>{tech}</span>)}</div><a className="text-link" href={item.href} target="_blank" rel="noreferrer">{item.cta} <Icon name="arrow" /></a></article>)}</div>
      </section>

      <section className="repo-section" id="repositories">
        <div className="section-wrap section-block">
          <SectionHeading eyebrow="OPEN SOURCE & EXPERIMENTS" title="From the GitHub workshop." note="Loaded live from the GitHub public API. Repository descriptions and metadata come from GitHub." />
          <div className="repo-toolbar">
            <label className="search-box"><span className="sr-only">Search repositories</span><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m16 16 4 4" /></svg><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search repositories..." /></label>
            <label className="filter-box"><span className="sr-only">Filter by language</span><select value={language} onChange={e => setLanguage(e.target.value)}>{languages.map(item => <option key={item}>{item}</option>)}</select></label>
            <a className="button button-quiet all-repos" href={`https://github.com/${USERNAME}?tab=repositories`} target="_blank" rel="noreferrer">All repositories <Icon name="arrow" /></a>
          </div>
          {loading && <div className="repo-state"><span className="loader" /> Loading public repositories…</div>}
          {!loading && error && <div className="repo-state error-state"><b>Repositories couldn't be loaded.</b><p>{error}</p><button className="text-link" onClick={() => window.location.reload()}>Try again ↗</button><p>You can still browse the <a href={`https://github.com/${USERNAME}?tab=repositories`} target="_blank" rel="noreferrer">GitHub profile directly</a>.</p></div>}
          {!loading && !error && visibleRepos.length === 0 && <div className="repo-state">No repositories match those filters. Try another search.</div>}
          {!loading && !error && <div className="repo-grid">{visibleRepos.map(repo => <RepoCard key={repo.id} repo={repo} />)}</div>}
          {!loading && !error && <p className="repo-count mono">SHOWING {visibleRepos.length} OF {repos.length} PUBLIC REPOSITORIES · NON-FORKS</p>}
        </div>
      </section>

      <section className="section-wrap section-block" id="skills">
        <SectionHeading eyebrow="AREAS OF INTEREST" title="Six connected focus areas." note="Areas I explore through hands-on projects and ongoing learning." />
        <div className="skills-grid">{skills.map((skill, i) => <article className="skill-card" key={skill.group}><div className="skill-index mono">0{i + 1}</div><h3>{skill.group}</h3><div className="skill-tags">{skill.items.map(item => <span key={item}>{item}</span>)}</div></article>)}</div>
      </section>

      <section className="contact-section" id="contact"><div className="section-wrap contact-inner"><p className="eyebrow">LET'S CONNECT</p><h2>Good ideas start<br /><span>with a conversation.</span></h2><p>Interested in automation, cloud, DevSecOps, or building something together? Connect with me on GitHub or explore my projects here.</p><div className="hero-actions"><a className="button button-primary" href={`https://github.com/${USERNAME}`} target="_blank" rel="noreferrer"><Icon name="github" /> Connect on GitHub <Icon name="arrow" /></a><a className="button button-quiet" href="#work">Explore projects <Icon name="arrow" /></a></div></div></section>
    </main>

    <footer className="site-footer"><div className="section-wrap footer-inner"><a className="brand" href="#home"><span className="brand-mark">MB</span><span>mihir<span className="brand-dot">.</span></span></a><span className="footer-copy">A personal portfolio built with curiosity and care.</span><div className="footer-links"><a href={`https://github.com/${USERNAME}`} target="_blank" rel="noreferrer">GitHub <Icon name="arrow" /></a><a href="#home">Back to top ↑</a></div></div><div className="section-wrap footer-bottom"><span>© {new Date().getFullYear()} Mihir Bhatt · Toronto, Canada</span><span className="mono">BUILT WITH REACT + VITE</span></div></footer>
    <AskAgent />
  </div>
}

export default App
