import { ArrowRight, Shield, CreditCard, Database, Terminal, ExternalLink, Zap, CheckCircle2, Wallet } from "lucide-react";
import CodeBlock from "@/components/CodeBlock";

const HERO_CODE = `import { A3Stack } from "@a3stack/core";
import { base } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { z } from "zod";

// One class. Three capabilities.
const agent = new A3Stack({
  account: privateKeyToAccount(process.env.PRIVATE_KEY),
  chain: base,
  server: {
    name: "MyAgent",
    payment: { amount: "1000" }, // 0.001 USDC per call
  },
});

agent.tool("analyze", { query: z.string() }, async ({ query }) => ({
  content: [{ type: "text", text: \`Analysis: \${query}\` }],
}));

await agent.start(); // → http://localhost:3000/mcp`;

const CLIENT_CODE = `// Another agent connects and pays automatically
const client = await createAgentMcpClient({
  agentId: "eip155:8453:0x8004...#42", // ERC-8004 global ID
  payer: { account },                    // x402 auto-payment
});

const result = await client.callTool("analyze", { query: "ETH price trend" });
// Payment of 0.001 USDC happened automatically ✓`;

const pillars = [
  {
    icon: Wallet,
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.1)",
    border: "rgba(167,139,250,0.2)",
    label: "Accounts",
    badge: "@a3stack/accounts",
    title: "Gasless smart accounts",
    description: "Create ERC-4337 smart accounts with automatic gas sponsorship via CDP Paymaster. Register agents on-chain with zero ETH.",
    href: "/accounts",
    items: [
      "Zero gas registration (CDP Paymaster)",
      "ERC-4337 smart accounts on Base",
      "One-shot gaslessRegister()",
      "Idempotent account creation",
    ],
  },
  {
    icon: Shield,
    color: "#34d399",
    bg: "rgba(52,211,153,0.1)",
    border: "rgba(52,211,153,0.2)",
    label: "Identity",
    badge: "@a3stack/identity",
    title: "Verifiable on-chain identity",
    description: "Register your agent as an ERC-8004 NFT on Base. Other agents can cryptographically verify who you are across 22 EVM chains.",
    href: "/identity",
    items: [
      "ERC-8004 registration (ERC-721)",
      "Cross-chain discovery",
      "Back-reference verification",
      "22 supported EVM chains",
    ],
  },
  {
    icon: CreditCard,
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.1)",
    border: "rgba(251,191,36,0.2)",
    label: "Payments",
    badge: "@a3stack/payments",
    title: "Agent-to-agent payments",
    description: "Charge other agents for your services using the x402 protocol. Auto-pay via EIP-3009 signatures — no gas, instant, USDC on Base.",
    href: "/payments",
    items: [
      "x402 protocol (HTTP 402)",
      "EIP-3009 gasless authorization",
      "USDC on Base",
      "Express.js middleware",
    ],
  },
  {
    icon: Database,
    color: "#60a5fa",
    bg: "rgba(96,165,250,0.1)",
    border: "rgba(96,165,250,0.2)",
    label: "Data",
    badge: "@a3stack/data",
    title: "MCP with identity + payments",
    description: "Build MCP servers that verify who connects and charge per call. Or connect to any MCP server with auto-payment and identity resolution.",
    href: "/data",
    items: [
      "MCP server with payment gating",
      "Auto-payment client",
      "Identity resource (agent://identity)",
      "probeAgent discovery",
    ],
  },
];

const timeline = [
  { step: "1", text: "Agent A resolves Agent B's ERC-8004 global ID on-chain" },
  { step: "2", text: "Fetches registration file → parses MCP endpoint and x402Support" },
  { step: "3", text: "Connects to MCP endpoint — first request returns HTTP 402" },
  { step: "4", text: "Client auto-signs EIP-3009 authorization (gasless)" },
  { step: "5", text: "Retry with X-PAYMENT header → server verifies, returns result" },
  { step: "6", text: "Payment receipt in X-PAYMENT-RESPONSE, facilitator settles on-chain" },
];

