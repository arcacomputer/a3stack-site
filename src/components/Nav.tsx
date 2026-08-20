const navItems = [
  { href: "/getting-started/", label: "Get Started" },
  { href: "/accounts/", label: "Accounts" },
  { href: "/identity/", label: "Identity" },
  { href: "/payments/", label: "Payments" },
  { href: "/data/", label: "Data" },
  { href: "/core/", label: "Core" },
  { href: "/cli/", label: "CLI" },
  { href: "/examples/", label: "Examples" },
];

export default function Nav({ currentPath = "/" }: { currentPath?: string }) {
  return (
    <nav className="site-nav" aria-label="Primary navigation">
      <div className="nav-inner">
        <div className="nav-row">
          <a href="/" className="brand-link" aria-label="A3Stack home">
            <span className="brand-mark">A3</span>
            <span className="brand-name">A3Stack</span>
            <span className="brand-version">v0.2</span>
          </a>
          <div className="nav-links">
            {navItems.map((item) => {
              const active = currentPath === item.href || currentPath === item.href.slice(0, -1);
              return <a key={item.href} href={item.href} className={active ? "nav-item active" : "nav-item"}>{item.label}</a>;
            })}
          </div>
          <div className="nav-actions">
            <a href="https://github.com/arcabotai/a3stack" target="_blank" rel="noopener noreferrer" className="github-link" aria-label="A3Stack on GitHub">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3.3-.4 6.8-1.6 6.8-7A5.4 5.4 0 0 0 19.4 4 5 5 0 0 0 19.3.5S18.2.1 15 1.8a13.4 13.4 0 0 0-7 0C4.8.1 3.7.5 3.7.5A5 5 0 0 0 3.6 4a5.4 5.4 0 0 0-1.4 3.7c0 5.4 3.5 6.6 6.8 7A4.8 4.8 0 0 0 8 18v4"/><path d="M8 19c-3 .9-3-1.5-4-2"/></svg>
            </a>
            <a href="https://www.npmjs.com/package/a3stack" target="_blank" rel="noopener noreferrer" className="npm-link">npm install</a>
          </div>
          <details className="mobile-nav">
            <summary data-mobile-nav-toggle aria-label="Open navigation menu"><span aria-hidden="true" /></summary>
            <div className="mobile-nav-panel">
              {navItems.map((item) => {
                const active = currentPath === item.href || currentPath === item.href.slice(0, -1);
                return <a key={item.href} href={item.href} className={active ? "nav-item active" : "nav-item"}>{item.label}</a>;
              })}
              <a href="https://github.com/arcabotai/a3stack" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href="https://www.npmjs.com/package/a3stack" target="_blank" rel="noopener noreferrer">npm install</a>
            </div>
          </details>
        </div>
      </div>
    </nav>
  );
}
