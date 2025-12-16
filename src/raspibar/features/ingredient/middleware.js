import { response } from "../../../server/response.js";
import {
  createIngredients,
  deleteIngredients,
  getIngredients,
} from "./controllers.js";

export function ingredientMiddleware(req, res) {
  if (req.method === "GET" && req.url === "/ingredients") {
    return response(res, 200, getIngredients());
  }

  if (req.method === "POST" && req.url === "/ingredients") {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      return response(res, 200, createIngredients(data));
    });
  }

  if (req.method === "DELETE" && req.url.startsWith("/ingredients")) {
    const matches = req.url.match(/\/ingredients\?id=(?<id>.*)/);
    if (!matches) return response(res, 404, `Route ${req.url} was not found.`);

    const { id } = matches["groups"];
    return response(res, 200, deleteIngredients(id));
  }
}
