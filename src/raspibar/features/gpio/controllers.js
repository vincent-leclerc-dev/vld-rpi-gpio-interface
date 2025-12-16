import { spawn } from "child_process";

import configFile from "../../../config/config.json" with { type: "json" };

export function getGpios() {
  return configFile.gpios;
}

export function getGpiosAvailable() {
  const gpiosLinked = configFile.pumps.map((pump) => pump.gpio);
  return configFile.gpios.filter((gpio) => !gpiosLinked.includes(gpio.id));
}

export function activateGpio(id, during) {
  if (!id || !during) return 'Parameters "id" and "during" are mandatory.';

  const pythonProcess = spawn("/usr/bin/python", [
    "/root/vld-rpi-gpio-interface/gpio-rpi3.py",
    id,
    during,
  ]);
  pythonProcess.stdout.on("data", (data) => console.log("callback: ", data));
  return `Command activate GPIO ${id} during ${during}s was executed successfully.`;
}
