import * as fs from "node:fs";

export const configFileName = "./config.json";

export function updateConfig(data) {
  if (!data) return;

  data = JSON.parse(data);

  fs.writeFile(
    configFileName,
    JSON.stringify(data, null, 4),
    function writeJSON(err) {
      if (err) return console.log(err);
      console.log("writing config file successfully.");
    }
  );
}
