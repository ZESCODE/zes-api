"use strict";

// ZES-API backend shim for Bonto.
// Bonto only runs Node.js, so this entry point downloads the prebuilt static
// linux/amd64 backend binary from GitHub Releases and runs it as a child
// process, forwarding stdio and the PORT env var (3000).

const fs = require("fs");
const path = require("path");
const https = require("https");
const zlib = require("zlib");
const { spawn } = require("child_process");
const { pipeline } = require("stream/promises");

const BIN_URL =
  process.env.ZES_BACKEND_URL ||
  "https://github.com/ZESCODE/zes-api/releases/download/zes-bonto-v1/new-api-linux-amd64.gz";

const APP_DIR = path.join(__dirname, "..");
const BIN_DIR = path.join(APP_DIR, "bin");
const BIN_PATH = path.join(BIN_DIR, "new-api-amd64");

function download(url, dest, redirects = 0) {
  return new Promise((resolve, reject) => {
    if (redirects > 5) return reject(new Error("too many redirects"));
    https
      .get(url, { headers: { "User-Agent": "zes-api-bonto-wrapper" } }, (res) => {
        const { statusCode, headers } = res;
        if (statusCode >= 300 && statusCode < 400 && headers.location) {
          res.resume();
          return resolve(download(headers.location, dest, redirects + 1));
        }
        if (statusCode !== 200) {
          res.resume();
          return reject(new Error("HTTP " + statusCode + " for " + url));
        }
        const tmp = dest + ".part";
        pipeline(res, fs.createWriteStream(tmp))
          .then(
            () =>
              new Promise((res2, rej2) => {
                fs.createReadStream(tmp)
                  .pipe(zlib.createGunzip())
                  .pipe(fs.createWriteStream(dest))
                  .on("finish", () => {
                    try {
                      fs.unlinkSync(tmp);
                    } catch (_) {}
                    res2();
                  })
                  .on("error", rej2);
              })
          )
          .then(resolve)
          .catch(reject);
      })
      .on("error", reject);
  });
}

async function ensureBinary() {
  fs.mkdirSync(BIN_DIR, { recursive: true });
  const force = process.env.ZES_BACKEND_FORCE === "1";
  if (fs.existsSync(BIN_PATH) && !force) {
    fs.chmodSync(BIN_PATH, 0o755);
    console.log("[wrapper] using cached backend: " + BIN_PATH);
    return;
  }
  console.log("[wrapper] downloading backend from " + BIN_URL);
  await download(BIN_URL, BIN_PATH);
  fs.chmodSync(BIN_PATH, 0o755);
  console.log(
    "[wrapper] downloaded backend: " + fs.statSync(BIN_PATH).size + " bytes"
  );
}

function run() {
  console.log(
    "[wrapper] spawning backend (PORT=" + (process.env.PORT || "3000") + ")"
  );
  const child = spawn(BIN_PATH, process.argv.slice(2), {
    cwd: APP_DIR,
    env: process.env,
    stdio: "inherit",
  });
  child.on("error", (err) => {
    console.error("[wrapper] failed to start backend: " + err.stack);
    setTimeout(run, 5000);
  });
  child.on("exit", (code, signal) => {
    console.error(
      "[wrapper] backend exited (code=" +
        code +
        ", signal=" +
        signal +
        "); restarting in 3s"
    );
    setTimeout(run, 3000);
  });
}

process.on("uncaughtException", (e) =>
  console.error("[wrapper] uncaught: " + e.stack)
);
process.on("unhandledRejection", (e) =>
  console.error("[wrapper] unhandled: " + (e && e.stack ? e.stack : e))
);

(async () => {
  try {
    await ensureBinary();
    run();
  } catch (e) {
    console.error("[wrapper] fatal: " + (e && e.stack ? e.stack : e));
    process.exit(1);
  }
})();
