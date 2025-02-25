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
    if (points === 5){
        selectedButton = teamPlayersButtons[0]; // Selecciona el boton de 1 jugador por equipo
    } else if (points === 10) {
        selectedButton = teamPlayersButtons[1]; // Selecciona el boton de 2 jugador por equipo
    } else if (points === 15) {
        selectedButton = teamPlayersButtons[2]; // Selecciona el boton de 3 jugador por equipo
    } 
    else {
        points = 10;
        selectedButton = teamPlayersButtons[0]; // Selecciona el boton de 1 jugador por equipo
    }

    pointsToWin = points;
    selectedButton.classList.add('button-selected');
}

function startTournament() {

    //1. Obtener y validar información del torneo
    let tournamentData = getFormData("tournamentForm", "game-tournament-error")
    if (!tournamentData) {
        return; // Datos inválidos
    }
    
    // 2. Desahbilitar botones
    disableTournamentSelectionButtons();

    // 3. Generar peleas
    fights = generateFights(tournamentData);
    
    // 4. Mostramos peleas
    updateGraph(numplayers, fights.fights);

    // 5. Tournament loop
    let winner = startFights(fights['fights']);
    
    //gameLoop();
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

function generateFights(players) {
    let fights = [];
    
    for (let i = 0; i < players.length; i += 2) {
        if (i + 1 < players.length) {
            fights.push({
                player1: players[i],
                player2: players[i + 1],
                result: "pending"
            });
        }
    }
    
    return { fights };
}

function updateGraph(players, fights)
{
    const tournamentGraph = document.getElementById("tournamentGraph")
    
    switch (players) {
        case 4:
            showRoundsFourPlayers();
            fillPlayers(fights, 4);
            break;
        case 8:
            showRoundsEightPlayers();
            fillPlayers(fights, 8);
            break;
        case 2:
        default:
            showRoundsTwoPlayers();
            fillPlayers(fights, 2);
            break;
    }

    showElement(tournamentGraph);
    tournamentGraph.style.display = "flex";
    return fights;
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

function fillPlayers(fights) {
    const rounds = { 2: 3, 4: 2, 8: 1 }; // Mapeo de número de jugadores a ronda
    const players = fights.length * 2; // Doble de peleas = jugadores
    const round = rounds[players] || 1; // Determina la ronda, por defecto 1 si no está en el objeto

    fights.forEach((fight, index) => {
        let position1 = getPosition(players, index * 2 + 1);
        let position2 = getPosition(players, index * 2 + 2);

        fight.player1.round = round;
        fight.player1.position = position1;

        fight.player2.round = round;
        fight.player2.position = position2;

        const playerElement1 = document.getElementById(`round-${round}-${position1}`);
        const playerElement2 = document.getElementById(`round-${round}-${position2}`);

        if (playerElement1) {
            playerElement1.innerHTML = fight.player1.username;
            playerElement1.setAttribute("id", `player-${round}-${position1}`);
        }

        if (playerElement2) {
            playerElement2.innerHTML = fight.player2.username;
            playerElement2.setAttribute("id", `player-${round}-${position2}`);
        }
    });
}

function getPosition(players, index) {
    if (players === 4 || players === 8) {
        const half = players / 2;
        const group = index <= half ? 1 : 2;
        const posInGroup = index - (group - 1) * half;
        return `${group}-${posInGroup}`;
    }
    return index;
}


function startFights(matches) {
    let winners = [];

    while (matches.length >= 1) {
        winners = [];

        matches.forEach((match) => {
            highlightMatch(match.player1, match.player2); // Resaltar jugadores en combate

            // Jugar
            started = true;
            playSound('resume');
            debugMessage.textContent = "PRESS SPACEBAR";
            
            // 6. Bucle
            winner = gameLoop();
            
            let winner = gameLoop() == 1 ? match.player1 : match.player2;
            // let winner = determineWinner(match.player1, match.player2);
            winners.push(winner);
            match.winner = winner;

            resetHighlight(match.player1, match.player2);
        });

        nextRoundMatches = []; // Reiniciar la lista de partidos para la nueva ronda

        for (let i = 0; i < winners.length; i += 2) {
             if (winners[i + 1]) {
                nextRoundMatches.push({
                    player1: winners[i],
                    player2: winners[i + 1],
                    result: "pending",
                    winner: null
                });
            }
        }

        matches = nextRoundMatches;

        fillPlayers(matches);
    }

    const element1 = document.getElementById(`player-3-${winners[0].position}`);
    element1.style.background = 'red';
}


function highlightMatch(player1, player2) {
    const element1 = document.getElementById(getPlayerId(player1));
    const element2 = document.getElementById(getPlayerId(player2));
    if (element1) element1.style.backgroundColor = 'red';
        
    if (element2) element2.style.backgroundColor = 'red';
}

function resetHighlight(player1, player2) {
    const element1 = document.getElementById(getPlayerId(player1));
    const element2 = document.getElementById(getPlayerId(player2));
    if (element1) element1.style.backgroundColor = '';
    if (element2) element2.style.backgroundColor = '';
}

function getPlayerId(player) {
    return `player-${player.round}-${player.position}`;
}

function determineWinner(player1, player2) {
    return Math.random() > 0.5 ? player1 : player2; // Simulación de ganador aleatorio
}