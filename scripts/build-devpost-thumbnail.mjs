import { writeFile } from "node:fs/promises";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { createCanvas, loadImage, GlobalFonts } = require(
  "/Users/dx/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas",
);

const width = 1500;
const height = 1000;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");

GlobalFonts.registerFromPath("/System/Library/Fonts/Avenir Next.ttc", "Avenir Next");

const [background, screenshot, mark] = await Promise.all([
  loadImage("media/submission/pausa-thumbnail-background-image2.png"),
  loadImage("media/video/source/01-home-en.png"),
  loadImage("public/brand/pausa-mark-1024.png"),
]);

ctx.drawImage(background, 0, 0, width, height);

// A quiet veil keeps the real interface and the headline readable.
const veil = ctx.createLinearGradient(0, 0, width, 0);
veil.addColorStop(0, "rgba(255,250,240,0.36)");
veil.addColorStop(0.52, "rgba(255,250,240,0.12)");
veil.addColorStop(1, "rgba(255,250,240,0.02)");
ctx.fillStyle = veil;
ctx.fillRect(0, 0, width, height);

// Brand lockup.
ctx.drawImage(mark, 105, 90, 88, 88);
ctx.fillStyle = "#123f39";
ctx.font = '800 48px "Avenir Next"';
ctx.fillText("Pausa", 220, 153);

ctx.fillStyle = "#1e6759";
ctx.font = '800 22px "Avenir Next"';
ctx.letterSpacing = "4px";
ctx.fillText("A CALMER WAY TO CHECK", 110, 278);
ctx.letterSpacing = "0px";

ctx.fillStyle = "#123f39";
ctx.font = '800 94px "Avenir Next"';
ctx.fillText("One calmer", 105, 400);
ctx.fillText("next step.", 105, 503);

ctx.fillStyle = "#526b65";
ctx.font = '500 38px "Avenir Next"';
ctx.fillText("Speak, photograph,", 110, 606);
ctx.fillText("or paste what you see.", 110, 657);

ctx.fillStyle = "rgba(30,103,89,0.11)";
ctx.beginPath();
ctx.roundRect(108, 726, 420, 62, 31);
ctx.fill();
ctx.fillStyle = "#1e6759";
ctx.font = '800 21px "Avenir Next"';
ctx.fillText("BUILT WITH CODEX + GPT-5.6", 137, 766);

ctx.fillStyle = "#526b65";
ctx.font = '600 24px "Avenir Next"';
ctx.fillText("FREE  •  BILINGUAL  •  INSTALLABLE", 110, 856);

// Straight-on device frame with the real Pausa screen preserved pixel-for-pixel.
ctx.save();
ctx.shadowColor = "rgba(18,63,57,0.24)";
ctx.shadowBlur = 44;
ctx.shadowOffsetY = 24;
ctx.fillStyle = "#123f39";
ctx.beginPath();
ctx.roundRect(890, 72, 520, 856, 54);
ctx.fill();
ctx.restore();

ctx.strokeStyle = "rgba(189,145,68,0.82)";
ctx.lineWidth = 3;
ctx.beginPath();
ctx.roundRect(890, 72, 520, 856, 54);
ctx.stroke();

ctx.save();
ctx.beginPath();
ctx.roundRect(910, 98, 480, 710, 36);
ctx.clip();
ctx.drawImage(screenshot, 0, 0, screenshot.width, 1154, 910, 98, 480, 710);
ctx.restore();

// Minimal bottom hardware detail; no invented product UI.
ctx.fillStyle = "rgba(255,250,240,0.55)";
ctx.beginPath();
ctx.roundRect(1056, 863, 188, 8, 4);
ctx.fill();

await writeFile("media/submission/pausa-devpost-thumbnail-v2.png", canvas.toBuffer("image/png"));
