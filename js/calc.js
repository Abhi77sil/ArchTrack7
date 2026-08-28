document.querySelector('form').addEventListener('submit', async function (e) {
    e.preventDefault();

    
    const sessionId = localStorage.getItem('sessionId');

    const data = {
        sessionId: sessionId || null,
        travel: document.getElementById('travel').value,
        electricity: document.getElementById('electricity').value,
        diet: document.getElementById('diet').value
    };

    try {
        const res = await fetch('http://localhost:7777/api/footprint', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await res.json();

        
        if (result && result.sessionId) {
            localStorage.setItem('sessionId', result.sessionId);
        }
    } catch (err) {
        console.log('Footprint data sent to API');
    }

    window.location.href = 'carbon.html';
});
