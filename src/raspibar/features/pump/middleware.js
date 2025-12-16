import { response } from "../../../server/response.js";
import {
  getPumps,
  getPumpsAsIngredients,
  updatePumpIngredient,
  updatePumps,
} from "./controllers.js";

export function pumpMiddleware(req, res) {
  if (req.method === "GET" && req.url === "/pumps") {
    return response(res, 200, getPumps());
  }

  if (req.method === "GET" && req.url === "/pumps-as-ingredients") {
    return response(res, 200, getPumpsAsIngredients());
  }

  if (req.method === "PATCH" && req.url.startsWith("/pumps-as-ingredients")) {
    const matches = req.url.match(
      /\/pumps-as-ingredients\?pumpId=(?<pumpId>[0-9]+)&ingredientId=(?<ingredientId>.*)/
    );
    if (!matches) return response(res, 404, `Route ${req.url} was not found.`);

    const { pumpId, ingredientId } = matches["groups"];

    return response(res, 200, updatePumpIngredient(pumpId, ingredientId));
  }

  if (req.method === "PATCH" && req.url.startsWith("/pumps")) {
    const matches = req.url.match(
      /\/pumps\?pumpId=(?<pumpId>[0-9]+)&gpioId=(?<gpioId>[0-9]+)/
    );
    if (!matches) return response(res, 404, `Route ${req.url} was not found.`);

    const { pumpId, gpioId } = matches["groups"];

    return response(res, 200, updatePumps(pumpId, gpioId));
  }
}
