export function response(res, result) {
  if (!result.code || !result.message) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end({ code: 500, message: "Response must have a code and a message" });
    return false;
  }

  res.writeHead(result.code, { "Content-Type": "application/json" });
  res.end(JSON.stringify(result.message));
  return true;
}
