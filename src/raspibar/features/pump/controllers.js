import configFile from "../../../config/config.json" with { type: "json" };
import { updateConfig } from "../../../config/service.js";

export function getPumps() {
  return {
    code: 200,
    message: configFile.pumps,
  };
}

export function updatePumps(pumpId, data) {
  if (!pumpId) {
    return {
      code: 400,
      message: 'Parameters "pumpId" is mandatory.',
    };
  }

  if (!data) {
    return {
      code: 400,
      message: 'Parameters "data" is mandatory.',
    };
  }

  const jsonData = JSON.parse(data);

  if (
    !configFile.gpios.find((gpio) => {
      return parseInt(jsonData.gpio) === parseInt(gpio.id);
    })
  ) {
    return {
      code: 400,
      message: `GPIO ${jsonData.gpio} not exist.`,
    };
  }

  if (!configFile.pumps.find((pump) => pumpId === pump.id)) {
    return {
      code: 400,
      message: `Pump ${pumpId} not exist.`,
    };
  }

  const alreadyLinked = configFile.pumps.find(
    (pump) => parseInt(jsonData.gpio) === pump.gpio && pump.id !== pumpId
  );
  if (alreadyLinked) {
    return {
      code: 409,
      message: `GPIO ${jsonData.gpio} is already linked to pump ${alreadyLinked.id}`,
    };
  }

  configFile.pumps.forEach((pump) => {
    if (pump.id == pumpId) {
      pump.gpio = parseInt(jsonData.gpio) || pump.gpioId;
      pump.name = jsonData.name || pump.name;
    }
  });

  updateConfig(JSON.stringify(configFile));

  return {
    code: 200,
    message: `Pump ${pumpId} was linked to gpio ${jsonData.gpio} successfully.`,
  };
}
