import { config, getBaseUrl } from "../../../server/config.js";
import { response } from "../../../server/response.js";
import {
  createRecipes,
  deleteRecipes,
  getRecipe,
  getRecipes,
  updateRecipe,
} from "./controllers.js";

export function recipeMiddleware(req, res) {
  if (req.method === "GET" && req.url === config.BASE_PATH + "/recipes") {
    return response(res, getRecipes());
  }

  if (req.method === "POST" && req.url === config.BASE_PATH + "/recipes") {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      return response(res, createRecipes(data));
    });
  }

  if (
    req.method === "GET" &&
    req.url.startsWith(config.BASE_PATH + "/recipes")
  ) {
    const url = new URL(getBaseUrl() + req.url);
    const recipeId = url.searchParams.get("recipeId");
    return response(res, getRecipe(recipeId));
  }

  if (
    req.method === "PATCH" &&
    req.url.startsWith(config.BASE_PATH + "/recipes")
  ) {
    const url = new URL(getBaseUrl() + req.url);
    const recipeId = url.searchParams.get("recipeId");

    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      return response(res, updateRecipe(recipeId, JSON.parse(data)));
    });
  }

  if (
    req.method === "DELETE" &&
    req.url.startsWith(config.BASE_PATH + "/recipes")
  ) {
    const url = new URL(getBaseUrl() + req.url);
    const recipeId = url.searchParams.get("recipeId");

    return response(res, deleteRecipes(recipeId));
  }
}
