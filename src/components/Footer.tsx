const links = [
  { section: "Docs", items: [
    { label: "Get Started", href: "/getting-started/" },
    { label: "Identity", href: "/identity/" },
    { label: "Payments", href: "/payments/" },
    { label: "Data / MCP", href: "/data/" },
    { label: "Core", href: "/core/" },
    { label: "CLI", href: "/cli/" },
    { label: "Examples", href: "/examples/" },
  ]},
  { section: "Packages", items: [
    { label: "@a3stack/core", href: "https://www.npmjs.com/package/@a3stack/core" },
    { label: "@a3stack/identity", href: "https://www.npmjs.com/package/@a3stack/identity" },
    { label: "@a3stack/payments", href: "https://www.npmjs.com/package/@a3stack/payments" },
    { label: "@a3stack/data", href: "https://www.npmjs.com/package/@a3stack/data" },
  ]},
  { section: "Community", items: [
    { label: "GitHub", href: "https://github.com/arcabotai/a3stack" },
    { label: "arcabot.ai", href: "https://arcabot.ai" },
    { label: "Contact", href: "mailto:arca@arcabot.ai" },
  ]},
];

export default function Footer() {
  return (
    <footer style={{
      background: "var(--bg-surface)",
      borderTop: "1px solid var(--border)",
      padding: "64px 24px 40px",
      marginTop: "auto",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 32,
                height: 32,
                background: "linear-gradient(135deg, #fbbf24, #d97706)",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                fontSize: 13,
                color: "#06090f",
              }}>
                A3
              </div>
              <span style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                fontSize: 18,
                color: "#f1f5f9",
                letterSpacing: "-0.02em",
              }}>
                A3Stack
              </span>
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.7, marginBottom: 20, maxWidth: 280 }}>
              One SDK to give your AI agent an identity, a wallet, and an API.
              Identity × Payments × Data.
            </p>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <a href="https://github.com/arcabotai/a3stack" target="_blank" rel="noopener" aria-label="A3Stack on GitHub" style={{ color: "#4b5f73" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3.3-.4 6.8-1.6 6.8-7A5.4 5.4 0 0 0 19.4 4 5 5 0 0 0 19.3.5S18.2.1 15 1.8a13.4 13.4 0 0 0-7 0C4.8.1 3.7.5 3.7.5A5 5 0 0 0 3.6 4a5.4 5.4 0 0 0-1.4 3.7c0 5.4 3.5 6.6 6.8 7A4.8 4.8 0 0 0 8 18v4"/><path d="M8 19c-3 .9-3-1.5-4-2"/></svg>
              </a>
              <span style={{ color: "var(--text-muted)", fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>
                MIT License
              </span>
            </div>
          </div>

          {/* Links */}
          {links.map((group) => (
            <div key={group.section}>
              <h4 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 12,
                fontWeight: 700,
                color: "#fbbf24",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 16,
              }}>
                {group.section}
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {group.items.map((item) => (
                  <li key={item.label} style={{ marginBottom: 10 }}>
                    <a
                      href={item.href}
                      style={{ color: "#64748b", fontSize: 14, textDecoration: "none", transition: "color 0.15s" }}

                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{
          borderTop: "1px solid var(--border)",
          paddingTop: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <span style={{ color: "var(--text-muted)", fontSize: 13 }}>
            © 2025{" "}
            <a href="https://arcabot.ai" style={{ color: "#fbbf24", textDecoration: "none" }}>arcabot.ai</a>
            {" "}— AI agent infrastructure
          </span>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: "var(--text-muted)",
            letterSpacing: "0.04em",
          }}>
            eip155:8453:0x8004...#2376
          </span>
        </div>
      </div>
    </footer>
  );
}
