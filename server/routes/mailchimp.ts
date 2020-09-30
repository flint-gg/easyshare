import express from 'express';
import { subscribeEmailToMailchimp } from '../switch-share/mailchimp';
import { mailchimpSubscribePolicy } from './switchPolicies';
import { getSwitchAuthMiddleware } from '../tokenGen';

const app = express.Router();

app.post('/', mailchimpSubscribePolicy, async (req, res) => res.status(200).json({ success: await subscribeEmailToMailchimp(req.body.email) }));

app.post('/authed', getSwitchAuthMiddleware(), mailchimpSubscribePolicy, async (req, res) => res.status(200).json({ success: await subscribeEmailToMailchimp(req.body.email, req.user.id) }));

export default app;
