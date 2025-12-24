import { config, getBaseUrl } from "../../../server/config.js";
import { response } from "../../../server/response.js";
import { getPumps, updatePumps } from "./controllers.js";

export function pumpMiddleware(req, res) {
  if (req.method === "GET" && req.url === config.BASE_PATH + "/pumps") {
    return response(res, getPumps());
  }

  if (
    req.method === "PATCH" &&
    req.url.startsWith(config.BASE_PATH + "/pumps?")
  ) {
    const url = new URL(getBaseUrl() + req.url);
    const pumpId = url.searchParams.get("pumpId");

    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      return response(res, updatePumps(pumpId, data));
    });
  }
}
