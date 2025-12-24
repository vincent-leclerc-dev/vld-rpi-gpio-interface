export const config = {
  PORT: 3000,
  PROTOCOL: "http",
  HOST: "localhost",
  BASE_PATH: "/api",
};

export function getBaseUrl() {
  return `${config.PROTOCOL}://${config.HOST}:${config.PORT}${config.BASE_PATH}`;
}
