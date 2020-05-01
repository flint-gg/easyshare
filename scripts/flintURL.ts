let url: string;
const host = process.env.HOST || 'www.flint.gg';
const port = process.env.PORT || 8081;

let websocketURL = process.env.SITE_URL || host;

if (process.env.NODE_ENV === 'development') {
  url = 'http://localhost:3000/';
  websocketURL = 'localhost';
} else {
  url = `https://${websocketURL}/`;
}

function getURL() {
  return url;
}

function getWebsocketOptions() {
  return {
    host: websocketURL,
    port,
    path: '/',
    origins: [] as string[],
  };
}

function getWebsocketURL() {
  if (process.env.NODE_ENV === 'development') {
    return `http://${websocketURL}:${port}`;
  }
  return `https://${websocketURL}`;
}

function getWebsocketPort() {
  return port;
}

export default {
  getURL,
  getWebsocketOptions,
  getWebsocketPort,
  getWebsocketURL,
};
