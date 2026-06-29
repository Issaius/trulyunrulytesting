#!/usr/bin/env node
/**
 * Validates email footer HTML against project constraints.
 * Run: node emails/validate.mjs
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const files = ["footer.html", "footer-signature.html"];
let errors = 0;

function fail(msg) {
  console.error(`  ✗ ${msg}`);
  errors++;
}

function pass(msg) {
  console.log(`  ✓ ${msg}`);
}

for (const file of files) {
  const path = join(__dirname, file);
  const html = readFileSync(path, "utf8");
  console.log(`\n${file}`);

  if (!/<table[^>]+role="presentation"/i.test(html)) {
    fail("missing role=presentation table");
  } else {
    pass("table-based layout");
  }

  if (/<style[\s>]/i.test(html)) {
    fail("contains <style> block (stripped by Gmail)");
  } else {
    pass("no <style> blocks");
  }

  if (/style="/i.test(html)) {
    pass("inline CSS present");
  } else {
    fail("missing inline styles");
  }

  const imgs = [...html.matchAll(/<img[^>]*>/gi)];
  if (imgs.length < 2) {
    fail("expected at least 2 wing images");
  } else {
    pass(`${imgs.length} images`);
  }

  for (const img of imgs) {
    const tag = img[0];
    if (!/src="https:\/\//i.test(tag)) {
      fail(`image missing HTTPS src: ${tag.slice(0, 60)}…`);
    }
    if (!/alt="/i.test(tag)) {
      fail("image missing alt attribute");
    }
    if (!/width="\d+"/i.test(tag) || !/height="\d+"/i.test(tag)) {
      fail("image missing width/height attributes");
    }
  }
  if (imgs.length >= 2) pass("images use HTTPS + dimensions + alt");

  if (!/bgcolor="#000000"/i.test(html) && !/background-color:#000000/i.test(html)) {
    fail("missing black background");
  } else {
    pass("black background");
  }

  if (!/Georgia/i.test(html)) {
    fail("missing Georgia font fallback");
  } else {
    pass("Georgia font fallback");
  }

  if (!/contact@unrulytruly\.eu/i.test(html)) {
    fail("missing contact email");
  } else {
    pass("contact email present");
  }

  if (!/impressum/i.test(html)) {
    fail("missing impressum link");
  } else {
    pass("impressum link present");
  }
}

console.log(errors ? `\n${errors} issue(s) found.` : "\nAll checks passed.");
process.exit(errors ? 1 : 0);
