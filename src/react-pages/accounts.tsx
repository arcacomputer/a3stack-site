
import DocLayout from "@/components/DocLayout";
import CodeBlock, { TerminalBlock } from "@/components/CodeBlock";


const INSTALL_CODE = `npm install @a3stack/accounts`;

const QUICK_START_CODE = `import { createAgentAccount } from "@a3stack/accounts";

// Create a gasless smart account on Base
const agent = await createAgentAccount({
  apiKeyId: process.env.CDP_API_KEY_ID!,
  apiKeySecret: process.env.CDP_API_KEY_SECRET!,
  walletSecret: process.env.CDP_WALLET_SECRET!,
}, {
  name: "my-agent",  // idempotent — same name returns same account
});

console.log("Smart account:", agent.address);
console.log("Owner EOA:", agent.ownerAddress);
console.log("Network:", agent.network); // "base"`;

const REGISTER_CODE = `// Register on ERC-8004 with zero gas cost
const result = await agent.register({
  name: "My Agent",
  description: "An autonomous AI agent that does cool things",
  services: [
    { type: "website", url: "https://myagent.ai" },
    { type: "mcp", url: "https://api.myagent.ai/mcp" },
  ],
  x402Support: true,
});

console.log("Tx:", result.transactionHash);
console.log("Gas cost:", result.gasCost);     // 0
console.log("Sponsored:", result.sponsored);  // true`;

const ONE_SHOT_CODE = `import { gaslessRegister } from "@a3stack/accounts";

// One-shot: create account + register in a single call
const result = await gaslessRegister(
  {
    apiKeyId: process.env.CDP_API_KEY_ID!,
    apiKeySecret: process.env.CDP_API_KEY_SECRET!,
    walletSecret: process.env.CDP_WALLET_SECRET!,
  },
  {
    name: "My Agent",
    description: "Registers with zero friction",
    accountName: "my-agent",  // optional
  }
);

console.log("Registered at:", result.smartAccountAddress);
console.log("BaseScan:", \`https://basescan.org/tx/\${result.transactionHash}\`);`;

const USER_OP_CODE = `// Send any gasless transaction via the smart account
const result = await agent.sendUserOperation([
  {
    to: "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432",
    value: 0n,
    data: "0x...", // any calldata
  },
]);

console.log("Tx:", result.transactionHash);
// Gas sponsored by CDP Paymaster — $0 cost`;

const ENV_EXAMPLE = `# .env
CDP_API_KEY_ID=your-api-key-id
CDP_API_KEY_SECRET=your-api-key-secret
CDP_WALLET_SECRET=your-wallet-secret`;

