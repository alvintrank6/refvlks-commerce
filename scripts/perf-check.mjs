import { chromium } from "@playwright/test";
import { gzipSync } from "node:zlib";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const output = join(process.cwd(), "test-results/screens/F14");
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: "msedge", headless: true });
const pages = [
  ["home", "/en"],
  ["shop", "/en/shop"],
  ["product", "/en/products/weft-structured-tote"],
  ["donation", "/en/donation-event"],
];
const results = [];
for (const [name, path] of pages) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 150,
    downloadThroughput: 200000,
    uploadThroughput: 93750,
  });
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await page.addInitScript(() => {
    window.__perf = { lcp: 0, cls: 0 };
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        window.__perf.lcp = entry.startTime;
        window.__perf.lcpElement = entry.element?.outerHTML?.slice(0, 240);
        window.__perf.lcpUrl = entry.url;
      }
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries())
        if (!entry.hadRecentInput) window.__perf.cls += entry.value;
    }).observe({ type: "layout-shift", buffered: true });
  });
  await context.tracing.start({ screenshots: true, snapshots: true });
  await page.goto(`http://127.0.0.1:4173${path}`, {
    waitUntil: "load",
    timeout: 60000,
  });
  await page.waitForTimeout(2000);
  const metrics = await page.evaluate(() => ({
    ...window.__perf,
    navigationMs:
      performance.getEntriesByType("navigation")[0]?.duration ?? null,
    scripts: performance
      .getEntriesByType("resource")
      .filter((entry) => entry.name.includes(".js"))
      .map((entry) => entry.name),
    slowResources: performance
      .getEntriesByType("resource")
      .filter((entry) => entry.responseEnd > 2000)
      .sort((a, b) => b.responseEnd - a.responseEnd)
      .slice(0, 8)
      .map((entry) => ({
        name: entry.name.split("/").pop(),
        end: Math.round(entry.responseEnd),
        transfer: entry.transferSize,
      })),
  }));
  let jsGzip = 0;
  for (const url of new Set(metrics.scripts)) {
    const response = await fetch(url);
    if (response.ok)
      jsGzip += gzipSync(Buffer.from(await response.arrayBuffer())).length;
  }
  await page.screenshot({
    path: join(output, `${name}-mobile.png`),
    fullPage: true,
  });
  await context.tracing.stop({ path: join(output, `${name}-trace.zip`) });
  results.push({
    page: name,
    path,
    lcpMs: Math.round(metrics.lcp),
    lcpElement: metrics.lcpElement,
    lcpUrl: metrics.lcpUrl,
    cls: Number(metrics.cls.toFixed(4)),
    navigationMs: Math.round(metrics.navigationMs ?? 0),
    initialJsGzipKb: Math.round(jsGzip / 1024),
    slowResources: metrics.slowResources,
  });
  await context.close();
}
await browser.close();
await writeFile(
  join(output, "performance.json"),
  JSON.stringify(
    {
      device:
        "390x844 Edge headless; simulated 4x CPU and 1.6 Mbps / 150 ms RTT; reduced motion",
      results,
    },
    null,
    2,
  ),
);
console.log(results);
