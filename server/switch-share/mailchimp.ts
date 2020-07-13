import axios from 'axios';
import md5 from 'md5';
import { mailchimpSubscribe } from '../../types/enums';
import { getUser } from './db-queries';

if (!process.env.MAILCHIMP_API_KEY) {
  throw new Error('Mailchimp API key missing.');
}

const mailchimpURL = 'https://us7.api.mailchimp.com/3.0/';
const mailchimpAPIK = process.env.MAILCHIMP_API_KEY;
const listID = 'c0b6128347';

export async function subscribeEmailToMailchimp(
  email: string,
  userID?: flintId,
) {
  // for some reason mailchimp wants an MD5 hash of the email
  const emailAdressHashed: string = md5(email);
  const user = userID ? await getUser(userID) : null;
  if (userID && !user) {
    throw new Error(`User with ID ${userID} does not exist.`);
  }
  const merge_fields = user
    ? {
      USERNAME: user.name,
    }
    : {};
  try {
    await axios.put(
      `${mailchimpURL}lists/${listID}/members/${emailAdressHashed}`,
      {
        email_address: email,
        merge_fields,
        /*         status: 'subscribed', */
        status_if_new: 'pending', // send double opt in email from mailchimp
        tags: ['easyshare'],
      },
      { auth: { username: 'flint.gg', password: mailchimpAPIK } },
    );
    if (user) {
      // TODO mark user as already subscribed in DB
    }
    return mailchimpSubscribe.success;
  } catch (e) {
    if (e.response && e.response.data) {
      if (e.response.data.title === 'Member Exists') {
        // this should never occur
        return mailchimpSubscribe.already;
      }
      throw new Error(e.response.data.title);
    }
    throw new Error('Failed connecting to the mailchimp server.');
  }
}
