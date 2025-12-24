export function serverMiddleware(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Request-Method", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  // ignore favicon request
  if (req.url === "/favicon.ico") return;

  console.log(
    `input request ${req.method} "${req.url}" at "${new Date().toISOString()}"`
  );
}
