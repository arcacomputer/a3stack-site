import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  code: string;
  lang?: string;
  filename?: string;
  terminalPrompt?: boolean;
}

export default function CodeBlock({ code, lang = "typescript", filename, terminalPrompt = false }: CodeBlockProps) {
  const normalized = code.trim();
  return (
    <div className="code-block my-5 group">
      <div className="code-header justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57] opacity-70" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e] opacity-70" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840] opacity-70" />
          </div>
          {filename && <span className="text-[#4b5f73] font-mono text-xs ml-2">{filename}</span>}
        </div>
        <div className="flex items-center gap-3">
          <span className="lang">{lang}</span>
          <button type="button" data-copy-code className="copy-code" aria-label="Copy code to clipboard">
            <Copy className="copy-icon" size={12} />
            <Check className="check-icon" size={12} />
            <span>Copy</span>
          </button>
          <span className="sr-only" data-copy-status aria-live="polite" />
        </div>
      </div>
      {terminalPrompt ? (
        <pre className="!py-4" tabIndex={0} aria-label="Scrollable code example"><code>{normalized.split("\n").map((line, index) => (
          <div className="flex gap-3" key={index}>
            <span style={{ color: "#fbbf24", userSelect: "none" }}>$</span>
            <span>{line}</span>
          </div>
        ))}</code></pre>
      ) : (
        <pre tabIndex={0} aria-label="Scrollable code example"><code>{normalized}</code></pre>
      )}
    </div>
  );
}

export function InlineCode({ children }: { children: React.ReactNode }) {
  return <code className="inline-code">{children}</code>;
}

export function TerminalBlock({ code }: { code: string }) {
  return <CodeBlock code={code} lang="bash" filename="terminal" terminalPrompt />;
}
