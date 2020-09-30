import axios from 'axios';
import md5 from 'md5';
import { mailchimpSubscribe } from '../../types/enums';
import { getUser, addUserEmail } from './db-queries';

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
    const response = await axios.put<mailchimpResponse>(
      `${mailchimpURL}lists/${listID}/members/${emailAdressHashed}`,
      {
        email_address: email,
        merge_fields,
        status_if_new: 'pending', // send double opt in email from mailchimp
        tags: ['easyshare'],
      },
      { auth: { username: 'flint.gg', password: mailchimpAPIK } },
    );
    const mail = response.data.email_address;
    if (user) {
      await addUserEmail(user.id, mail);
    }
    if (response.data.status === 'subscribed') {
      return mailchimpSubscribe.already;
    }
    if (response.data.status === 'pending') {
      return mailchimpSubscribe.success;
    }
    return mailchimpSubscribe.failure;
  } catch (e) {
    if (e.response && e.response.data) {
      throw new Error(e.response.data.title);
    }
    throw new Error('Failed connecting to the mailchimp server.');
  }
}
