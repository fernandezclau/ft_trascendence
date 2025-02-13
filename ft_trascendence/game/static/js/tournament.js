 document.addEventListener('DOMContentLoaded', function () {

    // Datos de ejemplo (se pueden obtener de un backend en una app real)
    const players = [
        { name: "Player 1", wins: 10, losses: 5, score: 200 },
        { name: "Player 2", wins: 8, losses: 7, score: 180 },
        { name: "Player 3", wins: 15, losses: 3, score: 250 },
        { name: "Player 4", wins: 6, losses: 9, score: 140 },
        { name: "Player 5", wins: 12, losses: 4, score: 220 }
    ];

    // Actualizar estadísticas generales
    const totalMatchesElement = document.getElementById('totalMatches');
    if (totalMatchesElement) {
        totalMatchesElement.textContent = totalMatches;
    } else {
        console.error("Elemento con ID 'totalMatches' no encontrado.");
    }
    const totalWins = players.reduce((sum, p) => sum + p.wins, 0);
    const totalLosses = players.reduce((sum, p) => sum + p.losses, 0);

    document.getElementById('totalMatches').textContent = totalMatches;
    document.getElementById('totalWins').textContent = totalWins;
    document.getElementById('totalLosses').textContent = totalLosses;

    // Llenar la tabla de jugadores
    const playerTableBody = document.getElementById("playerTableBody");
    players.forEach(player => {
        let row = `<tr>
            <td>${player.name}</td>
            <td>${player.wins}</td>
            <td>${player.losses}</td>
            <td>${player.score}</td>
        </tr>`;
        playerTableBody.innerHTML += row;
    });

    // Gráfico de Wins vs Losses
    const winsLossesCtx = document.getElementById('winsLossesChart').getContext('2d');
    new Chart(winsLossesCtx, {
        type: 'bar',
        data: {
            labels: players.map(p => p.name),
            datasets: [
                {
                    label: 'Wins',
                    data: players.map(p => p.wins),
               const players = [
        { name: "Player 1", wins: 10, losses: 5, score: 200 },
        { name: "Player 2", wins: 8, losses: 7, score: 180 },
        { name: "Player 3", wins: 15, losses: 3, score: 250 },
        { name: "Player 4", wins: 6, losses: 9, score: 140 },
        { name: "Player 5", wins: 12, losses: 4, score: 220 }
    ];

    // Actualizar estadísticas generales
    const totalMatches = players.reduce((sum, p) => sum + p.wins + p.losses, 0);
    const totalWins = players.reduce((sum, p) => sum + p.wins, 0);
    const totalLosses = players.reduce((sum, p) => sum + p.losses, 0);

    document.getElementById('totalMatches').textContent = totalMatches;
    document.getElementById('totalWins').textContent = totalWins;
    document.getElementById('totalLosses').textContent = totalLosses;

    // Llenar la tabla de jugadores
    const playerTableBody = document.getElementById("playerTableBody");
    players.forEach(player => {
        let row = `<tr>
            <td>${player.name}</td>
            <td>${player.wins}</td>
            <td>${player.losses}</td>
            <td>${player.score}</td>
        </tr>`;
        playerTableBody.innerHTML += row;
    });

    // Gráfico de Wins vs Losses
    const winsLossesCtx = document.getElementById('winsLossesChart').getContext('2d');
    new Chart(winsLossesCtx, {
        type: 'bar',
        data: {
            lab     backgroundColor: 'rgba(0, 255, 0, 0.6)',
                },
                {
                    label: 'Losses',
                    data: players.map(p => p.losses),
                    backgroundColor: 'rgba(255, 0, 0, 0.6)',
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });

    // Gráfico de distribución de puntuaciones
    const scoreCtx = document.getElementById('scoreDistributionChart').getContext('2d');
    new Chart(scoreCtx, {
        type: 'pie',
        data: {
            labels: players.map(p => p.name),
            datasets: [{
                data: players.map(p => p.score),
                backgroundColor: ['#FF5733', '#33FF57', '#3357FF', '#FFD700', '#FF33A8']
            }]
        },
        options: { responsive: true }
    });
});
