// Validate the actual public payload before a GitHub Pages deploy.
// No Notion tokens or private research data are used here.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const location = resolve(process.cwd(), "docs/data/notes.json");
const records = JSON.parse(readFileSync(location, "utf8"));
const categories = new Set(["money", "items", "gear", "battle", "explore", "settings", "daily", "weekly"]);
const priorities = new Set(["最優先", "高", "中", "低"]);
const errors = [];
const ids = new Set();
function error(path, message) { errors.push(path + ": " + message); }
function text(value) { return typeof value === "string" && value.trim().length > 0; }
function validDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(value)) &&
    new Date(value + "T00:00:00Z").toISOString().slice(0, 10) === value;
}
function secureUrl(value) {
  try { return new URL(value).protocol === "https:"; } catch { return false; }
}
if (!Array.isArray(records)) error("root", "must be an array");
else records.forEach((n, index) => {
  const key = "[" + index + "]";
  if (!n || typeof n !== "object" || Array.isArray(n)) { error(key, "must be an object"); return; }
  if (typeof n.id !== "string" || !/^[a-z0-9][a-z0-9-]{1,72}$/.test(n.id)) error(key + ".id", "use a stable lowercase URL slug");
  else if (ids.has(n.id)) error(key + ".id", "duplicate id");
  else ids.add(n.id);
  if (n.status !== "公開中") error(key + ".status", "only approved public entries are allowed");
  if (!categories.has(n.category)) error(key + ".category", "unknown category");
  if (!text(n.title)) error(key + ".title", "required");
  if (!text(n.summary)) error(key + ".summary", "required");
  if (!Array.isArray(n.details) || !n.details.every(text)) error(key + ".details", "must be an array of strings");
  if (!Array.isArray(n.keywords) || !n.keywords.every(text)) error(key + ".keywords", "must be an array of strings");
  if (!validDate(n.checked_at)) error(key + ".checked_at", "use a real YYYY-MM-DD date");
  if (!Array.isArray(n.sources) || n.sources.length < 1) error(key + ".sources", "at least one source is needed");
  else n.sources.forEach((s, i) => {
    if (!s || !text(s.label) || !secureUrl(s.url)) error(key + ".sources[" + i + "]", "HTTPS URL and label required");
  });
  if (n.importance !== undefined && !priorities.has(n.importance)) error(key + ".importance", "unknown priority");
  if (n.caution !== undefined && typeof n.caution !== "string") error(key + ".caution", "must be a string");
});
if (errors.length) {
  for (const message of errors) console.error("✗", message);
  process.exitCode = 1;
} else console.log("OK: " + records.length + " approved public notes validated.");
