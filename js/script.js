const loginBtn = document.getElementById('login-btn');

if (loginBtn) {
    if (!localStorage.getItem('sessionId')) {
        loginBtn.style.display = 'inline-block';
    } else {
        loginBtn.style.display = 'none';
    }
}
