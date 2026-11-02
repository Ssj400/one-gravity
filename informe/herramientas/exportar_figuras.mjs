import { chromium } from "playwright-core";
const out = process.argv[2];
const tabs = { solar: ["fig1a_orbita","fig1b_energia","fig2_kepler3"], galaxy: ["fig3_rotacion_ngc3198"], universe: ["fig4_factor_escala"], sn: ["fig5a_hubble","fig5b_residuos"] };
const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
const ctx = await browser.newContext({ viewport: { width: 2240, height: 1200 }, deviceScaleFactor: 2 });
await ctx.addInitScript(() => { try { localStorage.setItem("theme", "light"); } catch {} });
const page = await ctx.newPage();
await page.goto("http://localhost:5173/#solar");
await page.waitForFunction(() => document.querySelector(".status")?.textContent === "Python listo", null, { timeout: 180000 });
await page.addStyleTag({ content: ".modebar{display:none!important} #root{max-width:1840px}" });
for (const [id, names] of Object.entries(tabs)) {
  await page.evaluate((h) => { location.hash = h; }, "#" + id);
  await page.addStyleTag({ content: id === "solar" ? "#root{max-width:1115px!important} .grid2{grid-template-columns:1fr!important}" : "#root{max-width:1840px!important} .grid2{grid-template-columns:minmax(0,3fr) minmax(0,2fr)!important}" });
  await page.waitForFunction((n) => document.querySelectorAll(".plot .plotly .main-svg").length >= n, names.length, { timeout: 120000 });
  await page.waitForTimeout(1500); await page.evaluate(() => window.dispatchEvent(new Event("resize"))); await page.waitForTimeout(800);
  const plots = await page.$$(".plot");
  for (let i = 0; i < names.length; i++) {
    await plots[i].scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await plots[i].screenshot({ path: `${out}/${names[i]}.png` });
    console.log(id, names[i]);
  }
}
await browser.close();
