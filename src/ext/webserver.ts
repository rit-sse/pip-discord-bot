import { WEBSERVER_PORT, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SIGNING_SECRET, REDIRECT_URI } from '../config.js';
import { verify } from '../ext/integrity.js';
import express from 'express';
import { OAuth2Payload } from '../types.js';

const app = express();
const port = WEBSERVER_PORT;

app.use(express.json());

app.get('/api/auth', async (req, res) => {
    const invalidRequest = (message: string) => res.status(400).send(message || 'Invalid request');
    try {
        const searchParams = req.query as { [key: string]: string };
        const signedPayload = searchParams.state;
        const code = searchParams.code;
        const payload = verify(signedPayload, SIGNING_SECRET); // We use secrets so the client can't forge requests
        const {discord, server} = JSON.parse(payload || '{}') as OAuth2Payload;
        if (!payload || !code || !discord || !server) {
            return invalidRequest("Missing required parameters");
        }

        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                code,
                client_id: GOOGLE_CLIENT_ID,
                client_secret: GOOGLE_CLIENT_SECRET,
                redirect_uri: REDIRECT_URI,
                grant_type: 'authorization_code'
            }).toString()
        });

        const tokenRequestBody = await tokenResponse.json();
        if (!tokenRequestBody.access_token) {
            return invalidRequest("No access token received");
        }

        const infoRequest = await fetch('https://www.googleapis.com/oauth2/v2/userinfo?access_token=' + tokenRequestBody.access_token);
        const infoRequestBody = await infoRequest.json();
        if (infoRequestBody.hd !== 'g.rit.edu' && infoRequestBody.hd !== 'rit.edu') {
            return res.status(403).send('Please use your RIT email to verify.');
        }
        // The user is now verified to have a g.rit.edu email address!

        const email = infoRequestBody.email;
        const name = infoRequestBody.name;

        console.log(`Verified ${email} (${name}) for Discord user ${discord} in server ${server}`);

        // TODO: Link `discord` with `email` in db
        // TODO: Change username to `name`
        // TODO: Assign verified role

        res.send(`Successfully verified ${email} (${name})! You may close this window and return to Discord.`);

    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error('Error during /api/auth:', errorMessage);
        res.status(500).send('Server error: An unexpected error occurred.');
    }
});

const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

export default server;