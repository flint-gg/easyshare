import express from 'express';
import { subscribeEmailToMailchimp } from '../switch-share/mailchimp';
import { mailchimpSubscribePolicy } from './switchPolicies';

const app = express.Router();

app.post('/', mailchimpSubscribePolicy, async (req, res) => res.status(200).send(await subscribeEmailToMailchimp(req.body.email)));

export default app;
