export const config = {
  PORT: 3000,
  PROTOCOL: "http",
  HOST: "192.168.1.15",
  BASE_PATH: "/api",
};

export function getBaseUrl() {
  return `${config.PROTOCOL}://${config.HOST}:${config.PORT}${config.BASE_PATH}`;
}
