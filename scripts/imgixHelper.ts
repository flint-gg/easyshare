import axios from 'axios';
// imgix API key to purge outdated profile pictures
const secureURLToken = process.env.IMGIX_TOKEN;

if (!secureURLToken) {
  throw new Error('Imgix secret missing from environment.');
}

const purge = async (imgURL) => axios.post('https://api.imgix.com/v2/image/purger', { url: imgURL }, {
  auth: { username: secureURLToken as string, password: '' },
});

export default { purge };
