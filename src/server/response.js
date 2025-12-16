export function response(res, status = 200, message = "success") {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ status, message }));
  return;
}
