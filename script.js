document.addEventListener('DOMContentLoaded', function() {
    const countdownElement = document.getElementById('countdown');
    if (countdownElement) {
        let targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 7);
        function updateTimer() {
            const diff = targetDate - new Date();
            if (diff <= 0) { countdownElement.textContent = '🎉 GIVEAWAY ENDED'; return; }
            const h = Math.floor(diff / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);
            countdownElement.textContent = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        }
        updateTimer();
        setInterval(updateTimer, 1000);
    }

    const form = document.getElementById('registerForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            const username = document.getElementById('username').value.trim() || 'Guest';
            const option = document.getElementById('giveawayOption').value;
            if (!email || !password) { alert('⚠️ Please fill all fields!'); return; }
            alert('✅ You have successfully entered the giveaway!\n📧 Check your email for confirmation.');
            window.location.href = 'index.html';
        });
    }

    const winCount = document.getElementById('winCount');
    if (winCount) {
        const fakeWinners = [50, 78, 123, 156, 189, 220];
        let idx = 0;
        setInterval(() => {
            winCount.textContent = fakeWinners[idx % fakeWinners.length];
            idx++;
        }, 3000);
    }
});
