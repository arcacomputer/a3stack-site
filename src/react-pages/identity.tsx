
import DocLayout from "@/components/DocLayout";
import CodeBlock, { TerminalBlock } from "@/components/CodeBlock";


const AGENT_IDENTITY_CODE = `import { AgentIdentity } from "@a3stack/identity";
import { base } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

const account = privateKeyToAccount(process.env.PRIVATE_KEY);
const identity = new AgentIdentity({
  account,
  chain: base,
  rpc: "https://mainnet.base.org", // optional
  // registry: "0x8004...",         // optional, uses default
});`;

const REGISTER_CODE = `const { agentId, globalId, txHash } = await identity.register({
  name: "MyAgent",
  description: "An AI agent that does X",
  image: "https://example.com/agent-logo.png",  // optional
  services: [
    {
      name: "MCP",
      endpoint: "https://mcp.myagent.ai/mcp",
      version: "2025-06-18",
    },
    {
      name: "web",
      endpoint: "https://myagent.ai",
    },
  ],
  x402Support: true,    // accepts x402 payments
  active: true,
  supportedTrust: ["reputation"], // optional
});

// globalId: "eip155:8453:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432#42"
console.log(\`Registered! ID: \${globalId}\`);
console.log(\`Tx: https://basescan.org/tx/\${txHash}\`);`;

const IS_REGISTERED_CODE = `const { registered, agentId } = await identity.isRegistered();

if (registered) {
  console.log(\`Already registered as #\${agentId}\`);
} else {
  console.log("Not yet registered on this chain");
}`;

const SET_URI_CODE = `// Update your registration after deploy (e.g., new MCP endpoint)
await identity.setAgentURI(agentId, "https://new-uri.com/agent.json");`;

const SET_PAYMENT_CODE = `// Link a separate payment wallet to your agent
// (proves control of newWallet via EIP-712 signature)
const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour
await identity.setPaymentWallet(agentId, "0xNewWallet...", deadline, signature);

// Get the current payment wallet
const wallet = await identity.getPaymentWallet(agentId);`;

const VERIFY_CODE = `import { verifyAgent } from "@a3stack/identity";

// Verify by global agent ID (recommended)
const result = await verifyAgent("eip155:8453:0x8004...#2376");

console.log(result.valid);                         // true / false
console.log(result.owner);                         // "0x1be93C..."
console.log(result.paymentWallet);                 // null (defaults to owner)
console.log(result.registration);                  // full AgentRegistration
console.log(result.registration?.services);        // [{ name: "MCP", ... }]
console.log(result.registration?.x402Support);     // true

// On failure:
console.log(result.error);  // e.g., "agentId mismatch in back-reference"`;

const VERIFY_FORMS_CODE = `// Verify by chain + numeric agentId
const result = await verifyAgent({ chain: base, agentId: 2376 });

// Find all agents by owner wallet
import { findAgentsByOwner } from "@a3stack/identity";
const agents = await findAgentsByOwner("0x1be93C...", { chain: base });`;

const PARSE_CODE = `import { parseAgentId } from "@a3stack/identity";

const ref = parseAgentId("eip155:8453:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432#2376");
// {
//   namespace: "eip155",
//   chainId: 8453,
//   registry: "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432",
//   agentId: 2376
// }`;

const ENDPOINTS_CODE = `import { getMcpEndpoint, getA2aEndpoint } from "@a3stack/identity";

const mcpUrl = await getMcpEndpoint("eip155:8453:0x8004...#2376");
// "https://mcp.arcabot.ai/mcp"

const a2aUrl = await getA2aEndpoint("eip155:8453:0x8004...#2376");
// null (if not configured)`;

const MULTICHAIN_CODE = `import { findAllRegistrations } from "@a3stack/core";

// Find all registrations across all supported chains for a wallet
const regs = await findAllRegistrations("0x1be93C...");
// [
//   { chainName: "Base", chainId: 8453, agentId: 2376, globalId: "eip155:8453:..." },
//   { chainName: "Ethereum", chainId: 1, agentId: 88, globalId: "eip155:1:..." },
//   ...
// ]`;

const DISCOVER_CODE = `import { AgentDiscovery } from "@a3stack/identity";

const discovery = new AgentDiscovery({
  chainId: 8453,          // Base
  rpcUrl: "https://base-mainnet.g.alchemy.com/v2/YOUR_KEY",
});

// Search agents across the ecosystem (subgraph-indexed)
const agents = await discovery.search({ name: "weather" });

// Search with reputation filter
const trusted = await discovery.search({
  feedback: { minValue: 80 },
  active: true,
});`;

