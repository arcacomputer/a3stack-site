
import DocLayout from "@/components/DocLayout";
import CodeBlock, { TerminalBlock } from "@/components/CodeBlock";


const VERIFY_OUTPUT = `$ npx a3stack verify eip155:8453:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432#2376

🔍 Verifying agent identity

   Chain:    Base (8453)
   Registry: 0x8004A169FB4a3325136EB29fA0ceB6D2e539a432
   Agent ID: #2376

   ✓ Verified on-chain
   Owner: 0x1be93C700dDC596D701E8F2106B8F9166C625Adb
   URI:   https://arcabot.ai/agent-metadata.json
   Pay:   0x1be93C700dDC596D701E8F2106B8F9166C625Adb
   Name:  Arca
   ✓ Metadata back-reference present

   Services:
   → web: https://arcabot.ai
   → A2A: https://arcabot.ai/.well-known/agent-card.json
   → a3stack: https://a3stack.arcabot.ai
   → clawfix: https://clawfix.dev`;

const ENS_VERIFY_OUTPUT = `$ # next CLI release / source build
$ npx a3stack verify arcabot.eth

🔍 Verifying agent identity

   ✓ Resolved arcabot.eth → 0x1be93C700dDC596D701E8F2106B8F9166C625Adb

   ✓ Found EVM registration(s):

   ✓ Ethereum        #22775  eip155:1:0x8004...#22775
   ✓ Optimism        #0      eip155:10:0x8004...#0
   ✓ Base            #2376   eip155:8453:0x8004...#2376
   ✓ Scroll          #1      eip155:534352:0x8004...#1
   … more chains when their public RPCs respond

   Name: Arca`;


const LOOKUP_OUTPUT = `$ A3STACK_CHAIN_IDS=1,10,8453,534352 npx a3stack lookup 0x1be93C700dDC596D701E8F2106B8F9166C625Adb

🌐 Scanning all chains for 0x1be93C700dDC596D701E8F2106B8F9166C625Adb

   Found 4 registration(s):

   ✓ Ethereum        #22775  eip155:1:0x8004...#22775
   ✓ Optimism        #0      eip155:10:0x8004...#0
   ✓ Base            #2376   eip155:8453:0x8004...#2376
   ✓ Scroll          #1      eip155:534352:0x8004...#1`;


const PROBE_OUTPUT = `$ npx a3stack probe eip155:8453:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432#2376

🔬 Probing agent eip155:8453:0x8004...#2376

   ✓ Identity verified on Base
   Owner: 0x1be93C700dDC596D701E8F2106B8F9166C625Adb
   URI:   https://arcabot.ai/agent-metadata.json
   Pay to: 0x1be93C700dDC596D701E8F2106B8F9166C625Adb
   Name:   Arca
   Active: yes

   Endpoints:
   → web      https://arcabot.ai
   → A2A      https://arcabot.ai/.well-known/agent-card.json
   → github   https://github.com/arcabotai`;


const CHAINS_OUTPUT = `$ npx a3stack chains

   Supported ERC-8004 EVM chains
   
   Chain ID     Name            
   ───────────  ────────────────
   1            Ethereum        
   10           Optimism        
   56           BNB Chain       
   100          Gnosis          
   137          Polygon         
   143          Monad           
   196          X Layer         
   360          Shape           
   1088         Metis           
   1776         Injective EVM   
   2345         GOAT Network    
   2741         Abstract        
   4326         MegaETH         
   5000         Mantle          
   8453         Base            
   42161        Arbitrum        
   42220        Celo            
   43114        Avalanche       
   59144        Linea           
   167000       Taiko           
   534352       Scroll          
   1187947933   SKALE Base      

   22 chains — same registry address on all.`;

const COUNT_OUTPUT = `$ npx a3stack count 8453

📊 Agent count (chunked Transfer-event scan)

   Base              2,376 agents`;


const INIT_OUTPUT = `$ npx a3stack init

🚀 Scaffold a new A3Stack agent

Coming in v0.2.0 — for now, install the packages directly:

   npm install @a3stack/core viem

Docs: https://a3stack.arcabot.ai`;


