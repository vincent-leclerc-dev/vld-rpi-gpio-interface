export function serverMiddleware(req) {
  // ignore favicon request
  if (req.url === "/favicon.ico") return;

  console.log(
    `input request ${req.method} "${req.url}" at "${new Date().toISOString()}"`
  );
}
