
const sections = [
  {
    title: "Overview",
    items: [
      { href: "/", label: "Introduction" },
      { href: "/getting-started/", label: "Getting Started" },
    ],
  },
  {
    title: "Packages",
    items: [
      { href: "/identity/", label: "Identity", badge: "@a3stack/identity" },
      { href: "/payments/", label: "Payments", badge: "@a3stack/payments" },
      { href: "/data/", label: "Data / MCP", badge: "@a3stack/data" },
      { href: "/core/", label: "Core", badge: "@a3stack/core" },
    ],
  },
  {
    title: "Reference",
    items: [
      { href: "/cli/", label: "CLI" },
      { href: "/examples/", label: "Examples" },
    ],
  },
];

interface DocLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  currentPath: string;
  pill?: { label: string; color: "gold" | "blue" | "green" };
}

export default function DocLayout({ children, title, description, currentPath, pill }: DocLayoutProps) {
  return (
    <div className="doc-layout" style={{ display: "flex", minHeight: "100vh", paddingTop: 60 }}>
      {/* Sidebar */}
      <aside className="doc-sidebar" style={{
        width: 240,
        flexShrink: 0,
        borderRight: "1px solid var(--border)",
        background: "var(--bg-surface)",
        position: "sticky",
        top: 60,
        height: "calc(100vh - 60px)",
        overflowY: "auto",
        padding: "24px 0",
      }}>
        {sections.map((section) => (
          <div key={section.title} style={{ marginBottom: 24 }}>
            <h5 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 10,
              fontWeight: 700,
              color: "#fbbf24",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "0 20px",
              marginBottom: 6,
            }}>
              {section.title}
            </h5>
            {section.items.map((item) => {
              const active = item.href === "/" ? currentPath === "/" : currentPath === item.href || currentPath === item.href.slice(0, -1);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "7px 20px",
                    fontSize: 13.5,
                    fontWeight: active ? 600 : 400,
                    color: active ? "#fbbf24" : "#8291a5",
                    background: active ? "rgba(251,191,36,0.06)" : "transparent",
                    borderLeft: active ? "2px solid #fbbf24" : "2px solid transparent",
                    textDecoration: "none",
                    transition: "all 0.15s",
                    marginLeft: 0,
                  }}

                >
                  <span>{item.label}</span>
                  {"badge" in item && item.badge && (
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 9,
                      color: "#8291a5",
                      background: "rgba(255,255,255,0.03)",
                      padding: "1px 5px",
                      borderRadius: 3,
                      letterSpacing: "0.02em",
                      display: active ? "block" : "none",
                    }}>
                      {(item as { badge: string }).badge}
                    </span>
                  )}
                </a>
              );
            })}
          </div>
        ))}

        {/* Bottom links */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)", marginTop: 16 }}>
          <a
            href="https://github.com/arcabotai/a3stack"
            target="_blank"
            rel="noopener"
            style={{ color: "#8291a5", fontSize: 12, textDecoration: "none", display: "block", marginBottom: 8 }}
          >
            GitHub →
          </a>
          <a
            href="https://arcabot.ai"
            target="_blank"
            rel="noopener"
            style={{ color: "#8291a5", fontSize: 12, textDecoration: "none", display: "block" }}
          >
            arcabot.ai →
          </a>
        </div>
      </aside>

      {/* Main content */}
      <main id="main-content" tabIndex={-1} className="doc-main" style={{ flex: 1, minWidth: 0, padding: "48px 64px 80px", maxWidth: 900 }}>
        {/* Page header */}
        <div style={{ marginBottom: 40 }}>
          {pill && (
            <div style={{ marginBottom: 12 }}>
              <span className={`pill pill-${pill.color}`}>{pill.label}</span>
            </div>
          )}
          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "2rem",
            fontWeight: 800,
            color: "#f1f5f9",
            letterSpacing: "-0.03em",
            marginBottom: 12,
          }}>
            {title}
          </h1>
          {description && (
            <p style={{ color: "#94a3b8", fontSize: 16, lineHeight: 1.7, maxWidth: 640 }}>
              {description}
            </p>
          )}
        </div>

        {/* Content */}
        <div className="doc-content">
          {children}
        </div>
      </main>
    </div>
  );
}
