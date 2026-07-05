document.addEventListener('DOMContentLoaded', function() {

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
                btn.textContent = '🚀 Vote Now';
                btn.disabled = false;
            }
        });
    }
});
