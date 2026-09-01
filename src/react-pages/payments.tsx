
import DocLayout from "@/components/DocLayout";
import CodeBlock from "@/components/CodeBlock";


const PAYMENT_CLIENT_CODE = `import { createPaymentClient } from "@a3stack/payments";
import { privateKeyToAccount } from "viem/accounts";

const account = privateKeyToAccount(process.env.PRIVATE_KEY);

const payer = createPaymentClient({
  account,
  chains: ["eip155:8453"],  // supported chains (Base default)
  // maxAmount: "1000000",  // optional: max USDC to auto-pay (safety cap)
});`;

const PAYER_FETCH_CODE = `// Auto-pays x402 requirements transparently
const response = await payer.fetch("https://api.paidagent.ai/tool");
const data = await response.json();

// Or target a specific agent by ERC-8004 ID
// (auto-resolves payment wallet from on-chain registration)
const paidFetch = await payer.fetchForAgent("eip155:8453:0x8004...#2376");
const response = await paidFetch("https://mcp.paidagent.ai/tool");`;

const BALANCE_CODE = `// Check your USDC balance on Base
const balance = await payer.getBalance("eip155:8453");
// {
//   amount: 1500000n,      // raw USDC (6 decimals)
//   formatted: "1.500000", // human-readable
//   symbol: "USDC",
// }`;

const RECEIPT_CODE = `// After a paid request, decode the payment receipt
const receipt = payer.decodeReceipt(response);
// {
//   txHash?: "0x...",
//   from: "0x...",
//   to: "0x...",
//   amount: "1000",
//   asset: "0x833589...", // USDC
//   chain: "eip155:8453",
//   timestamp: 1733000000,
// }`;

const CHECK_REQS_CODE = `// Check if an endpoint requires payment before connecting
const check = await payer.checkPaymentRequirements("https://api.agent.ai/tool");
// {
//   requiresPayment: true,
//   amount: "1000",
//   asset: "0x833589...",
//   network: "eip155:8453",
//   payTo: "0x1be93C..."
// }`;

const PAYMENT_SERVER_CODE = `import { createPaymentServer } from "@a3stack/payments";
import { USDC_BASE } from "@a3stack/payments";

const receiver = createPaymentServer({
  payTo: "0x1be93C...",     // your wallet — receives USDC
  amount: "100000",          // 0.10 USDC in base units (6 decimals)
  asset: USDC_BASE,          // USDC address on Base
  chain: "eip155:8453",
  description: "My AI tool, 0.10 USDC per call",
  // facilitator?: "https://...",  // optional custom facilitator URL
});`;

const MIDDLEWARE_CODE = `import express from "express";
const app = express();

app.use("/tool", receiver.middleware(), (req, res) => {
  // ✓ Payment verified at this point
  const payment = res.locals.payment; // PaymentDetails

  console.log(\`Received \${payment.amount} USDC from \${payment.from}\`);

  res.json({ result: "premium content" });
});

app.listen(3000);`;

const MANUAL_VERIFY_CODE = `// Manual: check if a request carries valid payment
const { valid, payment, error } = await receiver.verify(req);
if (!valid) {
  const reqs = receiver.buildRequirements("https://api.myagent.ai/tool");
  res.status(402).set("X-PAYMENT-REQUIRED", reqs).end();
  return;
}

// Payment valid — serve the response`;

const PAYMENT_CLIENT_CLASS_CODE = `import { PaymentClient } from "@a3stack/payments";

// Direct class instantiation (same as createPaymentClient)
const client = new PaymentClient({ account });
const balance = await client.getBalance("eip155:8453");`;

const CONSTANTS_CODE = `import { USDC_BASE, USDC_ETHEREUM, USDC_ARBITRUM } from "@a3stack/payments";

// Base mainnet USDC
console.log(USDC_BASE);
// "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"`;

const FLOW_CODE = `// The x402 payment flow in detail:

// 1. Client makes a normal HTTP request
GET /tool HTTP/1.1

// 2. Server returns 402 with payment requirements
HTTP/1.1 402 Payment Required
X-PAYMENT-REQUIRED: { "accepts": [{ "scheme": "exact", "network": "eip155:8453", ... }] }

// 3. Client signs EIP-3009 authorization (gasless — no ETH needed, just USDC)
// Authorization: Transfer USDC from client to agent's payTo address

// 4. Client retries with X-PAYMENT header
GET /tool HTTP/1.1
X-PAYMENT: <base64-encoded EIP-3009 signature>

// 5. Server verifies signature and responds
HTTP/1.1 200 OK
X-PAYMENT-RESPONSE: { "success": true, "txHash": "..." }

// 6. Facilitator settles the USDC transfer on-chain
// Client: -0.001 USDC   Agent: +0.001 USDC`;

