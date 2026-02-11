"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeftRight, Download, Copy, Check, FileJson, FileSpreadsheet } from "lucide-react";
import { jsonToCsv, csvToJson, detectFormat } from "@/lib/converter";

const SAMPLE_JSON = `[
  { "name": "Alice", "age": 30, "city": "NYC" },
  { "name": "Bob", "age": 25, "city": "LA" },
  { "name": "Carol", "age": 35, "city": "Chicago" }
]`;

const SAMPLE_CSV = `name,age,city
Alice,30,NYC
Bob,25,LA
Carol,35,Chicago`;

export function HeroConverter() {
  const [input, setInput] = useState(SAMPLE_JSON);
  const [output, setOutput] = useState("");
  const [direction, setDirection] = useState<"json_to_csv" | "csv_to_json">("json_to_csv");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [converting, setConverting] = useState(false);

  const convert = () => {
    setError("");
    setConverting(true);
    setTimeout(() => {
      try {
        if (direction === "json_to_csv") {
          setOutput(jsonToCsv(input));
        } else {
          setOutput(csvToJson(input));
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Conversion failed");
        setOutput("");
      }
      setConverting(false);
    }, 150); // tiny delay for visual feedback
  };

  const swap = () => {
    if (direction === "json_to_csv") {
      setDirection("csv_to_json");
      setInput(SAMPLE_CSV);
    } else {
      setDirection("json_to_csv");
      setInput(SAMPLE_JSON);
    }
    setOutput("");
    setError("");
  };

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadOutput = () => {
    if (!output) return;
    const ext = direction === "json_to_csv" ? "csv" : "json";
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `converted.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Direction toggle */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <FileJson className={`h-4 w-4 ${direction === "json_to_csv" ? "text-primary" : ""}`} />
          <span className={direction === "json_to_csv" ? "text-primary" : ""}>JSON</span>
        </div>
        <button
          onClick={swap}
          className="group flex items-center gap-2 rounded-full glass px-5 py-2.5 text-sm hover:border-primary/50 transition-all duration-300"
        >
          <ArrowLeftRight className="h-4 w-4 group-hover:text-primary transition-colors" />
          <span className="group-hover:text-primary transition-colors">Swap</span>
        </button>
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <FileSpreadsheet className={`h-4 w-4 ${direction === "csv_to_json" ? "text-primary" : ""}`} />
          <span className={direction === "csv_to_json" ? "text-primary" : ""}>CSV</span>
        </div>
      </div>

      {/* Converter panels */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Input */}
        <div className="card-glow rounded-2xl glass overflow-hidden">
          <div className="flex items-center justify-between border-b border-border/50 px-5 py-3">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider ml-2">
                {direction === "json_to_csv" ? "json" : "csv"} input
              </span>
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-72 p-5 bg-transparent font-mono text-sm resize-none focus:outline-none text-foreground placeholder:text-muted-foreground/50"
            placeholder={direction === "json_to_csv" ? "Paste your JSON here..." : "Paste your CSV here..."}
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div className="card-glow rounded-2xl glass overflow-hidden">
          <div className="flex items-center justify-between border-b border-border/50 px-5 py-3">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider ml-2">
                {direction === "json_to_csv" ? "csv" : "json"} output
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={copyOutput}
                disabled={!output}
                className="p-2 rounded-lg hover:bg-muted disabled:opacity-20 transition-all"
                title="Copy to clipboard"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
              </button>
              <button
                onClick={downloadOutput}
                disabled={!output}
                className="p-2 rounded-lg hover:bg-muted disabled:opacity-20 transition-all"
                title="Download file"
              >
                <Download className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>
          </div>
          <textarea
            value={output}
            readOnly
            className="w-full h-72 p-5 bg-transparent font-mono text-sm resize-none focus:outline-none text-foreground placeholder:text-muted-foreground/30"
            placeholder="Converted output will appear here..."
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Convert button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={convert}
          disabled={converting}
          className="btn-glow flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-sm font-semibold text-white hover:bg-primary-hover transition-all disabled:opacity-70"
        >
          {converting ? (
            <>
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Converting...
            </>
          ) : (
            <>
              Convert Now <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
