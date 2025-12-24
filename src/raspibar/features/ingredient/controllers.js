import * as crypto from "node:crypto";

import configFile from "../../../config/config.json" with { type: "json" };
import { updateConfig } from "../../../config/service.js";

export function getIngredients() {
  return {
    code: 200,
    message: configFile.ingredients,
  };
}

export function createIngredients(data) {
  if (!data) {
    return { code: 400, message: "Parameter 'body' is mandatory." };
  }

  data = JSON.parse(data);

  if (!data.name) {
    return {
      code: 400,
      message: "Parameter 'name' is mandatory.",
    };
  }

  if (
    configFile.ingredients.find(
      (ingredient) => ingredient.name.toLowerCase() === data.name.toLowerCase()
    )
  ) {
    return {
      code: 409,
      message: `Ingredient '${data.name.toLowerCase()}' already exist.`,
    };
  }

  data.id = crypto.randomUUID();

  configFile.ingredients.push(data);

  updateConfig(JSON.stringify(configFile));

  return { code: 200, message: data };
}

export function updateIngredient(ingredientId, data) {
  if (!ingredientId) {
    return {
      code: 400,
      message: 'Parameters "ingredientId" is mandatory.',
    };
  }

  if (
    !configFile.ingredients.find((ingredient) => {
      return ingredientId === ingredient.id;
    })
  ) {
    return {
      code: 400,
      message: `Ingredient ${ingredientId} not exist.`,
    };
  }

  if (!data) {
    return {
      code: 400,
      message: 'Parameters "data" is mandatory.',
    };
  }

  configFile.ingredients.forEach((ingredient) => {
    if (ingredient.id == ingredientId) {
      ingredient.name = data.name || ingredient.name;
    }
  });

  updateConfig(JSON.stringify(configFile));

  return {
    code: 200,
    message: `Ingredient ${ingredientId} was updated successfully.`,
  };
}

export function deleteIngredients(id) {
  if (!id) {
    return { code: 400, message: "Parameter 'id' is mandatory." };
  }

  if (!configFile.ingredients.find((ingredient) => id === ingredient.id)) {
    return {
      code: 400,
      message: `Ingredient ${id} not exist.`,
    };
  }

  const ingredientLinked = configFile["pumps-as-ingredients"].find(
    (ingredientLinked) => id === ingredientLinked.ingredient
  );
  if (ingredientLinked) {
    return {
      code: 409,
      message: `Can't delete ingredient ${id} because it is linked to pump ${ingredientLinked.pump}.`,
    };
  }

  configFile.ingredients = configFile.ingredients.filter(
    (ingredient) => ingredient.id !== id
  );

  updateConfig(JSON.stringify(configFile));

  return {
    code: 200,
    message: "deleted",
  };
}