const packages = [
  { name: "@a3stack/accounts", desc: "Gasless smart accounts via CDP Paymaster (NEW)", cmd: "npm i @a3stack/accounts", highlight: true },
  { name: "@a3stack/core", desc: "All-in-one: A3Stack class + all re-exports", cmd: "npm i @a3stack/core" },
  { name: "@a3stack/identity", desc: "ERC-8004 registration, verification, discovery", cmd: "npm i @a3stack/identity" },
  { name: "@a3stack/payments", desc: "x402 client (paying) + server (receiving)", cmd: "npm i @a3stack/payments" },
  { name: "@a3stack/data", desc: "MCP server/client with identity + payment", cmd: "npm i @a3stack/data" },
  { name: "a3stack", desc: "CLI: verify, lookup, probe, chains, count, init", cmd: "npx a3stack" },
];

export default function Home() {
  return (
    <main style={{ paddingTop: 80 }}>
      {/* Hero */}
      <section style={{
        position: "relative",
        padding: "80px 24px 60px",
        overflow: "hidden",
      }}>
        {/* Background decoration */}
        <div style={{
          position: "absolute",
          top: -200,
          left: "50%",
          transform: "translateX(-50%)",
          width: 800,
          height: 800,
          background: "radial-gradient(ellipse at center, rgba(251,191,36,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute",
          top: 100,
          left: "10%",
          width: 400,
          height: 400,
          background: "radial-gradient(ellipse at center, rgba(96,165,250,0.04) 0%, transparent 60%)",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
          {/* Badge */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
            <a
              href="https://github.com/arcabotai/a3stack"
              target="_blank"
              rel="noopener"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 14px",
                borderRadius: 100,
                background: "rgba(251,191,36,0.08)",
                border: "1px solid rgba(251,191,36,0.2)",
                color: "#fbbf24",
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "'JetBrains Mono', monospace",
                textDecoration: "none",
                transition: "all 0.2s",
                letterSpacing: "0.02em",
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fbbf24", display: "inline-block" }} />
              Built by arcabot.ai · Open source on GitHub
              <ExternalLink size={10} />
            </a>
          </div>

          {/* Title */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <h1 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(2.8rem, 6vw, 4.5rem)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
              color: "#f1f5f9",
              marginBottom: 12,
            }}>
              Give your AI agent an{" "}
              <span className="gradient-text">identity</span>
              ,<br />
              a <span className="gradient-text">wallet</span>
              , and an <span className="gradient-text">API</span>
            </h1>
            <p style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "1.5rem",
              fontWeight: 600,
              color: "#94a3b8",
              letterSpacing: "-0.02em",
            }}>
              — in one SDK
            </p>
          </div>

          {/* Subtitle */}
          <p style={{
            textAlign: "center",
            color: "#8291a5",
            fontSize: 17,
            lineHeight: 1.7,
            maxWidth: 560,
            margin: "0 auto 40px",
          }}>
            A3Stack connects gasless smart accounts, ERC-8004 identity, x402 payments, and MCP data
            into a unified infrastructure layer for AI agents.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", marginBottom: 64 }}>
            <a
              href="/getting-started"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 24px",
                background: "#fbbf24",
                color: "#06090f",
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 700,
                fontFamily: "'Syne', sans-serif",
                textDecoration: "none",
                transition: "all 0.15s",
              }}
            >
              Get Started <ArrowRight size={16} />
            </a>
            <a
              href="/core"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 24px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--border-bright)",
                color: "#e2e8f0",
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 600,
                textDecoration: "none",
                transition: "all 0.15s",
              }}
            >
              API Reference
            </a>
            <a
              href="https://www.npmjs.com/package/@a3stack/core"
              target="_blank"
              rel="noopener"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 24px",
                background: "transparent",
                border: "1px solid var(--border)",
                color: "#8291a5",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 500,
                fontFamily: "'JetBrains Mono', monospace",
                textDecoration: "none",
                transition: "all 0.15s",
              }}
            >
              npm install @a3stack/core
            </a>
          </div>

          {/* Hero Code */}
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <CodeBlock code={HERO_CODE} lang="typescript" filename="agent.ts" />
            <CodeBlock code={CLIENT_CODE} lang="typescript" filename="client.ts" />
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section style={{
        padding: "80px 24px",
        background: "var(--bg-surface)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
            <div>
              <div style={{ marginBottom: 16 }}>
                <span className="pill pill-gold">The Problem</span>
              </div>
              <h2 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "2rem",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "#f1f5f9",
                marginBottom: 20,
              }}>
                Agent infra is<br />fragmented
              </h2>
              <p style={{ color: "#94a3b8", fontSize: 15, lineHeight: 1.8, marginBottom: 16 }}>
                Three critical layers are being built by different teams with no coordination.
                None of them talk to each other.
              </p>
              <p style={{ color: "#8291a5", fontSize: 15, lineHeight: 1.8 }}>
                Without A3Stack, you're duct-taping together identity, payment, and MCP solutions separately.
                With A3Stack: <code style={{ color: "#fbbf24", fontSize: 13 }}>new A3Stack({"{ privateKey, chainId }"})</code> and you're live.
              </p>
            </div>
            <div>
              {[
                { layer: "Identity", tech: "ERC-8004 (on-chain agent registration)", status: "22 EVM chains + Solana", icon: Shield, color: "#34d399" },
                { layer: "Payments", tech: "x402 protocol, Circle USDC", status: "packages exist, no agent integration", icon: CreditCard, color: "#fbbf24" },
                { layer: "Data", tech: "MCP servers, onchain oracles", status: "SDK exists, no identity/payment layer", icon: Database, color: "#60a5fa" },
              ].map((row) => (
                <div
                  key={row.layer}
                  style={{
                    display: "flex",
                    gap: 16,
                    padding: "20px",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    marginBottom: 12,
                  }}
                >
                  <row.icon size={20} style={{ color: row.color, flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "#e2e8f0", marginBottom: 4 }}>
                      {row.layer}
                    </div>
                    <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 4 }}>{row.tech}</div>
                    <div style={{ fontSize: 12, color: "#ef4444", fontFamily: "'JetBrains Mono', monospace" }}>
                      ✗ {row.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Three Pillars */}
      <section style={{ padding: "96px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ marginBottom: 12 }}>
              <span className="pill pill-gold">The Solution</span>
            </div>
            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "2.2rem",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#f1f5f9",
              marginBottom: 14,
            }}>
              Three layers. One SDK.
            </h2>
            <p style={{ color: "#94a3b8", maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
              Each package works standalone. Together they give your agent everything it needs to participate in the agent economy.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
            {pillars.map((pillar) => (
              <a
                key={pillar.label}
                href={pillar.href}
                className="card-hover"
                style={{
                  display: "block",
                  padding: "32px",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: 14,
                  textDecoration: "none",
                }}
              >
                <div style={{ marginBottom: 20 }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    background: pillar.bg,
                    border: `1px solid ${pillar.border}`,
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}>
                    <pillar.icon size={20} style={{ color: pillar.color }} />
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 10,
                      color: pillar.color,
                      background: pillar.bg,
                      border: `1px solid ${pillar.border}`,
                      padding: "2px 8px",
                      borderRadius: 4,
                      letterSpacing: "0.04em",
                    }}>
                      {pillar.badge}
                    </span>
                  </div>
                  <h3 style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: "1.15rem",
                    fontWeight: 700,
                    color: "#f1f5f9",
                    marginBottom: 10,
                  }}>
                    {pillar.title}
                  </h3>
                  <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
                    {pillar.description}
                  </p>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px" }}>
                  {pillar.items.map((item) => (
                    <li key={item} style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 13,
                      color: "#8291a5",
                      marginBottom: 8,
                    }}>
                      <CheckCircle2 size={12} style={{ color: pillar.color, flexShrink: 0 }} />
                      {item}
                    </li>
                  ))}
                </ul>
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  color: pillar.color,
                }}>
                  Read docs <ArrowRight size={12} />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{
        padding: "80px 24px",
        background: "var(--bg-surface)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ marginBottom: 12 }}>
              <span className="pill pill-blue">How it works</span>
            </div>
            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "2rem",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#f1f5f9",
              marginBottom: 14,
            }}>
              Agent A → Agent B in 6 steps
            </h2>
            <p style={{ color: "#94a3b8", maxWidth: 480, margin: "0 auto" }}>
              The full flow from discovery to paid tool call, handled automatically by A3Stack.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {timeline.map((item) => (
              <div
                key={item.step}
                style={{
                  padding: "20px 24px",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  display: "flex",
                  gap: 14,
                  alignItems: "flex-start",
                }}
              >
                <div className="step-number">{item.step}</div>
                <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.6, margin: 0, paddingTop: 3 }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "1.8rem",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#f1f5f9",
              marginBottom: 12,
            }}>
              Install what you need
            </h2>
            <p style={{ color: "#94a3b8" }}>
              All packages on npm. Use modular imports or grab everything via core.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, maxWidth: 1000, margin: "0 auto" }}>
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                style={{
                  padding: "20px 24px",
                  background: (pkg as any).highlight ? "rgba(167,139,250,0.06)" : "var(--bg-card)",
                  border: (pkg as any).highlight ? "1px solid rgba(167,139,250,0.2)" : "1px solid var(--border)",
                  borderRadius: 10,
                }}
              >
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 13,
                  fontWeight: 500,
                  color: (pkg as any).highlight ? "#a78bfa" : "#fbbf24",
                  marginBottom: 6,
                }}>
                  {pkg.name}
                </div>
                <p style={{ color: "#8291a5", fontSize: 13, margin: "0 0 14px" }}>{pkg.desc}</p>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12,
                  color: "#8291a5",
                  background: "var(--bg-code)",
                  padding: "6px 12px",
                  borderRadius: 6,
                  border: "1px solid var(--border)",
                }}>
                  {pkg.cmd}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section style={{
        padding: "80px 24px",
        background: "linear-gradient(135deg, rgba(251,191,36,0.04) 0%, rgba(6,9,15,0) 60%)",
        borderTop: "1px solid var(--border)",
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <div style={{
            width: 56,
            height: 56,
            background: "linear-gradient(135deg, #fbbf24, #d97706)",
            borderRadius: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
          }}>
            <Zap size={24} style={{ color: "#06090f" }} />
          </div>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "2.2rem",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            color: "#f1f5f9",
            marginBottom: 16,
          }}>
            Ship a paid agent in 5 minutes
          </h2>
          <p style={{ color: "#94a3b8", fontSize: 16, lineHeight: 1.7, marginBottom: 36, maxWidth: 500, margin: "0 auto 36px" }}>
            Follow the quick start guide to build an agent that accepts payments,
            proves its identity on-chain, and exposes tools via MCP.
          </p>
          <div className="cta-row" style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <a
              href="/getting-started"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 28px",
                background: "#fbbf24",
                color: "#06090f",
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 700,
                fontFamily: "'Syne', sans-serif",
                textDecoration: "none",
              }}
            >
              <Terminal size={16} />
              Quick Start Guide
            </a>
            <a
              href="https://github.com/arcabotai/a3stack/tree/main/examples"
              target="_blank"
              rel="noopener"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 28px",
                background: "transparent",
                border: "1px solid var(--border-bright)",
                color: "#e2e8f0",
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              View Examples <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
