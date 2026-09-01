
import DocLayout from "@/components/DocLayout";
import CodeBlock, { TerminalBlock } from "@/components/CodeBlock";
import { ArrowRight } from "lucide-react";


const INSTALL_ALL = `npm install @a3stack/core viem @x402/fetch @x402/evm @modelcontextprotocol/sdk zod`;

const INSTALL_MODULAR = `# Just identity (read-only, no wallet needed)
npm install @a3stack/identity viem

# Identity + payments
npm install @a3stack/identity @a3stack/payments viem @x402/fetch @x402/evm

# Full stack
npm install @a3stack/core viem @x402/fetch @x402/evm @modelcontextprotocol/sdk zod`;

const VERIFY_CODE = `import { verifyAgent } from "@a3stack/identity";

const result = await verifyAgent("eip155:8453:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432#2376");

console.log(result.valid);                   // true
console.log(result.owner);                   // "0x1be93C..."
console.log(result.registration?.name);      // "Arca"
console.log(result.registration?.services);  // [{ name: "MCP", endpoint: "..." }]`;

const PROBE_CODE = `import { probeAgent } from "@a3stack/core";

// Discover what an agent offers before connecting (no wallet needed)
const info = await probeAgent("eip155:8453:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432#2376");

console.log(info.verified);          // true
console.log(info.endpoints.mcp);     // "https://mcp.arcabot.ai/mcp"
console.log(info.acceptsPayment);    // true
console.log(info.services);          // [{ name: "MCP", endpoint: "..." }]`;

const SERVER_CODE = `import { createAgentMcpServer } from "@a3stack/data";
import { z } from "zod";

const server = createAgentMcpServer({
  name: "MyAgent",
  payment: {
    payTo: "0xYourWallet...",
    amount: "1000",   // 0.001 USDC per call
  },
});

server.tool("hello", { name: z.string() }, async ({ name }) => ({
  content: [{ type: "text", text: \`Hello, \${name}!\` }],
}));

const { url } = await server.listen(3000);
console.log(\`Serving at \${url}\`);
// → http://localhost:3000/mcp`;

const CLIENT_CODE = `import { createAgentMcpClient } from "@a3stack/data";
import { privateKeyToAccount } from "viem/accounts";

const account = privateKeyToAccount(process.env.PRIVATE_KEY);

const client = await createAgentMcpClient({
  agentId: "eip155:8453:0x8004...#42",   // Target agent's global ID
  payer: { account, maxAmount: "10000" }, // max 0.01 USDC auto-pay
});

const result = await client.callTool("hello", { name: "world" });
// Payment happened automatically via x402 ✓
await client.close();`;

const REGISTER_CODE = `import { AgentIdentity } from "@a3stack/identity";
import { base } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

const account = privateKeyToAccount(process.env.PRIVATE_KEY);
const identity = new AgentIdentity({ account, chain: base });

// Check if already registered
const { registered } = await identity.isRegistered();
if (registered) {
  console.log("Already registered!");
  return;
}

// Register on-chain (one-time, costs gas ~$0.01 on Base)
const { agentId, globalId, txHash } = await identity.register({
  name: "MyAgent",
  description: "My AI agent built with A3Stack",
  services: [
    { name: "MCP", endpoint: "https://mcp.myagent.com/mcp", version: "2025-06-18" },
  ],
  x402Support: true,
  active: true,
});

console.log(\`Global ID: \${globalId}\`);
// → "eip155:8453:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432#42"`;

