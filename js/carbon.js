document.addEventListener('DOMContentLoaded', async () => {
    const sessionId = localStorage.getItem('sessionId');
    const loadingState = document.getElementById('loading-state');
    const loadingText = document.getElementById('loading-text');
    const mainDashboard = document.getElementById('main-dashboard');

    if (!sessionId) {
        if (loadingText) loadingText.textContent = 'No session ID found. Please log in or calculate your footprint first.';
        return;
    }

    try {
        if (loadingText) loadingText.textContent = 'Fetching details...';

        
        let res;
        try {
            res = await fetch(`http://localhost:7777/api/delta?sessionId=${encodeURIComponent(sessionId)}`);
            if (!res.ok) throw new Error();
        } catch {
            res = await fetch(`http://localhost:7777/delta?sessionId=${encodeURIComponent(sessionId)}`);
        }

        if (!res.ok) {
            throw new Error(`HTTP error ${res.status}`);
        }

        const data = await res.json();

       
        document.getElementById('total-score').textContent = data.tscore ?? data.totalScore ?? '--';
        document.getElementById('travel-score').textContent = (data.travelscore ?? data.travelScore ?? '--') + ' kg CO₂';
        document.getElementById('electricity-score').textContent = (data.escore ?? data.electricityScore ?? '--') + ' kg CO₂';
        document.getElementById('diet-score').textContent = (data.dietscore ?? data.dietScore ?? '--') + ' kg CO₂';

        
        const tip1El = document.getElementById('tip-1');
        const tip2El = document.getElementById('tip-2');
        const tip3El = document.getElementById('tip-3');

        if (tip1El) tip1El.textContent = data.r1 || 'Fetch compromised';
        if (tip2El) tip2El.textContent = data.r2 || 'Fetch compromised';
        if (tip3El) tip3El.textContent = data.r3 || 'Fetch compromised';

        const trendBadge = document.getElementById('trend-badge');
        const total = data.tscore ?? data.totalScore;
        if (data.previousScore && total) {
            const diff = data.previousScore - total;
            if (diff > 0) {
                trendBadge.textContent = `▼ ${diff} kg CO₂ less than previous month (${data.previousScore} kg CO₂)`;
                trendBadge.className = 'trend-badge positive';
                trendBadge.style.display = 'inline-block';
            }
        }

       
        if (loadingState) loadingState.style.display = 'none';
        if (mainDashboard) mainDashboard.style.display = 'block';

    } catch (err) {
        console.error('API fetch error:', err);
        if (loadingText) loadingText.textContent = 'Fetching details failed. Could not connect to API server at http://localhost:7777.';
    }
});
