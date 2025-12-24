import { spawn } from "child_process";

import configFile from "../../../config/config.json" with { type: "json" };

export function getGpios() {
  return {
    code: 200,
    message: configFile.gpios,
  };
}

export function getGpiosAvailable() {
  const gpiosLinked = configFile.pumps.map((pump) => pump.gpio);
  return {
    code: 200,
    message: configFile.gpios.filter((gpio) => !gpiosLinked.includes(gpio.id)),
  };
}

export function activateGpio(id, during) {
  if (!id || !during) {
    return {
      code: 400,
      message: 'Parameters "id" and "during" are mandatory.',
    };
  }
  try {
    const pythonProcess = spawn("/usr/bin/python", [
      "/root/vld-rpi-gpio-interface/gpio-rpi3.py",
      id,
      during,
    ]);

    pythonProcess.stdout.on("data", (data) => console.log("callback: ", data));

    return {
      code: 200,
      message: `Command activate GPIO ${id} during ${during}s was executed successfully.`,
    };
  } catch (error) {
    return { code: 500, message: error?.message || "error" };
  }
}
