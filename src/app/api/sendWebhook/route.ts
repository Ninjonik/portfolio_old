// pages/api/sendWebhook.ts

import { NextApiResponse } from 'next';

export async function POST(req: Request, res: NextApiResponse) {
    try {
        const reqRes = await req.json()
        const { email, subject, message } = reqRes

        const webhookUrl = process.env.DISCORD_WEBHOOK_URL ?? "error"
        if(webhookUrl === 'error'){
            throw new Error('Discord webhook url not set.')
        }

        if (!email || !subject || !message) {
            return Response.json({ error: 'Invalid request body' }, { status: 400 })
        }

        const timestamp = new Date().toISOString();
        const discordResponse = await fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                "content": "New contact form submit!",
                "embeds": [
                    {
                        "title": `Subject: ${subject}`,
                        "description": message,
                        "color": 3530506,
                        "timestamp": timestamp,
                        "author": {
                            "name": `Email: ${email}`
                        }
                    }
                ],
                "attachments": []
            }),
        });

        if (discordResponse.ok) {
            return Response.json({ status: 'ok' })
        } else {
            const errorText = await discordResponse.text();
            console.error(errorText);
            return Response.json({ error: 'Failed to send webhook (Discord)' }, { status: 500 })
        }

    } catch (error) {
        console.error('Error calling:', error);
        return Response.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}