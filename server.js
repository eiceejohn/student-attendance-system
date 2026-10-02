"use strict";

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const HOST = "0.0.0.0";
const PORT = Number(process.env.PORT) || 3000;
const PUBLIC_DIRECTORY = __dirname;

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".csv": "text/csv; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp"
};

const DEPLOYMENT_FILES = new Set([
  "/package.json",
  "/server.js",
  "/README.md",
  "/GITHUB-PAGES-GUIDE.md",
  "/RAILWAY-GUIDE.md"
]);

function send(response, statusCode, contentType, body) {
  response.writeHead(statusCode, {
    "Content-Type": contentType,
    "Content-Length": Buffer.byteLength(body),
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  });
  response.end(body);
}

function resolveRequestPath(requestUrl) {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(requestUrl, "http://localhost").pathname);
  } catch {
    return null;
  }

  if (pathname === "/") pathname = "/index.html";
  if (DEPLOYMENT_FILES.has(pathname) || pathname.startsWith("/.")) return null;

  const absolutePath = path.resolve(PUBLIC_DIRECTORY, "." + pathname);
  const relativePath = path.relative(PUBLIC_DIRECTORY, absolutePath);
  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) return null;
  return absolutePath;
}

const server = http.createServer((request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.setHeader("Allow", "GET, HEAD");
    return send(response, 405, "text/plain; charset=utf-8", "Method Not Allowed");
  }

  if (request.url === "/health" || request.url === "/health/") {
    return send(response, 200, "application/json; charset=utf-8", JSON.stringify({ status: "ok" }));
  }

  const filePath = resolveRequestPath(request.url);
  if (!filePath) return send(response, 404, "text/plain; charset=utf-8", "Not Found");

  fs.stat(filePath, (statError, stats) => {
    if (statError || !stats.isFile()) {
      return send(response, 404, "text/plain; charset=utf-8", "Not Found");
    }

    const contentType = MIME_TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream";
    response.writeHead(200, {
      "Content-Type": contentType,
      "Content-Length": stats.size,
      "Cache-Control": filePath.endsWith("index.html") ? "no-cache" : "public, max-age=3600",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "SAMEORIGIN",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    });

    if (request.method === "HEAD") return response.end();
    const stream = fs.createReadStream(filePath);
    stream.on("error", () => {
      if (!response.headersSent) send(response, 500, "text/plain; charset=utf-8", "Server Error");
      else response.destroy();
    });
    stream.pipe(response);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Student Attendance System running at http://${HOST}:${PORT}`);
});

function shutDown() {
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10000).unref();
}

process.on("SIGTERM", shutDown);
process.on("SIGINT", shutDown);
