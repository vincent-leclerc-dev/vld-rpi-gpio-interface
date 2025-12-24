import { config, getBaseUrl } from "../../../server/config.js";
import { response } from "../../../server/response.js";
import { getPumpsAsIngredients, updatePumpIngredient } from "./controllers.js";

export function pumpAsIngredientMiddleware(req, res) {
  if (
    req.method === "GET" &&
    req.url === config.BASE_PATH + "/pumps-as-ingredients"
  ) {
    return response(res, getPumpsAsIngredients());
  }

  if (
    req.method === "PATCH" &&
    req.url.startsWith(config.BASE_PATH + "/pumps-as-ingredients?")
  ) {
    const url = new URL(getBaseUrl() + req.url);

    const pumpId = url.searchParams.get("pumpId");
    const ingredientId = url.searchParams.get("ingredientId");

    return response(res, updatePumpIngredient(pumpId, ingredientId));
  }
}
