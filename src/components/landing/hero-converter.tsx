"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeftRight, Download, Copy, Check } from "lucide-react";
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

  const convert = () => {
    setError("");
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
    <div className="w-full max-w-4xl mx-auto">
      {/* Direction toggle */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <span className={`text-sm font-medium ${direction === "json_to_csv" ? "text-primary" : "text-muted-foreground"}`}>
          JSON
        </span>
        <button
          onClick={swap}
          className="flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm hover:bg-border transition-colors"
        >
          <ArrowLeftRight className="h-4 w-4" />
          {direction === "json_to_csv" ? "→ CSV" : "→ JSON"}
        </button>
        <span className={`text-sm font-medium ${direction === "csv_to_json" ? "text-primary" : "text-muted-foreground"}`}>
          CSV
        </span>
      </div>

      {/* Converter panels */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Input */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {direction === "json_to_csv" ? "JSON Input" : "CSV Input"}
            </span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-64 p-4 bg-transparent font-mono text-sm resize-none focus:outline-none"
            placeholder={direction === "json_to_csv" ? "Paste your JSON here..." : "Paste your CSV here..."}
          />
        </div>

        {/* Output */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {direction === "json_to_csv" ? "CSV Output" : "JSON Output"}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={copyOutput}
                disabled={!output}
                className="p-1.5 rounded hover:bg-muted disabled:opacity-30 transition-colors"
                title="Copy"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
              <button
                onClick={downloadOutput}
                disabled={!output}
                className="p-1.5 rounded hover:bg-muted disabled:opacity-30 transition-colors"
                title="Download"
              >
                <Download className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <textarea
            value={output}
            readOnly
            className="w-full h-64 p-4 bg-transparent font-mono text-sm resize-none focus:outline-none"
            placeholder="Converted output will appear here..."
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Convert button */}
      <div className="flex justify-center mt-4">
        <button
          onClick={convert}
          className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
        >
          Convert Now <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
