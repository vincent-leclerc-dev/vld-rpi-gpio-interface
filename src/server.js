import * as http from "node:http";

import { config } from "./server/config.js";
import { serverMiddleware } from "./server/middleware.js";

import { gpioMiddleware } from "./raspibar/features/gpio/middleware.js";
import { ingredientMiddleware } from "./raspibar/features/ingredient/middleware.js";
import { pumpMiddleware } from "./raspibar/features/pump/middleware.js";

http
  .createServer(async (req, res) => {
    serverMiddleware(req);
    gpioMiddleware(req, res);
    ingredientMiddleware(req, res);
    pumpMiddleware(req, res);
  })
  .listen(config.PORT, config.HOST);

console.log(`Server running at http://${config.HOST}:${config.PORT}/`);
