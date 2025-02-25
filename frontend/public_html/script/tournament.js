let isTeamPlay = false;
let numplayers = 2; 

function selectTeamPlayers(teamPlayers) {
    let originalButtonValues = [2, 4, 8];

    let teamPlayersButtons = document.querySelectorAll('.team-players-btn-group');
    teamPlayersButtons.forEach(button => button.classList.remove('button-selected'));

    // Actualizamos botones de numero de jugadores
    const buttons = document.querySelectorAll('.tour-players-btn-group')
    buttons.forEach((button, index) => {
        let buttonValue = parseInt(button.textContent);

        if (teamPlayers === 2) {
            if (buttonValue === originalButtonValues[index]) {
                buttonValue *= 2;
            }
        } 
        else if (teamPlayers === 1) {
            buttonValue = originalButtonValues[index];
        }
        button.textContent = buttonValue;
    });

    let selectedButton;
    if (teamPlayers === 1){
        isTeamPlay = false;
        playersToPlay = 2;
        selectedButton = teamPlayersButtons[0]; // Selecciona el boton de 1 jugador por equipo
    } else if (teamPlayers === 2) {
        isTeamPlay = true;
        playersToPlay = 4;
        selectedButton = teamPlayersButtons[1]; // Selecciona el boton de 2 jugador por equipo
    } else {
        playersToPlay = 2;
        isTeamPlay = false;
        selectedButton = teamPlayersButtons[0]; // Selecciona el boton de 1 jugador por equipo
    }

    // Seleccionamos el boton pulsado
    selectedButton.classList.add('button-selected');

    // Desactivar disable para jugadores
    const pointsButtons = document.querySelectorAll('.tour-players-btn-group')
    pointsButtons.forEach(button => button.disabled = false);
    
    // Dibujamos el mapa actualizado
    drawGameBoard();
}

function selectTournamentPlayers(players) {
    let playersButtons = document.querySelectorAll('.tour-players-btn-group');
    playersButtons.forEach(button => button.classList.remove('button-selected'));

    let selectedButton;
    if (players === 2){
        selectedButton = playersButtons[0]; // Selecciona el boton de 1 jugador por equipo
    } else if (players === 4) {
        selectedButton = playersButtons[1]; // Selecciona el boton de 2 jugador por equipo
    } else if (players === 8) {
        selectedButton = playersButtons[2]; // Selecciona el boton de 3 jugador por equipo
    } else {
        players = 2;
        selectedButton = playersButtons[0]; // Selecciona el boton de 1 jugador por equipo
    }
    
    numplayers = players;
    console.log("Jugadores que han sido seleccionads" + numplayers)
    console.log("Jugadores que han " + players)
    selectedButton.classList.add('button-selected');

    // Generate form
    generatePlayerForms(players, true, isTeamPlay);
}

function selectTournamentPoints(points) {
    let teamPlayersButtons = document.querySelectorAll('.tour-points-btn-group')
    teamPlayersButtons.forEach(button => button.classList.remove('button-selected'));

    let selectedButton;
    if (points === 1){
        selectedButton = teamPlayersButtons[0]; // Selecciona el boton de 1 jugador por equipo
    } else if (points === 2) {
        selectedButton = teamPlayersButtons[1]; // Selecciona el boton de 2 jugador por equipo
    } else {
        points = 2;
        selectedButton = teamPlayersButtons[0]; // Selecciona el boton de 1 jugador por equipo
    }

    selectedButton.classList.add('button-selected');
}

function updateGraph(players, tournamentData)
{
    const tournamentGraph = document.getElementById("tournamentGrapgh")
    
    if (players == 4)
    {
        showRoundsFourPlayers();
        fillFourPlayers(tournamentData);
    }
    else if (players == 8){
        showRoundsEightPlayers();
        fillEightPlayers(tournamentData);
    }
    else {
        showRoundsTwoPlayers();
        fillTwoPlayers(tournamentData);
    }
    showElement(tournamentGraph);
    tournamentGraph.style.display = "flex";
    
}

function showRoundsTwoPlayers() {
    const roundThree = document.querySelectorAll("#round-3");
    const roundTwo1 = document.querySelectorAll("#round-2-1");
    const roundTwo2 = document.querySelectorAll("#round-2-2");
    const roundOne1 = document.querySelectorAll("#round-1-1");
    const roundOne2 = document.querySelectorAll("#round-1-2");

    // Hide 1st round
    roundOne1.forEach(round => {
        hideElement(round)
    });
    roundOne2.forEach(round => {
        hideElement(round)
    });
    
    // Hide 2nd round
    roundTwo1.forEach(round => {
        round.style.display = "flex";
        round.style.visibility = "hidden";
    });
    roundTwo2.forEach(round => {
        round.style.display = "flex";
        round.style.visibility = "hidden";
    });

    // Show 3rd round
    roundThree.forEach(round => {
        showElement(round);
        round.style.display = "flex";
    });
}

function showRoundsFourPlayers() {
    const roundThree = document.querySelectorAll("#round-3");
    const roundTwo1 = document.querySelectorAll("#round-2-1");
    const roundTwo2 = document.querySelectorAll("#round-2-2");
    const roundOne1 = document.querySelectorAll("#round-1-1");
    const roundOne2 = document.querySelectorAll("#round-1-2");

    // Hide 1st round
    roundOne1.forEach(round => {
        hideElement(round)
    });
    roundOne2.forEach(round => {
        hideElement(round)
    });

    // Show 2nd round
    roundTwo1.forEach(round => {
        showElement(round)
        round.style.display = "flex";
    });
    roundTwo2.forEach(round => {
        showElement(round)
        round.style.display = "flex";
    });

    // Show 3rd round
    roundThree.forEach(round => {
        showElement(round);
        round.style.display = "flex";
    });
}

