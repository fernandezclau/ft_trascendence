function selectPlayers(players) {
    playerCount = players;
    document.getElementById('playerCount').textContent = playerCount;
    document.getElementById('startGameBtn').disabled = false; // Habilitar el botón de inicio del juego

    // Resetear los botones
    document.getElementById('btn2').classList.remove('selected');
    document.getElementById('btn3').classList.remove('selected');
    document.getElementById('btn4').classList.remove('selected');

    // Añadir la clase 'selected' al botón seleccionado
    switch (players) {
        case 2:
            document.getElementById('btn2').classList.add('selected');
            break;
        case 3:
            document.getElementById('btn3').classList.add('selected');
            break;
        case 4:
            document.getElementById('btn4').classList.add('selected');
            break;
    }
}

function applySpell(spell) {
    alert("Hechizo aplicado: " + spell);
}

let selectedPlayers = 0;
let currentPlayer = 1;
let playersData = [];
let selectedBoost = "";

function selectPlayers(num) {
    selectedPlayers = num;
    document.getElementById('playerCount').textContent = num;
    document.getElementById('startGameBtn').disabled = false;
}

function startGame() {
    if (selectedPlayers > 0) {
        currentPlayer = 1;
        playersData = [];
        openPlayerModal();
    }
}

function openPlayerModal() {
    if (currentPlayer > selectedPlayers) {
        console.log("Jugadores registrados:", playersData);
        alert("¡Todos los jugadores están listos!");
        return;
    }
    document.getElementById('playerNumber').textContent = currentPlayer;
    document.getElementById('playerName').value = "";
    selectedBoost = "";
    document.querySelectorAll('.boost-option').forEach(el => el.classList.remove('selected'));
    new bootstrap.Modal(document.getElementById('playerModal')).show();
}

function selectBoost(boost, element) {
    selectedBoost = boost;
    document.querySelectorAll('.boost-option').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');
}

function savePlayerData() {
    let playerName = document.getElementById('playerName').value.trim();
    if (!playerName || !selectedBoost) {
        alert("Por favor, introduce un nombre y selecciona un boost.");
        return;
    }

    playersData.push({ name: playerName, boost: selectedBoost });
    currentPlayer++;
    bootstrap.Modal.getInstance(document.getElementById('playerModal')).hide();
    openPlayerModal();
}