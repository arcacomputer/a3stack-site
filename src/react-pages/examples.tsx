
import DocLayout from "@/components/DocLayout";
import CodeBlock from "@/components/CodeBlock";


const examples = [
  {
    title: "Verify an Agent Identity",
    file: "00-verify-identity.ts",
    description: "Read-only — check if an agent is registered on-chain. No wallet needed.",
    code: `import { verifyAgent } from "@a3stack/identity";

const result = await verifyAgent(
  "eip155:8453:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432#2376"
);

console.log(result.valid);                // true
console.log(result.owner);                // "0x1be93C..."
console.log(result.registration?.name);   // "Arca"
console.log(result.registration?.active); // true`,
  },
  {
    title: "Register a New Agent",
    file: "01-register-agent.ts",
    description: "Register your agent on-chain via ERC-8004. Requires a wallet with gas.",
    code: `import { AgentIdentity } from "@a3stack/identity";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";

const identity = new AgentIdentity({
  account: privateKeyToAccount(process.env.PRIVATE_KEY),
  chain: base,
});

const { agentId, globalId, txHash } = await identity.register({
  name: "MyAgent",
  description: "An AI agent built with A3Stack",
  services: [{ name: "MCP", endpoint: "https://myagent.com/mcp" }],
  x402Support: true,
});

console.log("Registered as:", globalId);
// eip155:8453:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432#4521`,
  },
  {
    title: "Paid MCP Server",
    file: "02-paid-mcp-server.ts",
    description: "Serve MCP tools with x402 payment gating. Callers pay per request in USDC.",
    code: `import { A3Stack } from "@a3stack/core";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";
import { z } from "zod";

const agent = new A3Stack({
  account: privateKeyToAccount(process.env.PRIVATE_KEY),
  chain: base,
  server: {
    name: "AnalysisBot",
    payment: { amount: "10000" }, // 0.01 USDC per call
  },
});

agent.tool("analyze", { query: z.string() }, async ({ query }) => ({
  content: [{ type: "text", text: \`Analysis of \${query}: bullish\` }],
}));

await agent.start();
// MCP server running at http://localhost:3000/mcp
// Unauthenticated requests get 402 with payment requirements`,
  },
  {
    title: "MCP Client (Auto-Pay)",
    file: "03-mcp-client.ts",
    description: "Connect to a paid agent and automatically handle x402 payments.",
    code: `import { createAgentMcpClient } from "@a3stack/data";
import { privateKeyToAccount } from "viem/accounts";

const client = await createAgentMcpClient({
  agentId: "eip155:8453:0x8004...#4521",
  payer: {
    account: privateKeyToAccount(process.env.PAYER_KEY),
  },
});

// This automatically:
// 1. Looks up the agent on-chain
// 2. Resolves the MCP endpoint
// 3. Pays 0.01 USDC via x402
// 4. Returns the tool result
const result = await client.callTool("analyze", { query: "ETH" });
console.log(result); // { content: [{ type: "text", text: "Analysis of ETH: bullish" }] }`,
  },
  {
    title: "Full A3Stack",
    file: "04-full-a3stack.ts",
    description: "The all-in-one class — register, serve tools, and accept payments.",
    code: `import { A3Stack } from "@a3stack/core";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";
import { z } from "zod";

const agent = new A3Stack({
  account: privateKeyToAccount(process.env.PRIVATE_KEY),
  chain: base,
  server: {
    name: "DemoAgent",
    payment: { amount: "1000" },
  },
});

// Register on-chain
await agent.register({
  name: "DemoAgent",
  description: "Full-stack demo agent",
  services: [{ name: "MCP", endpoint: "https://demo.agent/mcp" }],
});

// Add tools
agent.tool("greet", { name: z.string() }, async ({ name }) => ({
  content: [{ type: "text", text: \`Hello, \${name}!\` }],
}));

// Start server
await agent.start();
console.log("Agent ID:", agent.globalId);`,
  },
  {
    title: "Agent-to-Agent Payment",
    file: "05-agent-to-agent-payment.ts",
    description: "One agent paying another directly — the core value prop of A3Stack.",
    code: `import { PaymentClient } from "@a3stack/payments";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";

const payer = new PaymentClient({
  account: privateKeyToAccount(process.env.AGENT_B_KEY),
  chain: base,
});

// Agent B pays Agent A for a service call
const receipt = await payer.payForCall(
  "https://agent-a.com/mcp",  // Agent A's MCP endpoint
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "tools/call",
      params: { name: "analyze", arguments: { query: "ETH" } },
    }),
  }
);

console.log("Payment settled:", receipt.status);
console.log("Tool result:", receipt.response);`,
  },
];

export default function ExamplesPage() {

  return (
    <DocLayout
      title="Examples"
      description="Working code for every A3Stack use case — from read-only verification to full paid agent servers."
      currentPath="/examples"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
        {examples.map((ex, i) => (
          <section key={ex.file}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#fbbf24", fontWeight: 600 }}>
                {String(i).padStart(2, "0")}
              </span>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>
                {ex.title}
              </h2>
            </div>
            <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.6, marginBottom: 16, paddingLeft: 32 }}>
              {ex.description}
            </p>
            <CodeBlock code={ex.code} filename={ex.file} />
          </section>
        ))}
      </div>

      <div style={{ marginTop: 48, padding: "20px 24px", background: "rgba(251,191,36,0.04)", borderRadius: 12, border: "1px solid rgba(251,191,36,0.1)" }}>
        <p style={{ color: "#94a3b8", fontSize: 14, margin: 0, lineHeight: 1.6 }}>
          All examples are in the{" "}
          <a href="https://github.com/arcabotai/a3stack/tree/main/examples" target="_blank" rel="noopener" style={{ color: "#fbbf24", textDecoration: "underline", textUnderlineOffset: 3 }}>
            examples/
          </a>{" "}
          directory on GitHub. Clone the repo and run them with <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, background: "rgba(255,255,255,0.06)", padding: "2px 6px", borderRadius: 4, color: "#fbbf24" }}>npx tsx examples/00-verify-identity.ts</code>
        </p>
      </div>
    </DocLayout>
  );
}
