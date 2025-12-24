import { config, getBaseUrl } from "../../../server/config.js";
import { response } from "../../../server/response.js";
import { activateGpio, getGpios, getGpiosAvailable } from "./controllers.js";

export function gpioMiddleware(req, res) {
  if (req.method === "GET" && req.url === config.BASE_PATH + "/gpios") {
    return response(res, getGpios());
  }

  if (
    req.method === "GET" &&
    req.url === config.BASE_PATH + "/gpios-available"
  ) {
    return response(res, getGpiosAvailable());
  }

  if (
    req.method === "GET" &&
    req.url.startsWith(config.BASE_PATH + "/gpio-activate")
  ) {
    const url = new URL(getBaseUrl() + req.url);
    const id = url.searchParams.get("id");
    const during = url.searchParams.get("during");
    return response(res, activateGpio(id, during));
  }
}
