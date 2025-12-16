import configFile from "../../../config/config.json" with { type: "json" };
import { updateConfig } from "../../../config/service.js";

export function getPumps() {
  return configFile.pumps;
}

export function getPumpsAsIngredients() {
  return configFile["pumps-as-ingredients"];
}

export function updatePumps(pumpId, gpioId) {
  if (!pumpId || !gpioId)
    return 'Parameters "pumpId" and "gpioId" are mandatory.';

  if (!configFile.gpios.find((gpio) => parseInt(gpioId) === gpio.id)) {
    return `GPIO ${gpioId} not exist.`;
  }

  if (!configFile.pumps.find((pump) => parseInt(pumpId) === pump.id)) {
    return `Pump ${pumpId} not exist.`;
  }

  const alreadyLinked = configFile.pumps.find(
    (pump) => parseInt(gpioId) === pump.gpio
  );
  if (alreadyLinked) {
    return `GPIO ${gpioId} is already linked to pump ${alreadyLinked.id}`;
  }

  configFile.pumps.forEach((pump) => {
    pump.id == pumpId ? (pump.gpio = parseInt(gpioId)) : pump.gpioId;
  });

  updateConfig(JSON.stringify(configFile));

  return `Pump ${pumpId} was linked to gpio ${gpioId} successfully.`;
}

export function updatePumpIngredient(pumpId, ingredientId) {
  if (!pumpId || !ingredientId)
    return 'Parameters "pumpId" and "ingredientId" are mandatory.';

  if (
    !configFile.ingredients.find((ingredient) => ingredientId === ingredient.id)
  ) {
    return `ingredient ${ingredientId} not exist.`;
  }

  if (!configFile.pumps.find((pump) => parseInt(pumpId) === pump.id)) {
    return `Pump ${pumpId} not exist.`;
  }

  const ingredientLinked = configFile["pumps-as-ingredients"].find(
    (ingredientLinked) => ingredientId === ingredientLinked.ingredient
  );
  if (ingredientLinked) {
    return `ingredient ${ingredientId} is already linked to pump ${ingredientLinked.pump}`;
  }

  configFile["pumps-as-ingredients"].forEach((ingredientLinked) => {
    ingredientLinked.pump == pumpId
      ? (ingredientLinked.ingredient = ingredientId)
      : ingredientLinked.ingredient;
  });

  updateConfig(JSON.stringify(configFile));

  return `Ingredient ${ingredientId} was linked to pump ${pumpId} successfully.`;
}
