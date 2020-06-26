import { Twitter } from 'twitter-lite';
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
  username?: string,
) {
  // for some reason mailchimp wants an MD5 hash of the email
  const emailAdressHashed: string = md5(email);
  const merge_fields = username
    ? {
      USERNAME: username,
    }
    : {};
  try {
    await axios.put(
      `${mailchimpURL}lists/${listID}/members/${emailAdressHashed}`,
      {
        email_address: email,
        merge_fields,
        status: 'subscribed',
        status_if_new: 'subscribed',
        tags: ['easyshare'],
      },
      { auth: { username: 'flint.gg', password: mailchimpAPIK } },
    );
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

export async function subscribeUserToMailchimp(userId: flintId) {
  const user = await getUser(userId);
  if (!user) {
    throw new Error('User does not exist.');
  }

  const email: string = ''; // TODO get from twitter API? - creating in twitter.ts
  return subscribeEmailToMailchimp(email, user.name);
}
