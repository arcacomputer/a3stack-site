
import DocLayout from "@/components/DocLayout";
import CodeBlock from "@/components/CodeBlock";


const INIT_CODE = `import { A3Stack } from "@a3stack/core";
import { base } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { z } from "zod";

const agent = new A3Stack({
  // Identity config
  account: privateKeyToAccount(process.env.PRIVATE_KEY),
  chain: base,
  rpc: "https://mainnet.base.org",  // optional

  // Server config (optional — omit if not serving tools)
  server: {
    name: "MyAgent",
    version: "1.0.0",
    port: 3000,
    payment: {
      amount: "10000",     // 0.01 USDC per call
      // payTo defaults to this wallet
      description: "MyAgent: 0.01 USDC per call",
    },
  },
});`;

const TOOL_CODE = `// Register a tool (same API as MCP SDK)
agent.tool(
  "my-tool",          // tool name
  "Does a thing",     // description
  { input: z.string() },  // input schema (zod)
  async ({ input }) => ({
    content: [{ type: "text", text: \`Result: \${input}\` }],
  })
);`;

const START_CODE = `// Start the MCP server
const { url } = await agent.start();
console.log(\`Serving at \${url}\`);
// → http://localhost:3000/mcp

// Stop when done
await agent.stop();`;

const REGISTER_CODE = `// Register on-chain (one-time, costs gas)
const { agentId, globalId, txHash } = await agent.register({
  name: "MyAgent",
  description: "My paid AI agent service",
  x402Support: true,
  active: true,
  includeServerEndpoint: true,  // auto-adds MCP URL to services
  mcpUrl: "https://mcp.myagent.ai/mcp",  // optional override
});

console.log(\`Global ID: \${globalId}\`);
// → "eip155:8453:0x8004...#42"`;

const CONNECT_CODE = `// Connect to another agent (auto-pays x402 if needed)
const client = await agent.connect("eip155:8453:0x8004...#9999");

const tools = await client.listTools();
const result = await client.callTool("some-tool", { query: "hello" });
const identity = await client.getAgentIdentity();

await client.close();`;

const VERIFY_CODE = `// Verify another agent's on-chain identity
const verification = await agent.verify("eip155:8453:0x8004...#9999");

console.log(verification.valid);              // true / false
console.log(verification.owner);              // "0x..."
console.log(verification.registration?.name); // "SomeAgent"`;

const BALANCE_CODE = `// Check this agent's USDC balance
const balance = await agent.getBalance();
// { amount: 5000000n, formatted: "5.000000", symbol: "USDC" }`;

const MCP_ENDPOINT_CODE = `// Resolve another agent's MCP endpoint
const url = await agent.getMcpEndpoint("eip155:8453:0x8004...#9999");
// "https://mcp.someagent.ai/mcp"`;

const PROBE_CODE = `import { probeAgent } from "@a3stack/core";

// Probe without instantiating A3Stack (no wallet needed)
const info = await probeAgent("eip155:8453:0x8004...#2376");`;

const FIND_CODE = `import { findAllRegistrations } from "@a3stack/core";

// Find all ERC-8004 registrations for a wallet across all supported EVM chains
const regs = await findAllRegistrations("0x1be93C...");`;

const FULL_EXAMPLE_CODE = `import { A3Stack } from "@a3stack/core";
import { base } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { z } from "zod";
import { USDC_BASE } from "@a3stack/payments";

async function main() {
  const account = privateKeyToAccount(process.env.PRIVATE_KEY);

  // Initialize
  const agent = new A3Stack({
    account,
    chain: base,
    server: {
      name: "DemoAgent",
      payment: { amount: "1000", asset: USDC_BASE },
    },
  });

  // Register tools
  agent.tool("hello", { name: z.string().optional() }, async ({ name }) => ({
    content: [{ type: "text", text: \`Hello, \${name ?? "world"}!\` }],
  }));

  // Start serving
  const { url } = await agent.start();
  console.log(\`Agent running at \${url}\`);

  // Check balance
  const balance = await agent.getBalance();
  console.log(\`USDC: \${balance.formatted}\`);

  // Verify another agent
  const check = await agent.verify("eip155:8453:0x8004...#9999");
  if (check.valid) {
    const client = await agent.connect("eip155:8453:0x8004...#9999");
    const result = await client.callTool("some-tool", {});
    console.log(result);
    await client.close();
  }
}

main().catch(console.error);`;

