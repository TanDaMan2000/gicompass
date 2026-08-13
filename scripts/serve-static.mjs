import { createReadStream, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve, sep } from "node:path";

const root = resolve(process.argv[2] ?? ".");
const port = Number(process.argv[3] ?? 4173);

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
};

createServer((request, response) => {
  const requestPath = decodeURIComponent(new URL(request.url ?? "/", "http://localhost").pathname);
  let filePath = normalize(join(root, requestPath));

  if (filePath !== root && !filePath.startsWith(root + sep)) {
    response.writeHead(403).end("Forbidden");
    return;
  }

  try {
    if (statSync(filePath).isDirectory()) {
      filePath = join(filePath, "index.html");
    }

    const file = statSync(filePath);
    response.writeHead(200, {
      "Content-Length": file.size,
      "Content-Type": contentTypes[extname(filePath).toLowerCase()] ?? "application/octet-stream",
    });
    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("Not found");
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`Serving ${root} at http://127.0.0.1:${port}`);
});