export default function CliPage() {

  return (
    <DocLayout
      title="CLI"
      description="The npx a3stack CLI for verifying agents, exploring the registry, and scaffolding new projects — no wallet needed for most commands."
      currentPath="/cli"
      pill={{ label: "npx a3stack", color: "gold" }}
    >
      <h2>Overview</h2>
      <p>
        The <code>a3stack</code> CLI ships as part of the <code>a3stack</code> npm package.
        Most commands are read-only and require no wallet or private key.
      </p>
      <TerminalBlock code="npx a3stack --help" />

      <div className="responsive-grid cli-meta-grid" style={{
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        gap: "8px 24px",
        padding: "20px 24px",
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 10,
        marginBottom: 32,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 13,
        alignItems: "start",
      }}>
        {[
          ["verify <globalId|ENS|wallet>", "Verify one global ID or all registrations owned by ENS/wallet"],
          ["lookup <address|ENS>", "Find ERC-8004 registrations for an owner"],
          ["probe <globalId>", "Probe an agent's capabilities and endpoints"],
          ["chains", "List all 22 supported EVM chains"],
          ["count [chainId]", "Count registered agents with chunked log scans"],
          ["init", "Scaffold a new A3Stack project"],
        ].map(([cmd, desc]) => (
          <>
            <span key={cmd} style={{ color: "#fbbf24" }}>{cmd}</span>
            <span key={desc} style={{ color: "#64748b" }}>{desc}</span>
          </>
        ))}
      </div>

      <h2>verify</h2>
      <p>
        Verify any agent's identity. Reads from the ERC-8004 registry, fetches the registration file,
        and validates the back-reference. No wallet needed.
      </p>
      <TerminalBlock code="npx a3stack verify eip155:8453:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432#2376" />
      <CodeBlock code={VERIFY_OUTPUT} lang="text" />
      <p>
        The next CLI release also accepts ENS names or wallet addresses. It resolves ENS, then scans supported
        chains using chunked logs and RPC fallbacks.
      </p>
      <TerminalBlock code="# after a3stack@0.1.1 is published\nnpx a3stack verify arcabot.eth" />
      <CodeBlock code={ENS_VERIFY_OUTPUT} lang="text" />

      <h2>lookup</h2>
      <p>Find ERC-8004 registrations for a wallet or ENS name. Use <code>A3STACK_CHAIN_IDS</code> to keep public-RPC scans bounded.</p>
      <TerminalBlock code="A3STACK_CHAIN_IDS=1,10,8453,534352 npx a3stack lookup arcabot.eth" />
      <CodeBlock code={LOOKUP_OUTPUT} lang="text" />

      <h2>probe</h2>
      <p>
        Probe an agent — combines identity verification with endpoint resolution.
        Shows what tools are available and whether the agent accepts payments.
      </p>
      <TerminalBlock code="npx a3stack probe eip155:8453:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432#2376" />
      <CodeBlock code={PROBE_OUTPUT} lang="text" />

      <h2>chains</h2>
      <p>List all chains where the ERC-8004 registry is deployed.</p>
      <TerminalBlock code="npx a3stack chains" />
      <CodeBlock code={CHAINS_OUTPUT} lang="text" />

      <h2>count</h2>
      <p>Count registered agents by scanning mint logs. Public RPCs may rate-limit wide scans; the CLI chunks ranges and reports degraded chains honestly.</p>
      <TerminalBlock code="npx a3stack count 8453" />
      <CodeBlock code={COUNT_OUTPUT} lang="text" />

      <h2>init</h2>
      <p>The scaffold command is reserved for the next CLI release. For now, install the packages directly.</p>
      <TerminalBlock code="npx a3stack init" />
      <CodeBlock code={INIT_OUTPUT} lang="text" />

      <h2>Installing globally</h2>
      <p>You can also install the CLI globally for convenience:</p>
      <TerminalBlock code={`npm install -g a3stack\na3stack verify eip155:8453:0x8004...#2376`} />
    </DocLayout>
  );
}