export default function PaymentsPage() {

  return (
    <DocLayout
      title="Payments"
      description="Agent-to-agent payments via x402 protocol. Charge for your services or pay other agents. USDC on Base, gasless for the payer."
      currentPath="/payments"
      pill={{ label: "@a3stack/payments", color: "gold" }}
    >
      <h2>How x402 works</h2>
      <p>
        x402 is an HTTP protocol for micropayments. When a client requests a paid resource,
        the server responds with HTTP 402 (Payment Required) plus payment details.
        The client signs an EIP-3009 authorization (a gasless USDC transfer) and retries.
        A facilitator settles on-chain.
      </p>
      <p>
        <strong style={{ color: "#fbbf24" }}>Key feature:</strong> The payer never sends ETH or gas.
        EIP-3009 is a signed authorization — the facilitator pays gas and collects a small fee.
        Instant, cheap, and trustless.
      </p>

      <div style={{ overflowX: "auto", marginBottom: 24 }}>
        <table>
          <thead>
            <tr><th>Property</th><th>Value</th></tr>
          </thead>
          <tbody>
            <tr><td>Token</td><td><code>USDC</code> (Circle)</td></tr>
            <tr><td>Network</td><td>Base mainnet (<code>eip155:8453</code>)</td></tr>
            <tr><td>Settlement</td><td>Via facilitator (gasless for payer)</td></tr>
            <tr><td>Protocol</td><td>x402 v2 (CAIP-2 network IDs)</td></tr>
            <tr><td>Signing</td><td>EIP-3009 (signed USDC transfer authorization)</td></tr>
            <tr><td>Min amount</td><td>1 base unit = 0.000001 USDC</td></tr>
          </tbody>
        </table>
      </div>

      <h3>USDC amount encoding</h3>
      <p>
        USDC has 6 decimal places. Amounts are always in base units (strings):
      </p>
      <div className="responsive-grid amount-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 24 }}>
        {[
          { base: '"1000"', human: "0.001 USDC" },
          { base: '"10000"', human: "0.01 USDC" },
          { base: '"100000"', human: "0.10 USDC" },
          { base: '"1000000"', human: "1.00 USDC" },
        ].map((row) => (
          <div key={row.base} style={{
            display: "flex", justifyContent: "space-between",
            padding: "10px 14px",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 6,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13,
          }}>
            <span style={{ color: "#fbbf24" }}>{row.base}</span>
            <span style={{ color: "#64748b" }}>= {row.human}</span>
          </div>
        ))}
      </div>

      <h2>Payment Client (paying agents)</h2>
      <CodeBlock code={PAYMENT_CLIENT_CODE} lang="typescript" />

      <h3>payer.fetch()</h3>
      <p>Auto-pays x402 requirements. Drop-in replacement for <code>fetch</code>.</p>
      <CodeBlock code={PAYER_FETCH_CODE} lang="typescript" />

      <h3>payer.getBalance()</h3>
      <CodeBlock code={BALANCE_CODE} lang="typescript" />

      <h3>payer.decodeReceipt()</h3>
      <CodeBlock code={RECEIPT_CODE} lang="typescript" />

      <h3>payer.checkPaymentRequirements()</h3>
      <CodeBlock code={CHECK_REQS_CODE} lang="typescript" />

      <h2>Payment Server (receiving agents)</h2>
      <CodeBlock code={PAYMENT_SERVER_CODE} lang="typescript" />

      <h3>receiver.middleware()</h3>
      <p>Express.js middleware. Verifies payment before your handler runs.</p>
      <CodeBlock code={MIDDLEWARE_CODE} lang="typescript" />

      <h3>Manual verification</h3>
      <CodeBlock code={MANUAL_VERIFY_CODE} lang="typescript" />

      <h2>Direct class usage</h2>
      <CodeBlock code={PAYMENT_CLIENT_CLASS_CODE} lang="typescript" />

      <h2>Constants</h2>
      <CodeBlock code={CONSTANTS_CODE} lang="typescript" />

      <h2>Protocol flow (annotated)</h2>
      <CodeBlock code={FLOW_CODE} lang="text" />

      <h2>Key addresses</h2>
      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr><th>Contract</th><th>Address</th><th>Chain</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>USDC</td>
              <td><code>0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913</code></td>
              <td>Base</td>
            </tr>
            <tr>
              <td>Permit2</td>
              <td><code>0x000000000022D473030F116dDEE9F6B43aC78BA3</code></td>
              <td>Base</td>
            </tr>
          </tbody>
        </table>
      </div>
    </DocLayout>
  );
}
