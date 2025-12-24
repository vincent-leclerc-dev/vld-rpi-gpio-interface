import configFile from "../../../config/config.json" with { type: "json" };
import { updateConfig } from "../../../config/service.js";

export function getPumpsAsIngredients() {
  return {
    code: 200,
    message: configFile["pumps-as-ingredients"],
  };
}

export function updatePumpIngredient(pumpId, ingredientId) {
  if (!pumpId || !ingredientId) {
    return {
      code: 400,
      message: 'Parameters "pumpId" and "ingredientId" are mandatory.',
    };
  }

  if (
    !configFile.ingredients.find((ingredient) => ingredientId === ingredient.id)
  ) {
    return {
      code: 400,
      message: `ingredient ${ingredientId} not exist.`,
    };
  }

  if (!configFile.pumps.find((pump) => pumpId === pump.id)) {
    return {
      code: 409,
      message: `Pump ${pumpId} not exist.`,
    };
  }

  const ingredientLinked = configFile["pumps-as-ingredients"].find(
    (ingredientLinked) => ingredientId === ingredientLinked.ingredientId
  );
  if (ingredientLinked) {
    return {
      code: 409,
      message: `ingredient ${ingredientId} is already linked to pump ${ingredientLinked.pumpId}`,
    };
  }

  configFile["pumps-as-ingredients"].forEach((ingredientLinked) => {
    ingredientLinked.pumpId == pumpId
      ? (ingredientLinked.ingredientId = ingredientId)
      : ingredientLinked.ingredientId;
  });

  updateConfig(JSON.stringify(configFile));

  return {
    code: 200,
    message: `Ingredient ${ingredientId} was linked to pump ${pumpId} successfully.`,
  };
}
