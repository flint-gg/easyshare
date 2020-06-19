let url: string;
const host = process.env.HOST;
const port = process.env.PORT || 8081;

let siteUrl = process.env.SITE_URL || host;

if (process.env.NODE_ENV === 'development') {
  url = 'http://localhost:3000/';
  siteUrl = 'localhost';
} else {
  url = `https://${siteUrl}/`;
}

function getURL() {
  return url;
}

function getServerOptions() {
  return {
    host: siteUrl,
    port,
    path: '/',
    origins: [] as string[],
  };
}
export default {
  getURL,
  getServerOptions,
};
