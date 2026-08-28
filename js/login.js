document.querySelector('form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const btn = this.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    
    let msgEl = document.getElementById('msg');
    if (!msgEl) {
        msgEl = document.createElement('p');
        msgEl.id = 'msg';
        msgEl.style.textAlign = 'center';
        msgEl.style.marginTop = '15px';
        msgEl.style.fontWeight = 'bold';
        msgEl.style.fontSize = '14px';
        this.appendChild(msgEl);
    }

    msgEl.textContent = '';
    btn.disabled = true;
    btn.classList.add('loading');
    btn.textContent = 'Logging in...';

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const res = await fetch('http://localhost:7777/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password }),
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        const result = await res.json();

        if (result.status === 'positive') {
            if (result.sessionId) {
                localStorage.setItem('sessionId', result.sessionId);
            }
            msgEl.style.color = '#2e7d32';
            msgEl.textContent = 'Logged in successfully! Redirecting...';
            setTimeout(() => window.location.href = 'index.html', 1000);
        } else if (result.status === 'alreadyexist') {
            msgEl.style.color = '#d97706';
            msgEl.textContent = 'Account already exists!';
        } else {
            msgEl.style.color = '#dc2626';
            msgEl.textContent = 'Login failed!';
        }
    } catch (err) {
        msgEl.style.color = '#dc2626';
        if (err.name === 'AbortError') {
            msgEl.textContent = 'Login timed out! Server took too long to respond.';
        } else {
            msgEl.textContent = 'Backend offline or unreachable.';
        }
    } finally {
        btn.disabled = false;
        btn.classList.remove('loading');
        btn.textContent = originalText;
    }
});