export default function AccountsPage() {

  return (
    <DocLayout
      title="Accounts"
      description="Gasless smart accounts for AI agent registration via CDP Paymaster"
      currentPath="/accounts"
      pill={{ label: "@a3stack/accounts", color: "gold" }}
    >
      <section>
        <h2 id="overview">Overview</h2>
        <p>
          <code>@a3stack/accounts</code> removes the biggest barrier to on-chain agent identity:
          <strong> gas fees</strong>. Using Coinbase Developer Platform&apos;s Paymaster service,
          agents can register on ERC-8004 with <strong>zero ETH</strong> — no wallet funding,
          no gas estimation, no friction.
        </p>
        <p>
          Under the hood, it creates an <strong>ERC-4337 smart account</strong> on Base,
          owned by a CDP-managed server wallet. All transactions are automatically
          gas-sponsored by the CDP Paymaster.
        </p>

        <div style={{
          padding: "16px 20px",
          background: "rgba(167,139,250,0.06)",
          border: "1px solid rgba(167,139,250,0.15)",
          borderRadius: 10,
          marginTop: 20,
          marginBottom: 20,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 16 }}>⛽</span>
            <strong style={{ color: "#a78bfa", fontSize: 14 }}>Zero Gas Cost</strong>
          </div>
          <p style={{ margin: 0, fontSize: 14, color: "#94a3b8" }}>
            CDP Paymaster sponsors gas for all UserOperations targeting the ERC-8004 registry.
            Your agents never need ETH to register. Currently supported on <strong>Base Mainnet</strong> and <strong>Base Sepolia</strong>.
          </p>
        </div>
      </section>

      <section>
        <h2 id="install">Installation</h2>
        <TerminalBlock code={INSTALL_CODE} />
        <p>
          Requires Node.js 22+ and a{" "}
          <a href="https://portal.cdp.coinbase.com" target="_blank" rel="noopener">CDP account</a>{" "}
          with an API key and Wallet Secret.
        </p>
      </section>

      <section>
        <h2 id="setup">CDP Setup</h2>
        <p>Before using the package, you need three credentials from the CDP portal:</p>
        <ol>
          <li>
            <strong>API Key ID &amp; Secret</strong> — Create at{" "}
            <a href="https://portal.cdp.coinbase.com/projects/api-keys" target="_blank" rel="noopener">
              portal.cdp.coinbase.com → API Keys
            </a>
            . Enable <em>View</em> and <em>Manage Policies</em> permissions.
          </li>
          <li>
            <strong>Wallet Secret</strong> — Generate at{" "}
            <a href="https://portal.cdp.coinbase.com/products/server-wallet/accounts" target="_blank" rel="noopener">
              portal.cdp.coinbase.com → Server Wallet → Accounts
            </a>
            . This is an EC P-256 private key (PKCS8 format, base64-encoded).
          </li>
          <li>
            <strong>Paymaster Allowlist</strong> — Go to{" "}
            <a href="https://portal.cdp.coinbase.com/products/bundler-and-paymaster" target="_blank" rel="noopener">
              portal.cdp.coinbase.com → Paymaster
            </a>
            , select Base Mainnet, and add <code>0x8004A169FB4a3325136EB29fA0ceB6D2e539a432</code>{" "}
            to the contract allowlist.
          </li>
        </ol>
        <CodeBlock code={ENV_EXAMPLE} lang="bash" filename=".env" />
      </section>

      <section>
        <h2 id="quick-start">Quick Start</h2>
        <h3>Create a Smart Account</h3>
        <CodeBlock code={QUICK_START_CODE} lang="typescript" filename="create-account.ts" />
        <p>
          <code>createAgentAccount()</code> is idempotent — calling it with the same name returns
          the same smart account address every time. The smart account is deployed on-chain
          with its first UserOperation (CREATE2 deterministic addressing).
        </p>
      </section>

      <section>
        <h3>Register on ERC-8004</h3>
        <CodeBlock code={REGISTER_CODE} lang="typescript" filename="register.ts" />
        <p>
          The <code>register()</code> method builds an ERC-8004 registration JSON,
          encodes it as a data URI, and sends a gasless UserOperation to the registry contract.
          CDP Paymaster covers all gas costs.
        </p>
      </section>

      <section>
        <h2 id="one-shot">One-Shot Registration</h2>
        <p>
          For the simplest flow — create account and register in one call:
        </p>
        <CodeBlock code={ONE_SHOT_CODE} lang="typescript" filename="one-shot.ts" />
      </section>

      <section>
        <h2 id="user-operations">Custom UserOperations</h2>
        <p>
          The smart account isn&apos;t limited to registration — send any gasless
          transaction via <code>sendUserOperation()</code>:
        </p>
        <CodeBlock code={USER_OP_CODE} lang="typescript" filename="custom-op.ts" />
      </section>

      <section>
        <h2 id="api">API Reference</h2>

        <h3><code>createAgentAccount(credentials, options?)</code></h3>
        <p>Creates or retrieves a gasless smart account on Base.</p>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              <th style={{ textAlign: "left", padding: "8px 12px", color: "#94a3b8" }}>Param</th>
              <th style={{ textAlign: "left", padding: "8px 12px", color: "#94a3b8" }}>Type</th>
              <th style={{ textAlign: "left", padding: "8px 12px", color: "#94a3b8" }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              <td style={{ padding: "8px 12px" }}><code>credentials.apiKeyId</code></td>
              <td style={{ padding: "8px 12px", color: "#8291a5" }}>string</td>
              <td style={{ padding: "8px 12px", color: "#94a3b8" }}>CDP API Key ID</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              <td style={{ padding: "8px 12px" }}><code>credentials.apiKeySecret</code></td>
              <td style={{ padding: "8px 12px", color: "#8291a5" }}>string</td>
              <td style={{ padding: "8px 12px", color: "#94a3b8" }}>CDP API Key Secret</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              <td style={{ padding: "8px 12px" }}><code>credentials.walletSecret</code></td>
              <td style={{ padding: "8px 12px", color: "#8291a5" }}>string</td>
              <td style={{ padding: "8px 12px", color: "#94a3b8" }}>CDP Wallet Secret (EC P-256 PKCS8)</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              <td style={{ padding: "8px 12px" }}><code>options.name</code></td>
              <td style={{ padding: "8px 12px", color: "#8291a5" }}>string?</td>
              <td style={{ padding: "8px 12px", color: "#94a3b8" }}>Account name (idempotent). Default: &quot;a3stack-agent&quot;</td>
            </tr>
            <tr>
              <td style={{ padding: "8px 12px" }}><code>options.testnet</code></td>
              <td style={{ padding: "8px 12px", color: "#8291a5" }}>boolean?</td>
              <td style={{ padding: "8px 12px", color: "#94a3b8" }}>Use Base Sepolia instead of mainnet</td>
            </tr>
          </tbody>
        </table>

        <p style={{ marginTop: 24 }}>Returns an <code>AgentAccount</code> with:</p>
        <ul>
          <li><code>address</code> — Smart account address (ERC-4337)</li>
          <li><code>ownerAddress</code> — Owner EOA address</li>
          <li><code>network</code> — &quot;base&quot; or &quot;base-sepolia&quot;</li>
          <li><code>register(opts)</code> — Register on ERC-8004 (gasless)</li>
          <li><code>sendUserOperation(calls)</code> — Send any gasless UserOperation</li>
        </ul>

        <h3 style={{ marginTop: 32 }}><code>gaslessRegister(credentials, options)</code></h3>
        <p>
          Convenience function that creates an account and registers in one call.
          Accepts all <code>RegisterOptions</code> plus optional <code>accountName</code> and <code>testnet</code>.
        </p>
      </section>

      <section>
        <h2 id="how-it-works">How It Works</h2>
        <ol>
          <li><strong>CDP Server Wallet</strong> — Creates a managed EOA (private key secured in CDP&apos;s TEE)</li>
          <li><strong>Smart Account</strong> — Creates an ERC-4337 smart account owned by the EOA (deterministic via CREATE2)</li>
          <li><strong>UserOperation</strong> — Encodes the <code>register(agentURI)</code> call and submits it</li>
          <li><strong>CDP Paymaster</strong> — Automatically sponsors the gas fee (you pay $0)</li>
          <li><strong>Bundler</strong> — CDP bundles and submits the UserOperation to Base</li>
          <li><strong>On-chain</strong> — Agent is registered as an ERC-721 NFT on ERC-8004 registry</li>
        </ol>

        <div style={{
          padding: "16px 20px",
          background: "rgba(251,191,36,0.06)",
          border: "1px solid rgba(251,191,36,0.15)",
          borderRadius: 10,
          marginTop: 20,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 16 }}>💡</span>
            <strong style={{ color: "#fbbf24", fontSize: 14 }}>Billing</strong>
          </div>
          <p style={{ margin: 0, fontSize: 14, color: "#94a3b8" }}>
            CDP charges your account for sponsored gas at <code>actualGas × ethPrice × 1.07</code> (7% markup).
            At current Base gas prices, a typical registration costs fractions of a cent.
            Apply for up to <strong>$15K in gas credits</strong> via the{" "}
            <a href="https://docs.google.com/forms/d/1yPnBFW0bVUNLUN_w3ctCqYM9sjdIQO3Typ53KXlsS5g/viewform" target="_blank" rel="noopener">
              Base Gasless Campaign
            </a>.
          </p>
        </div>
      </section>

      <section>
        <h2 id="supported-networks">Supported Networks</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              <th style={{ textAlign: "left", padding: "8px 12px", color: "#94a3b8" }}>Network</th>
              <th style={{ textAlign: "left", padding: "8px 12px", color: "#94a3b8" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              <td style={{ padding: "8px 12px" }}>Base Mainnet</td>
              <td style={{ padding: "8px 12px", color: "#34d399" }}>✅ Supported</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              <td style={{ padding: "8px 12px" }}>Base Sepolia</td>
              <td style={{ padding: "8px 12px", color: "#34d399" }}>✅ Supported</td>
            </tr>
            <tr>
              <td style={{ padding: "8px 12px" }}>Other EVM chains</td>
              <td style={{ padding: "8px 12px", color: "#8291a5" }}>Use @a3stack/identity (requires ETH for gas)</td>
            </tr>
          </tbody>
        </table>
      </section>
    </DocLayout>
  );
}
