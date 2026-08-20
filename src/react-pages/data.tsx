
import DocLayout from "@/components/DocLayout";
import CodeBlock from "@/components/CodeBlock";


const MCP_SERVER_BASIC = `import { createAgentMcpServer } from "@a3stack/data";
import { z } from "zod";

const server = createAgentMcpServer({
  name: "MarketDataAgent",
  version: "1.0.0",
  port: 3000,          // default: 3000

  // Identity: expose your ERC-8004 registration as agent://identity resource
  identity: {
    chainId: 8453,     // Base
    agentId: 42,       // your registered agent ID
  },

  // Payment gating: require USDC per tool call
  payment: {
    payTo: "0xYourWallet...",
    amount: "1000",            // 0.001 USDC
    asset: USDC_BASE,
    network: "eip155:8453",
    description: "MarketDataAgent: 0.001 USDC per call",
    freeTools: ["ping"],       // these tools are always free
  },
});`;

const MCP_SERVER_TOOLS = `import { z } from "zod";

// Register tools (MCP API passthrough)
server.tool(
  "get-price",
  "Get the current price of a cryptocurrency",
  { symbol: z.string().describe("Token symbol, e.g. ETH, BTC") },
  async ({ symbol }) => ({
    content: [{ type: "text", text: JSON.stringify({ symbol, price: 2800 }) }],
  })
);

server.tool(
  "analyze-token",
  "Get detailed analysis for a token",
  {
    symbol: z.string(),
    depth: z.enum(["basic", "detailed"]).default("basic"),
  },
  async ({ symbol, depth }) => ({
    content: [{ type: "text", text: \`Analysis for \${symbol} (\${depth})\` }],
  })
);

// Start server
const { url } = await server.listen();
console.log(\`Serving at \${url}\`);
// → http://localhost:3000/mcp`;

const MCP_CLIENT_BY_ID = `import { createAgentMcpClient } from "@a3stack/data";
import { privateKeyToAccount } from "viem/accounts";

const account = privateKeyToAccount(process.env.PRIVATE_KEY);

// Connect by ERC-8004 global ID (recommended)
// Auto-resolves endpoint, verifies identity, auto-pays x402
const client = await createAgentMcpClient({
  agentId: "eip155:8453:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432#2376",
  payer: {
    account,
    maxAmount: "100000", // max 0.10 USDC auto-pay per session
  },
});`;

const MCP_CLIENT_BY_URL = `// Connect by direct URL (no identity check, no auto-payment)
const client = await createAgentMcpClient({
  url: "https://mcp.someagent.ai/mcp",
});`;

const MCP_CLIENT_USAGE = `// List available tools
const tools = await client.listTools();
tools.forEach(t => console.log(\`- \${t.name}: \${t.description}\`));

// Call a tool (auto-pays if required)
const result = await client.callTool("get-price", { symbol: "ETH" });
const data = JSON.parse(result.content[0].text);
console.log(data.price); // 2800

// Read the agent's identity resource
const identity = await client.getAgentIdentity();
console.log(identity?.name);      // "MarketDataAgent"
console.log(identity?.services);  // [{ name: "MCP", ... }]

// Close when done
await client.close();`;

const PROBE_CODE = `import { probeAgent } from "@a3stack/core";

// Discover an agent without connecting (no wallet needed)
const info = await probeAgent("eip155:8453:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432#2376");

console.log(info.verified);           // true — on-chain verified
console.log(info.owner);              // "0x1be93C..."
console.log(info.endpoints.mcp);      // "https://mcp.arcabot.ai/mcp"
console.log(info.endpoints.a2a);      // null (not configured)
console.log(info.acceptsPayment);     // true
console.log(info.services);           // [{ name: "MCP", endpoint: "...", version: "..." }]
console.log(info.registrations);      // cross-chain IDs`;

const FREE_TOOLS_CODE = `// Free tools are always served without payment check
const server = createAgentMcpServer({
  name: "MyAgent",
  payment: {
    payTo: "0x...",
    amount: "10000",
    freeTools: ["ping", "health", "info"],  // these bypass payment gate
  },
});

// "ping" is automatically registered as a free tool
// It returns: { status: "ok", requiresPayment: true, freeTools: [...] }`;

const IDENTITY_RESOURCE_CODE = `// When identity config is set, the server auto-exposes:
// Resource: agent://identity
//
// Clients can read it with:
const identity = await client.getAgentIdentity();
// Returns the full AgentRegistration from ERC-8004

// The resource URI is: "agent://identity"
// content-type: application/json`;