const REPUTATION_CODE = `// Get reputation summary for an agent
const rep = await discovery.getReputation("8453:102");
console.log(\`Score: \${rep.averageValue}/100 (\${rep.count} reviews)\`);

// Get detailed feedback entries
const reviews = await discovery.getFeedback("1:22775");
for (const r of reviews) {
  console.log(\`\${r.value}/100 by \${r.reviewer} — [\${r.tags.join(", ")}]\`);
}`;

const DISCOVERY_VIA_CORE_CODE = `import { A3Stack } from "@a3stack/core";

// Integrated into the main A3Stack class
const stack = new A3Stack({ account, chain: base, rpc: "..." });

const agents = await stack.discover({ name: "weather" });
const rep = await stack.reputation("8453:102");
const reviews = await stack.feedback("1:22775");`;

const DISCOVERY_STANDALONE_CODE = `import { discoverAgents } from "@a3stack/identity";

const agents = await discoverAgents({
  chain: base,
  filter: {
    hasService: "MCP",      // has an MCP endpoint
    x402Support: true,       // accepts payments
    active: true,
  }
});
// Returns AgentRegistration[] with resolved registration files`;

const TYPES_CODE = `interface AgentRegistration {
  type: string;
  name: string;
  description: string;
  image?: string;
  services: AgentService[];
  x402Support: boolean;
  active: boolean;
  registrations: AgentRef[];       // cross-chain registrations
  supportedTrust?: string[];
}

interface AgentService {
  name: string;       // "MCP" | "A2A" | "web" | "ENS" | ...
  endpoint: string;
  version?: string;
  skills?: string[];
  domains?: string[];
}

interface AgentRef {
  namespace: string;       // "eip155"
  chainId: number;         // 8453
  registry: \`0x\${string}\`;
  agentId: number;
}

interface VerificationResult {
  valid: boolean;
  agentId: number;
  owner: string;
  paymentWallet: string | null;
  registration: AgentRegistration | null;
  error?: string;
}`;

const CHAINS_TABLE = [
  ["Ethereum", "1", "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432"],
  ["Base", "8453", "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432"],
  ["Optimism", "10", "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432"],
  ["Arbitrum", "42161", "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432"],
  ["Polygon", "137", "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432"],
  ["BNB Chain", "56", "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432"],
  ["Gnosis", "100", "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432"],
  ["Celo", "42220", "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432"],
  ["Linea", "59144", "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432"],
  ["Scroll", "534352", "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432"],
  ["Taiko", "167000", "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432"],
  ["Avalanche", "43114", "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432"],
  ["Mantle", "5000", "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432"],
  ["Metis", "1088", "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432"],
  ["Abstract", "2741", "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432"],
  ["Monad", "143", "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432"],
  ["X Layer", "196", "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432"],
  ["GOAT Network", "2345", "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432"],
  ["Shape", "360", "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432"],
  ["MegaETH", "4326", "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432"],
  ["Injective EVM", "1776", "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432"],
  ["SKALE Base", "1187947933", "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432"],
];

