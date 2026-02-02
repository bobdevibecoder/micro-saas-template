// JSON to CSV converter
export function jsonToCsv(jsonInput: string): string {
  const data = JSON.parse(jsonInput);

  if (!Array.isArray(data)) {
    throw new Error("JSON input must be an array of objects");
  }

  if (data.length === 0) {
    throw new Error("JSON array is empty");
  }

  // Collect all unique keys across all objects
  const headers = new Set<string>();
  for (const row of data) {
    if (typeof row !== "object" || row === null) {
      throw new Error("Each item in the array must be an object");
    }
    Object.keys(row).forEach((key) => headers.add(key));
  }

  const headerArray = Array.from(headers);

  // Escape CSV values
  const escapeCsv = (val: unknown): string => {
    if (val === null || val === undefined) return "";
    const str = typeof val === "object" ? JSON.stringify(val) : String(val);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const lines = [
    headerArray.join(","),
    ...data.map((row) => headerArray.map((h) => escapeCsv(row[h])).join(",")),
  ];

  return lines.join("\n");
}

// CSV to JSON converter
export function csvToJson(csvInput: string): string {
  const lines = csvInput.trim().split("\n");

  if (lines.length < 2) {
    throw new Error("CSV must have a header row and at least one data row");
  }

  const parseRow = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (inQuotes) {
        if (char === '"') {
          if (i + 1 < line.length && line[i + 1] === '"') {
            current += '"';
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          current += char;
        }
      } else {
        if (char === '"') {
          inQuotes = true;
        } else if (char === ",") {
          result.push(current.trim());
          current = "";
        } else {
          current += char;
        }
      }
    }
    result.push(current.trim());
    return result;
  };

  const headers = parseRow(lines[0]);
  const rows = lines.slice(1).filter((line) => line.trim() !== "");

  const data = rows.map((line) => {
    const values = parseRow(line);
    const obj: Record<string, string | number | boolean | null> = {};

    headers.forEach((header, i) => {
      const val = values[i] ?? "";
      // Try to parse numbers and booleans
      if (val === "") {
        obj[header] = null;
      } else if (val === "true") {
        obj[header] = true;
      } else if (val === "false") {
        obj[header] = false;
      } else if (!isNaN(Number(val)) && val !== "") {
        obj[header] = Number(val);
      } else {
        obj[header] = val;
      }
    });

    return obj;
  });

  return JSON.stringify(data, null, 2);
}

// Detect input format
export function detectFormat(input: string): "json" | "csv" | "unknown" {
  const trimmed = input.trim();
  if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
    try {
      JSON.parse(trimmed);
      return "json";
    } catch {
      return "unknown";
    }
  }
  if (trimmed.includes(",") && trimmed.includes("\n")) {
    return "csv";
  }
  return "unknown";
}