export default function DataPage() {

  return (
    <DocLayout
      title="Data / MCP"
      description="MCP server and client with built-in identity verification and payment gating. Expose tools only verified, paying agents can use."
      currentPath="/data"
      pill={{ label: "@a3stack/data", color: "blue" }}
    >
      <h2>What is MCP?</h2>
      <p>
        MCP (Model Context Protocol) is Anthropic's open protocol for AI tool calls.
        It lets any AI client call functions exposed by any MCP server over HTTP.
      </p>
      <p>
        <code>@a3stack/data</code> wraps the official MCP SDK and adds:
      </p>
      <ul>
        <li><strong>Identity layer</strong> — expose your ERC-8004 registration as an <code>agent://identity</code> resource</li>
        <li><strong>Payment gating</strong> — require x402 payment before serving tool calls</li>
        <li><strong>Auto-resolving client</strong> — connect by global ID instead of hardcoded URL</li>
        <li><strong>Auto-payment</strong> — client pays x402 automatically, no manual flow</li>
      </ul>

      <h2>MCP Server</h2>
      <h3>createAgentMcpServer()</h3>
      <CodeBlock code={MCP_SERVER_BASIC} lang="typescript" />
      <CodeBlock code={MCP_SERVER_TOOLS} lang="typescript" />

      <h3>server.listen()</h3>
      <p>
        Returns <code>{"{ url, app, transport }"}</code>. The server runs at
        <code>http://localhost:{"{port}"}/mcp</code> by default.
      </p>

      <h3>Free tools</h3>
      <p>Some tools can bypass the payment gate (e.g. health checks, ping):</p>
      <CodeBlock code={FREE_TOOLS_CODE} lang="typescript" />

      <h3>Identity resource</h3>
      <CodeBlock code={IDENTITY_RESOURCE_CODE} lang="typescript" />

      <h2>MCP Client</h2>
      <h3>createAgentMcpClient()</h3>
      <p>Connect by global ID (recommended — auto-resolves, auto-pays):</p>
      <CodeBlock code={MCP_CLIENT_BY_ID} lang="typescript" />
      <p>Connect by URL directly:</p>
      <CodeBlock code={MCP_CLIENT_BY_URL} lang="typescript" />

      <h3>Client methods</h3>
      <CodeBlock code={MCP_CLIENT_USAGE} lang="typescript" />

      <h2>probeAgent()</h2>
      <p>
        Discover what an agent offers before connecting. No wallet needed — read-only.
      </p>
      <CodeBlock code={PROBE_CODE} lang="typescript" />

      <h2>Server config reference</h2>
      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr><th>Option</th><th>Type</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr><td><code>name</code></td><td><code>string</code></td><td>MCP server name</td></tr>
            <tr><td><code>version</code></td><td><code>string</code></td><td>Server version</td></tr>
            <tr><td><code>port</code></td><td><code>number</code></td><td>HTTP port (default: 3000)</td></tr>
            <tr><td><code>identity.chainId</code></td><td><code>number</code></td><td>Chain for ERC-8004 lookup</td></tr>
            <tr><td><code>identity.agentId</code></td><td><code>number</code></td><td>Your registered agent token ID</td></tr>
            <tr><td><code>payment.payTo</code></td><td><code>string</code></td><td>Wallet receiving USDC</td></tr>
            <tr><td><code>payment.amount</code></td><td><code>string</code></td><td>USDC amount in base units</td></tr>
            <tr><td><code>payment.network</code></td><td><code>string</code></td><td>CAIP-2 network (default: eip155:8453)</td></tr>
            <tr><td><code>payment.freeTools</code></td><td><code>string[]</code></td><td>Tool names exempt from payment</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Client config reference</h2>
      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr><th>Option</th><th>Type</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr><td><code>agentId</code></td><td><code>string</code></td><td>ERC-8004 global ID (auto-resolves URL)</td></tr>
            <tr><td><code>url</code></td><td><code>string</code></td><td>Direct MCP endpoint URL</td></tr>
            <tr><td><code>payer.account</code></td><td><code>Account</code></td><td>viem Account for signing payments</td></tr>
            <tr><td><code>payer.maxAmount</code></td><td><code>string</code></td><td>Max USDC to auto-pay per session</td></tr>
          </tbody>
        </table>
      </div>
    </DocLayout>
  );
}