export default function IdentityPage() {

  return (
    <DocLayout
      title="Identity"
      description="Verifiable on-chain agent identity via ERC-8004. Register your agent, verify others, discover, and check reputation across 22 EVM chains."
      currentPath="/identity"
      pill={{ label: "@a3stack/identity", color: "green" }}
    >
      <h2>What is ERC-8004?</h2>
      <p>
        ERC-8004 is an Ethereum standard for registering AI agent identities on-chain.
        Each agent is an ERC-721 NFT stored on a registry contract.
        The NFT points to a JSON registration file containing the agent's name, services, and cross-chain registrations.
      </p>
      <p>
        When Agent A wants to connect to Agent B, it looks up B's global ID on-chain,
        fetches the registration file, verifies the back-reference, and extracts the MCP endpoint.
        This is the foundation of trustless agent-to-agent communication.
      </p>

      <div style={{
        padding: "16px 20px",
        background: "rgba(52,211,153,0.06)",
        border: "1px solid rgba(52,211,153,0.15)",
        borderRadius: 8,
        marginBottom: 24,
      }}>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#34d399", margin: "0 0 4px" }}>
          Global ID format
        </p>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: "#e2e8f0", margin: 0 }}>
          eip155:{"{chainId}"}:{"{registry}"}#{"{agentId}"}
        </p>
        <p style={{ fontSize: 12, color: "#8291a5", margin: "8px 0 0", fontFamily: "'JetBrains Mono', monospace" }}>
          Example: eip155:8453:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432#2376
        </p>
      </div>

      <h2>AgentIdentity class</h2>
      <p>
        The <code>AgentIdentity</code> class handles registration and updates for a specific wallet on one chain.
      </p>
      <CodeBlock code={AGENT_IDENTITY_CODE} lang="typescript" />

      <h3>register()</h3>
      <p>Register your agent on-chain. One-time transaction per chain (~$0.01 gas on Base).</p>
      <CodeBlock code={REGISTER_CODE} lang="typescript" />

      <h3>isRegistered()</h3>
      <CodeBlock code={IS_REGISTERED_CODE} lang="typescript" />

      <h3>setAgentURI()</h3>
      <CodeBlock code={SET_URI_CODE} lang="typescript" />

      <h3>setPaymentWallet()</h3>
      <p>
        Link a separate payment wallet to your agent identity. Useful if your signing key and payment key are different.
      </p>
      <CodeBlock code={SET_PAYMENT_CODE} lang="typescript" />

      <h2>Verification</h2>

      <h3>verifyAgent()</h3>
      <p>
        Verify any agent by global ID. This reads from the registry, fetches the registration file,
        and validates the back-reference (agentId + registry match).
      </p>
      <CodeBlock code={VERIFY_CODE} lang="typescript" />

      <h3>Alternative forms</h3>
      <CodeBlock code={VERIFY_FORMS_CODE} lang="typescript" />

      <h2>Discovery &amp; Reputation</h2>
      <p>
        A3Stack integrates the <a href="https://sdk.ag0.xyz" target="_blank" rel="noopener">ag0 SDK</a> for
        cross-chain agent discovery and reputation. Search the entire ERC-8004 ecosystem,
        check reputation scores, and read feedback — all indexed via subgraph.
      </p>

      <div style={{
        padding: "16px 20px",
        background: "rgba(139,92,246,0.06)",
        border: "1px solid rgba(139,92,246,0.15)",
        borderRadius: 8,
        marginBottom: 24,
      }}>
        <p style={{ fontSize: 13, color: "#a78bfa", margin: 0, fontWeight: 600 }}>
          🏗️ Compose, don&apos;t compete
        </p>
        <p style={{ fontSize: 12, color: "#94a3b8", margin: "8px 0 0" }}>
          A3Stack handles <strong>registration + gasless + payments</strong>.
          ag0 handles <strong>discovery + reputation</strong>.
          Each layer is best-in-class.
        </p>
      </div>

      <h3>AgentDiscovery</h3>
      <p>
        Search for agents and check reputation. Read-only — no wallet needed.
      </p>
      <CodeBlock code={DISCOVER_CODE} lang="typescript" />

      <h3>Reputation &amp; Feedback</h3>
      <p>
        Get reputation scores and detailed feedback entries for any agent.
      </p>
      <CodeBlock code={REPUTATION_CODE} lang="typescript" />

      <h3>Via A3Stack core</h3>
      <p>
        Discovery is also available directly on the <code>A3Stack</code> class.
      </p>
      <CodeBlock code={DISCOVERY_VIA_CORE_CODE} lang="typescript" />

      <h2>Utilities</h2>

      <h3>parseAgentId()</h3>
      <CodeBlock code={PARSE_CODE} lang="typescript" />

      <h3>getMcpEndpoint() / getA2aEndpoint()</h3>
      <CodeBlock code={ENDPOINTS_CODE} lang="typescript" />

      <h3>findAllRegistrations()</h3>
      <p>Find all ERC-8004 registrations for a wallet across all supported chains.</p>
      <CodeBlock code={MULTICHAIN_CODE} lang="typescript" />

      <h3>discoverAgents() (legacy)</h3>
      <p>On-chain discovery (slower than subgraph). Prefer <code>AgentDiscovery</code> above.</p>
      <CodeBlock code={DISCOVERY_STANDALONE_CODE} lang="typescript" />

      <h2>Type Reference</h2>
      <CodeBlock code={TYPES_CODE} lang="typescript" />

      <h2>Supported EVM Chains (22)</h2>
      <p>
        The registry contract is deployed at the same address on all listed EVM chains.
        Arca is registered on 23 chains total: these 22 EVM networks plus Solana.
      </p>
      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr><th>Chain</th><th>Chain ID</th><th>Registry Address</th></tr>
          </thead>
          <tbody>
            {CHAINS_TABLE.map(([chain, id, addr]) => (
              <tr key={id}>
                <td>{chain}</td>
                <td><code>{id}</code></td>
                <td><code style={{ fontSize: 11 }}>{addr}</code></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>CLI verification</h2>
      <p>You can also verify agents from the command line without any code:</p>
      <TerminalBlock code={`npx a3stack verify eip155:8453:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432#2376`} />
      <TerminalBlock code={`npx a3stack lookup 0x1be93C...`} />
    </DocLayout>
  );
}