const CONFIG_CODE = `interface A3StackConfig {
  account: Account;              // viem Account (signer)
  chain: Chain;                  // viem Chain (e.g. base)
  rpc?: string;                  // optional RPC URL override

  server?: {
    name: string;
    version?: string;            // default: "1.0.0"
    port?: number;               // default: 3000
    payment?: {
      amount: string;            // USDC base units
      payTo?: string;            // defaults to account.address
      asset?: string;            // defaults to USDC_BASE
      network?: string;          // defaults to "eip155:8453"
      description?: string;
      freeTools?: string[];
    };
  };
}`;

export default function CorePage() {

  return (
    <DocLayout
      title="Core"
      description="The A3Stack class: one object, three capabilities. Identity, payments, and MCP combined."
      currentPath="/core"
      pill={{ label: "@a3stack/core", color: "gold" }}
    >
      <h2>What is @a3stack/core?</h2>
      <p>
        <code>@a3stack/core</code> is the all-in-one package that combines identity,
        payments, and data into a single <code>A3Stack</code> class.
        It also re-exports everything from the other packages, so you can do one install
        and one import.
      </p>
      <p>
        Use <code>A3Stack</code> when you want the simplest possible setup.
        Use the individual packages (<code>@a3stack/identity</code>, etc.)
        when you need more control.
      </p>

      <h2>Initialization</h2>
      <CodeBlock code={INIT_CODE} lang="typescript" />

      <h2>Configuration</h2>
      <CodeBlock code={CONFIG_CODE} lang="typescript" />

      <h2>Methods</h2>

      <h3>agent.tool()</h3>
      <p>Register a tool with the MCP server. Requires <code>server</code> config to be set.</p>
      <CodeBlock code={TOOL_CODE} lang="typescript" />

      <h3>agent.start() / agent.stop()</h3>
      <p>Start or stop the MCP server.</p>
      <CodeBlock code={START_CODE} lang="typescript" />

      <h3>agent.register()</h3>
      <p>Register your agent on-chain via ERC-8004. One-time, costs a small amount of gas.</p>
      <CodeBlock code={REGISTER_CODE} lang="typescript" />

      <h3>agent.connect()</h3>
      <p>Connect to another agent's MCP server by global ID. Returns an MCP client with auto-payment.</p>
      <CodeBlock code={CONNECT_CODE} lang="typescript" />

      <h3>agent.verify()</h3>
      <CodeBlock code={VERIFY_CODE} lang="typescript" />

      <h3>agent.getBalance()</h3>
      <CodeBlock code={BALANCE_CODE} lang="typescript" />

      <h3>agent.getMcpEndpoint()</h3>
      <CodeBlock code={MCP_ENDPOINT_CODE} lang="typescript" />

      <h2>Standalone utilities</h2>
      <p>These are re-exported from the sub-packages and work without instantiating A3Stack:</p>
      <CodeBlock code={PROBE_CODE} lang="typescript" />
      <CodeBlock code={FIND_CODE} lang="typescript" />

      <h2>Full example</h2>
      <CodeBlock code={FULL_EXAMPLE_CODE} lang="typescript" filename="04-full-a3stack.ts" />

      <h2>Package re-exports</h2>
      <p>
        <code>@a3stack/core</code> re-exports everything from the sub-packages.
        You can use it as a single import for everything:
      </p>
      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr><th>Export</th><th>From</th></tr>
          </thead>
          <tbody>
            <tr><td><code>A3Stack</code></td><td>@a3stack/core</td></tr>
            <tr><td><code>probeAgent, findAllRegistrations</code></td><td>@a3stack/core</td></tr>
            <tr><td><code>AgentIdentity, verifyAgent, getMcpEndpoint, ...</code></td><td>@a3stack/identity</td></tr>
            <tr><td><code>createPaymentClient, createPaymentServer, PaymentClient, USDC_BASE, ...</code></td><td>@a3stack/payments</td></tr>
            <tr><td><code>createAgentMcpServer, createAgentMcpClient</code></td><td>@a3stack/data</td></tr>
          </tbody>
        </table>
      </div>
    </DocLayout>
  );
}
