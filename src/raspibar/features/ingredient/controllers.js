import * as crypto from "node:crypto";

import configFile from "../../../config/config.json" with { type: "json" };
import { updateConfig } from "../../../config/service.js";

export function getIngredients() {
  return configFile.ingredients;
}

export function createIngredients(data) {
  if (!data) return "Parameter 'body' is mandatory.";

  data = JSON.parse(data);

  if (!data.name) return "Parameter 'name' is mandatory.";

  if (
    configFile.ingredients.find(
      (ingredient) => ingredient.name.toLowerCase() === data.name.toLowerCase()
    )
  ) {
    return `Ingredient '${data.name.toLowerCase()}' already exist.`;
  }

  data.id = crypto.randomUUID();

  configFile.ingredients.push(data);

  updateConfig(JSON.stringify(configFile));

  return `Ingredient ${data.name} was created successfully.`;
}

export function deleteIngredients(id) {
  if (!id) return "Parameter 'id' is mandatory.";

  if (!configFile.ingredients.find((ingredient) => id === ingredient.id)) {
    return `Ingredient ${id} not exist.`;
  }

  const ingredientLinked = configFile["pumps-as-ingredients"].find(
    (ingredientLinked) => id === ingredientLinked.ingredient
  );
  if (ingredientLinked) {
    return `Can't delete ingredient ${id} because it is linked to pump ${ingredientLinked.pump}.`;
  }

  configFile.ingredients = configFile.ingredients.filter(
    (ingredient) => ingredient.id !== id
  );

  updateConfig(JSON.stringify(configFile));

  return `Ingredient ${id} was deleted successfully.`;
}