function showRoundsEightPlayers() {
    const roundThree = document.querySelectorAll("#round-3");
    const roundTwo1 = document.querySelectorAll("#round-2-1");
    const roundTwo2 = document.querySelectorAll("#round-2-2");
    const roundOne1 = document.querySelectorAll("#round-1-1");
    const roundOne2 = document.querySelectorAll("#round-1-2");

    // Show 1st round
    roundOne1.forEach(round => {
        showElement(round)
        round.style.display = "flex";
    });
    roundOne2.forEach(round => {
        showElement(round)
        round.style.display = "flex";
    });

    // Show 2nd round
    roundTwo1.forEach(round => {
        showElement(round)
        round.style.display = "flex";
    });
    roundTwo2.forEach(round => {
        showElement(round)
        round.style.display = "flex";
    });

    // Show 3rd round
    roundThree.forEach(round => {
        showElement(round);
        round.style.display = "flex";
    });
}

function fillTwoPlayers(tournamentData) {
    const player1 = document.getElementById("round-3-1");
    const player2 = document.getElementById("round-3-2");

    player1.innerHTML = tournamentData[0]['username']
    player2.innerHTML = tournamentData[1]['username']
}

function fillFourPlayers(tournamentData) {
    const player1 = document.getElementById("round-2-1-1");
    const player2 = document.getElementById("round-2-1-2");
    const player3 = document.getElementById("round-2-2-1");
    const player4 = document.getElementById("round-2-2-2");

    player1.innerHTML = tournamentData[0]['username']
    player2.innerHTML = tournamentData[1]['username']
    player3.innerHTML = tournamentData[2]['username']
    player4.innerHTML = tournamentData[3]['username']
}

function fillEightPlayers(tournamentData) {
    const player1 = document.getElementById("round-1-1-1");
    const player2 = document.getElementById("round-1-1-2");
    const player3 = document.getElementById("round-1-1-3");
    const player4 = document.getElementById("round-1-1-4");
    const player5 = document.getElementById("round-1-2-1");
    const player6 = document.getElementById("round-1-2-2");
    const player7 = document.getElementById("round-1-2-3");
    const player8 = document.getElementById("round-1-2-4");

    player1.innerHTML = tournamentData[0]['username']
    player2.innerHTML = tournamentData[1]['username']
    player3.innerHTML = tournamentData[2]['username']
    player4.innerHTML = tournamentData[3]['username']
    player5.innerHTML = tournamentData[4]['username']
    player6.innerHTML = tournamentData[5]['username']
    player7.innerHTML = tournamentData[6]['username']
    player8.innerHTML = tournamentData[7]['username']
}

function startTournament() {

    //1. Obtener y validar información del torneo
    let tournamentData = getTournamentData()
    if (!tournamentData) {
        return; // Datos inválidos
    }
    
    // 2. Desahbilitar botones
    disableTournamentSelectionButtons();

    // 3. Mostramos peleas
    updateGraph(numplayers, tournamentData);
    
    gameLoop();
}

// unificar
function getTournamentData() {
    let playersData = [];

    // 1. Obtener formulario
    const form = document.getElementById("tournamentForm");
    const error_element = document.getElementById("game-tournament-error");   // Campo error

    // 2. Limpiar campo error de ejecuciones previas
    hideElement(error_element);
    
    // 2. Comprobamos que los campos cumplen las restricciones
    if (!form.checkValidity()) {
        form.reportValidity();
        error_element.innerHTML = "Error: Missing fields";
        showElement(error_element);
        return null;
    }

    const playerForms = document.querySelectorAll(".game-register-content");

    // 3. Extraemos y validamos información
    let usernamesSet = new Set();
    let validBoosts = new Set(["speed", "power", "defense"]);
    let isValid = true;
    let errorMsg;

    playerForms.forEach((form, index) => {
        const usernameInput = document.getElementById(`usernameInput${index + 1}`);
        const selectedBoost = form.querySelector(".boost-option.game-option-selected");
        
        let username = usernameInput.value.trim();
        let boost = selectedBoost ? selectedBoost.getAttribute("data-boost") : "speed";

        // Nombre de usuario único
        if (usernamesSet.has(username)) {
            errorMsg = "Error: El username " + username + " está duplicado."
            isValid = false;
        } else {
            usernamesSet.add(username);
        }

        // Boost válido
        if (!validBoosts.has(boost)) {
            errorMsg = "Error: Boost "  + boost + " no es válido."
            isValid = false;
        }

        playersData.push({ username, boost });
    });

    // 4. Comprobamos validez
    if (!isValid)
    {
        error_element.innerHTML = errorMsg
        showElement(error_element);
        return null;
    }

    console.log("Player Data Submitted:", playersData);
    return playersData;
}

function disableTournamentSelectionButtons()
{
    let teamplayerButtons = document.querySelectorAll('.team-players-btn-group');
    let tournamentPlayersButtons = document.querySelectorAll('.tour-players-btn-group');
    let pointsButtons = document.querySelectorAll('.tour-points-btn-group');
    const startButton = document.getElementById('tournamenButton');
    
    teamplayerButtons.forEach(button => button.disabled = true);
    tournamentPlayersButtons.forEach(button => button.disabled = true);
    pointsButtons.forEach(button => button.disabled = true);
    startButton.disabled = true;
}