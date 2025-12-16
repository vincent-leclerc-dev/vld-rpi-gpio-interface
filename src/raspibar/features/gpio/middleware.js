import { response } from "../../../server/response.js";
import { activateGpio, getGpios, getGpiosAvailable } from "./controllers.js";

export function gpioMiddleware(req, res) {
  if (req.method === "GET" && req.url === "/gpios") {
    return response(res, 200, getGpios());
  }

  if (req.method === "GET" && req.url === "/gpios/available") {
    return response(res, 200, getGpiosAvailable());
  }

  if (req.method === "GET" && req.url.startsWith("/gpio")) {
    try {
      const matches = req.url.match(
        /\/gpio\/activate\?id=(?<id>[0-9]+)&during=(?<during>[0-9]+)/
      );

      if (!matches)
        return response(res, 404, `Route ${req.url} was not found.`);

      const { id, during } = matches["groups"];
      const message = activateGpio(id, during);
      return response(res, 200, message);
    } catch (error) {
      return response(res, 500, error?.message || "error");
    }
  }
}