export default function GettingStarted() {

  return (
    <DocLayout
      title="Getting Started"
      description="Ship a fully capable paid AI agent service in under 5 minutes."
      currentPath="/getting-started"
      pill={{ label: "Quick Start", color: "gold" }}
    >
      {/* Prerequisites */}
      <h2>Prerequisites</h2>
      <p>You'll need:</p>
      <ul>
        <li>Node.js 18+ and npm</li>
        <li>A wallet private key (any EVM wallet)</li>
        <li>A small amount of ETH on Base for registration (~$0.01)</li>
        <li>USDC on Base if you want to pay agents (optional for read-only use)</li>
      </ul>

      <div style={{
        padding: "16px 20px",
        background: "rgba(251,191,36,0.06)",
        border: "1px solid rgba(251,191,36,0.15)",
        borderRadius: 8,
        marginBottom: 24,
      }}>
        <p style={{ color: "#fbbf24", fontWeight: 600, fontSize: 14, margin: "0 0 4px" }}>💡 No wallet? Start read-only</p>
        <p style={{ color: "#94a3b8", fontSize: 14, margin: 0, lineHeight: 1.6 }}>
          You can verify agent identities and probe agents without any wallet — just install <code>@a3stack/identity</code> and call <code>verifyAgent()</code>.
        </p>
      </div>

      {/* Installation */}
      <h2>Installation</h2>
      <p>Install everything at once:</p>
      <TerminalBlock code={INSTALL_ALL} />

      <p>Or install modularly based on what you need:</p>
      <CodeBlock code={INSTALL_MODULAR} lang="bash" />

      {/* Step 1: Verify */}
      <h2>Step 1 — Verify an agent (no wallet needed)</h2>
      <p>
        The simplest thing you can do: verify an existing agent's on-chain identity.
        This reads from the ERC-8004 registry on Base and validates the registration file.
      </p>
      <CodeBlock code={VERIFY_CODE} lang="typescript" filename="verify.ts" />

      {/* Step 2: Probe */}
      <h2>Step 2 — Probe an agent's capabilities</h2>
      <p>
        <code>probeAgent</code> goes one step further: it resolves the MCP endpoint,
        checks what tools are available, and tells you what to expect before connecting.
      </p>
      <CodeBlock code={PROBE_CODE} lang="typescript" filename="probe.ts" />

      {/* Step 3: Build a server */}
      <h2>Step 3 — Build a paid MCP server</h2>
      <p>
        Create an MCP server that charges per tool call. Any agent with a USDC balance can connect and pay automatically.
      </p>
      <CodeBlock code={SERVER_CODE} lang="typescript" filename="server.ts" />

      {/* Step 4: Connect as client */}
      <h2>Step 4 — Connect to an agent as a client</h2>
      <p>
        Connect to any A3Stack MCP server by global ID. The client auto-resolves the endpoint
        and handles payment via x402.
      </p>
      <CodeBlock code={CLIENT_CODE} lang="typescript" filename="client.ts" />

      {/* Step 5: Register */}
      <h2>Step 5 — Register your agent on-chain</h2>
      <p>
        Registration mints an ERC-8004 NFT on Base that represents your agent's on-chain identity.
        This is a one-time transaction (~$0.01 gas on Base).
      </p>
      <CodeBlock code={REGISTER_CODE} lang="typescript" filename="register.ts" />

      <div style={{
        padding: "16px 20px",
        background: "rgba(52,211,153,0.06)",
        border: "1px solid rgba(52,211,153,0.15)",
        borderRadius: 8,
        marginTop: 8,
        marginBottom: 24,
      }}>
        <p style={{ color: "#34d399", fontWeight: 600, fontSize: 14, margin: "0 0 4px" }}>✓ After registration</p>
        <p style={{ color: "#94a3b8", fontSize: 14, margin: 0, lineHeight: 1.6 }}>
          Your agent gets a global ID like <code>eip155:8453:0x8004...#42</code>.
          Share it so other agents can verify your identity and connect to your MCP server.
        </p>
      </div>

      {/* What's next */}
      <h2>What's next</h2>
      <div className="responsive-grid doc-card-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 4 }}>
        {[
          { href: "/identity/", label: "Identity deep dive", desc: "ERC-8004 API reference, multi-chain, verification" },
          { href: "/payments/", label: "Payments reference", desc: "PaymentClient, PaymentServer, x402 flow" },
          { href: "/data/", label: "Data / MCP docs", desc: "Server, client, probeAgent, payment gating" },
          { href: "/examples/", label: "All examples", desc: "6 complete example files with annotations" },
        ].map((card) => (
          <a
            key={card.href}
            href={card.href}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 18px",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              textDecoration: "none",
              transition: "all 0.15s",
            }}
          >
            <div>
              <div style={{ fontWeight: 600, color: "#e2e8f0", fontSize: 14, marginBottom: 3 }}>{card.label}</div>
              <div style={{ color: "#64748b", fontSize: 12 }}>{card.desc}</div>
            </div>
            <ArrowRight size={14} style={{ color: "#fbbf24", flexShrink: 0 }} />
          </a>
        ))}
      </div>
    </DocLayout>
  );
}
