import { config, getBaseUrl } from "../../../server/config.js";
import { response } from "../../../server/response.js";
import {
  createIngredients,
  deleteIngredients,
  getIngredients,
  updateIngredient,
} from "./controllers.js";

export function ingredientMiddleware(req, res) {
  if (req.method === "GET" && req.url === config.BASE_PATH + "/ingredients") {
    return response(res, getIngredients());
  }

  if (req.method === "POST" && req.url === config.BASE_PATH + "/ingredients") {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      return response(res, createIngredients(data));
    });
  }

  if (
    req.method === "PATCH" &&
    req.url.startsWith(config.BASE_PATH + "/ingredients")
  ) {
    const url = new URL(getBaseUrl() + req.url);
    const ingredientId = url.searchParams.get("ingredientId");

    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      return response(res, updateIngredient(ingredientId, JSON.parse(data)));
    });
  }

  if (
    req.method === "DELETE" &&
    req.url.startsWith(config.BASE_PATH + "/ingredients")
  ) {
    const url = new URL(getBaseUrl() + req.url);
    const ingredientId = url.searchParams.get("ingredientId");

    return response(res, deleteIngredients(ingredientId));
  }
}
