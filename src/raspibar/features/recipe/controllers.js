import * as crypto from "node:crypto";

import configFile from "../../../config/config.json" with { type: "json" };
import { updateConfig } from "../../../config/service.js";

export function getRecipes() {
  return {
    code: 200,
    message: configFile.recipes,
  };
}

export function getRecipe(recipeId) {
  if (!recipeId) {
    return { code: 400, message: "Parameter 'recipeId' is mandatory." };
  }

  return {
    code: 200,
    message: configFile.recipes.find((recipe) => recipe.id === recipeId),
  };
}

export function createRecipes(data) {
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
    configFile.recipes.find(
      (recipe) => recipe.name.toLowerCase() === data.name.toLowerCase()
    )
  ) {
    return {
      code: 409,
      message: `Recipe '${data.name.toLowerCase()}' already exist.`,
    };
  }

  data.id = crypto.randomUUID();

  configFile.recipes.push(data);

  updateConfig(JSON.stringify(configFile));

  return { code: 200, message: data };
}

export function updateRecipe(recipeId, data) {
  if (!recipeId) {
    return {
      code: 400,
      message: 'Parameters "recipeId" is mandatory.',
    };
  }

  if (
    !configFile.recipes.find((recipe) => {
      return recipeId === recipe.id;
    })
  ) {
    return {
      code: 400,
      message: `Recipe ${recipeId} not exist.`,
    };
  }

  if (!data) {
    return {
      code: 400,
      message: 'Parameters "data" is mandatory.',
    };
  }

  configFile.recipes.forEach((recipe) => {
    if (recipe.id == recipeId) {
      recipe.name = data.name || recipe.name;
      recipe.ingredients = data.ingredients || recipe.ingredients;
      recipe.steps = data.steps || recipe.steps;
    }
  });

  updateConfig(JSON.stringify(configFile));

  return {
    code: 200,
    message: `Recipe ${recipeId} was updated successfully.`,
  };
}

export function deleteRecipes(id) {
  if (!id) {
    return { code: 400, message: "Parameter 'id' is mandatory." };
  }

  if (!configFile.recipes.find((recipe) => id === recipe.id)) {
    return {
      code: 400,
      message: `Recipe ${id} not exist.`,
    };
  }

  configFile.recipes = configFile.recipes.filter((recipe) => recipe.id !== id);

  updateConfig(JSON.stringify(configFile));

  return {
    code: 200,
    message: "deleted",
  };
}
