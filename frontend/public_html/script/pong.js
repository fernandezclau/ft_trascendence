let players = [];
const canvas = document.getElementById('pongCanvas');
const context = canvas.getContext('2d');
const player1Score = document.getElementById('player1Score');
const player2Score = document.getElementById('player2Score');
const debugMessage = document.getElementById('debugMessage');

// # SECCIÓN DE 
let started = false;
let paused = true;                                      // Guarda si el juego está pausado
let winner = 0;                                         // Guarda si hay un ganador (0:No, 1:Jugador1, 2:Jugador2)
let lastTime = performance.now();                       // Contadores de tiempo
let pauseTime = 0.0;                                    // Tiempo transcurrido desde la pausa
let animationTime;                                      // Tiempo transcurrido desde el inicio de la animación
let animation = false;                                  // Guarda si se está actualmente en una animación
let animationColor;                                     // Color del jugador que provocó la animación
let UIColor = '#fff';                                   // Color actual de la interfaz
let pointsToWin = 10;                                   // Puntos para ganar
let playersToPlay = null;                               // Numero de jugadores

// # SECCIÓN DE JUGADOR
let paddleWidth = 10, paddleHeight = 100;               // Dimensiones de los rectángulos
let paddleWidth2 = 10, paddleHeight2 = 100;             // Dimensiones de los rectángulos
let paddleSpeed = 600;                                  // Velocidad de los jugadores (1 y 3)
let paddleSpeed2 = 600;                                 // Velocidad de los jugadores (2 y 4)
let player1Y = canvas.height / 2 - paddleHeight / 2;    // Posiciones de ambos jugadores (1 y 3)
let player2Y = canvas.height / 2 - paddleHeight2 / 2;   // Posiciones de ambos jugadores (2 y 4)
let player3Y = player1Y;
let player4Y = player2Y;
let playerDistance = 100;
let wPressed = false, sPressed = false;                 // Controla si se están pulsando las teclas W/S
let upPressed = false, downPressed = false;             // Controla si se están pulsando las teclas Arriba/Abajo
let iPressed = false, kPressed = false;                 // Controla si se están pulsando las teclas I/K
let np8Pressed = false, np5Pressed = false;             // Controla si se están pulsando las teclas np8/np5
let boostPressedPlayer1 = false;
let boostPressedPlayer2 = false;

// # SECCIÓN DE PELOTA
let ballSize = 10;                                    // Dimensiones de la pelota
let ballBSpeed = 500;                                 // Velocidad base de la pelota
let ballX = canvas.width / 2 - ballSize / 2;            // Posición de la pelota
let ballY = canvas.height / 2 - ballSize / 2;
let ballSpeedX = Math.random() < 0.5 ? ballBSpeed : -ballBSpeed;       // Velocidad de la pelota
let ballSpeedY = Math.random() < 0.5 ? ballBSpeed : -ballBSpeed; 
let ballColor = '#fff';
let activeBoosts = {};
// # SECCIÓN DE SONIDO
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const soundBuffer = {};

// Función para cargar un sonido
async function loadSound(name, url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    soundBuffer[name] = await audioContext.decodeAudioData(arrayBuffer);
}

// Función para reproducir un sonido
function playSound(name) {
    if (!soundBuffer[name]) return;
    const source = audioContext.createBufferSource();
    source.buffer = soundBuffer[name];
    source.connect(audioContext.destination);
    source.start();
}

// PongBlipF4.wav by NoiseCollector -- https://freesound.org/s/4359/ -- License: Attribution 3.0
loadSound('bounce', 'sound/bound.wav');
// Score Beep by edwardszakal -- https://freesound.org/s/514160/ -- License: Attribution 4.0
loadSound('score', 'sound/score.mp3');
// https://pixabay.com/sound-effects/winsquare-6993/
loadSound('gameover', 'sound/gameover.mp3');
// pause.mp3 by crisstanza -- https://freesound.org/s/167127/ -- License: Creative Commons 0
loadSound('pause', 'sound/pause.mp3');
// unpause.mp3 by crisstanza -- https://freesound.org/s/167126/ -- License: Creative Commons 0
loadSound('resume', 'sound/resume.mp3');

function moveBall(time) {
    // Incrementar velocidad
    let deltaX = ballSpeedX * time;
    let deltaY = ballSpeedY * time;
    ballX += deltaX;
    ballY += deltaY;

    // Rebote superior
    if (ballY <= 0) {
        ballY = 0;
        ballSpeedY = -ballSpeedY;
        playSound('bounce');
    }

    // Rebote inferior
    else if (ballY + ballSize >= canvas.height) {
        ballY = canvas.height - ballSize;
        ballSpeedY = -ballSpeedY;
        playSound('bounce');
    }

    if (playersToPlay == 4) {
        // Zona del equipo 1
        if (deltaX < 0 && ballX <= playerDistance + paddleWidth) {
            // Gol del equipo 1
            if (ballX + ballSize <= 0)
                playerScore(2);

            // Colisi贸n con el jugador 3
            else if (ballX >= playerDistance && ballY + ballSize >= player3Y && ballY <= player3Y + paddleHeight) {
                ballX = playerDistance + paddleWidth;
                ballSpeedX = -ballSpeedX * (Math.random() * 0.15 + 0.95);
                ballSpeedY = ballSpeedY * (Math.random() * 0.15 + 0.95);
                playSound('bounce');
            }

            // Colisi贸n con el jugador 1
            else if (ballX <= paddleWidth && ballY + ballSize >= player1Y && ballY <= player1Y + paddleHeight) {
                ballX = paddleWidth;
                ballSpeedX = -ballSpeedX * (Math.random() * 0.15 + 0.95);
                ballSpeedY = ballSpeedY * (Math.random() * 0.15 + 0.95);
                playSound('bounce');
            }

        // Zona del equipo 2 
        } else if (deltaX > 0 && ballX + ballSize >= canvas.width - playerDistance - paddleWidth) {
            // Gol del equipo 2
            if (ballX >= canvas.width)
                playerScore(1);

            // Colisi贸n con el jugador 4
            else if (ballX + ballSize <= canvas.width - playerDistance && ballY + ballSize >= player4Y && ballY <= player4Y + paddleHeight2) {
                ballX = canvas.width - playerDistance - paddleWidth - ballSize;
                ballSpeedX = -ballSpeedX * (Math.random() * 0.15 + 0.95);
                ballSpeedY = ballSpeedY * (Math.random() * 0.15 + 0.95);
                playSound('bounce');
            }

            // Colisi贸n con el jugador 2
            else if (ballX + ballSize >= canvas.width - paddleWidth && ballY + ballSize >= player2Y && ballY <= player2Y + paddleHeight2) {
                ballX = canvas.width - paddleWidth - ballSize;
                ballSpeedX = -ballSpeedX * (Math.random() * 0.15 + 0.95);
                ballSpeedY = ballSpeedY * (Math.random() * 0.15 + 0.95);
                playSound('bounce');
            }
        }
    } else {
        // Zona del jugador 1
        if (ballX <= paddleWidth) {
            // Gol
            if (ballX + ballSize <= 0)
                playerScore(2);

            // Rebote
            else if (ballY + ballSize >= player1Y && ballY <= player1Y + paddleHeight) {
                ballX = paddleWidth;
                ballSpeedX = -ballSpeedX * (Math.random() * 0.15 + 0.95);
                ballSpeedY = ballSpeedY * (Math.random() * 0.15 + 0.95);
                playSound('bounce');
            }
        }

        // Zona del jugador 2
        if (ballX + ballSize >= canvas.width - paddleWidth) {
            // Gol
            if (ballX >= canvas.width)
                playerScore(1);

            // Rebote
            else if (ballY + ballSize >= player2Y && ballY <= player2Y + paddleHeight2) {
                ballX = canvas.width - paddleWidth - ballSize;
                ballSpeedX = -ballSpeedX * (Math.random() * 0.15 + 0.95);
                ballSpeedY = ballSpeedY * (Math.random() * 0.15 + 0.95);
                playSound('bounce');
            }
        }
    }
}

function playerScore(player) {
    // Comprobar victoria
    if (player == 1) {
        player1Score.textContent = parseInt(player1Score.textContent) + 1;
        animationColor = "#8BB9F7";
        if (parseInt(player1Score.textContent) >= pointsToWin) {
            winner = 1;
            debugMessage.classList.add('winner');
            debugMessage.textContent = "PLAYER 1 WINS!";
            debugMessage.style.color = 'blue';
        }
    }
    else {
        player2Score.textContent = parseInt(player2Score.textContent) + 1;
        animationColor = "#DA5C5C";
        if (parseInt(player2Score.textContent) >= pointsToWin) {
            winner = 2;
            debugMessage.classList.add('winner');
            debugMessage.textContent = "PLAYER 2 WINS!";
            debugMessage.style.color = 'red';
        }
    }

    // Reiniciar pelota
    if (winner == 0) {
        ballX = canvas.width / 2 - ballSize / 2;
        ballY = canvas.height / 2 - ballSize / 2;
        ballSpeedX = -ballSpeedX;
        playSound('score');
    } else {
        playSound('gameover');
    }

    // Iniciar animación
    animationTime = performance.now();
    animation = true;
}

function movePlayers(time) {
    player1Y = Math.min(canvas.height - paddleHeight, Math.max(0, player1Y + paddleSpeed * time * (sPressed - wPressed)));
    player2Y = Math.min(canvas.height - paddleHeight2, Math.max(0, player2Y + paddleSpeed2 * time * (downPressed - upPressed)));
    if (playersToPlay == 4) {
        player3Y = Math.min(canvas.height - paddleHeight, Math.max(0, player3Y + paddleSpeed * time * (kPressed - iPressed)));
        player4Y = Math.min(canvas.height - paddleHeight2, Math.max(0, player4Y + paddleSpeed2 * time * (np5Pressed - np8Pressed)));
    }
}

// EVENTO PARA TECLAS
document.addEventListener('keydown', (event) => {
    if (started) {
        // Controles de movimiento...
        if (event.key === 'w' || event.key === 'W') wPressed = true;
        if (event.key === 's' || event.key === 'S') sPressed = true;
        if (event.key === 'ArrowUp') upPressed = true;
        if (event.key === 'ArrowDown') downPressed = true;
        if (playersToPlay == 4) {
            if (event.key === 'i' || event.key === 'I') iPressed = true;
            if (event.key === 'k' || event.key === 'K') kPressed = true;
            if (event.code === 'Numpad8') np8Pressed = true;
            if (event.code === 'Numpad5') np5Pressed = true;
        }
        
        // Lanzar boosts (solo si no está en pausa)
        if (!paused) {
            if (event.key === "e" || event.key === "E") pressedBoostButton("e");
            if (event.key === "ArrowRight") pressedBoostButton("right");
        }

        // PAUSA / REANUDAR con la barra espaciadora
        if (event.key === ' ' && winner == 0) {
            paused = !paused;
            if (paused) {
                // Al pausar, guardamos el momento y detenemos los boosts
                pauseTime = performance.now();
                pauseBoosts(); // Detiene los temporizadores de los boosts activos

                playSound('pause');
                debugMessage.textContent = translations[document.documentElement.lang]?.["paused"];
                debugMessage.classList.add('paused');

                // Deshabilitamos los botones de boost
                toggleBoostButtons(true);
            } else {
                // Al reanudar, volvemos a activar los temporizadores de los boosts activos
                resumeBoosts();

                playSound('resume');
                debugMessage.textContent = "";
                debugMessage.classList.remove('paused');
                
                // Habilitamos los botones de boost si aún no se han usado
                if (boostPressedPlayer1 == false) {
                    const gameBoosts = document.getElementById("gameBoosts");
                    if (!gameBoosts) return;
                    let playerContainer = gameBoosts.children[0];
                    let button = playerContainer.querySelector("button");
                    button.disabled = false;
                } 
                if (boostPressedPlayer2 == false) {
                    const gameBoosts = document.getElementById("gameBoosts");
                    if (!gameBoosts) return;
                    let playerContainer = gameBoosts.children[1];
                    let button = playerContainer.querySelector("button");
                    button.disabled = false;
                } 
            }
        }
    }
});

document.addEventListener('keyup', (event) => {
    if (started) {
        if (event.key === 'w' || event.key === 'W') wPressed = false;
        if (event.key === 's' || event.key === 'S') sPressed = false;
        if (event.key === 'ArrowUp') upPressed = false;
        if (event.key === 'ArrowDown') downPressed = false;
        if (playersToPlay == 4) {
            if (event.key === 'i' || event.key === 'I') iPressed = false;
            if (event.key === 'k' || event.key === 'K') kPressed = false;
            if (event.code === 'Numpad8') np8Pressed = false;
            if (event.code === 'Numpad5') np5Pressed = false;
        }
    }
});

function drawGameBoard() {
    // Dibujar tablero limpio
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar Jugador 1
    context.fillStyle = "#4C6A90";
    context.fillRect(0, player1Y, paddleWidth, paddleHeight);
    // Dibujar Jugador 2
    context.fillStyle = "#DA5C5C";
    context.fillRect(canvas.width - paddleWidth, player2Y, paddleWidth, paddleHeight2);
    
    if (playersToPlay == 4) {
        // Dibujar Jugador 3
        context.fillStyle = "#625286";
        context.fillRect(playerDistance, player3Y, paddleWidth, paddleHeight);
        // Dibujar Jugador 4
        context.fillStyle = "#BE4F8A";
        context.fillRect(canvas.width - playerDistance - paddleWidth, player4Y, paddleWidth, paddleHeight2);
    }

    // Dibujar línea discontinua en el centro
    context.setLineDash([7, 7]);
    context.beginPath();
    context.moveTo(canvas.width / 2, 0);
    context.lineTo(canvas.width / 2, canvas.height);
    context.strokeStyle = UIColor;
    context.lineWidth = 2;
    context.stroke();
    context.setLineDash([]);

    // Dibujar perlota
    context.fillStyle = ballColor;
    context.beginPath();
    context.arc(ballX + ballSize / 2, ballY + ballSize / 2, ballSize / 2, 0, Math.PI * 2);
    context.fill(); 
}

function gameLoop() {
    // Controlar pausa
    if (paused) {
        requestAnimationFrame(gameLoop);
        lastTime = performance.now();
        return;
    }

    // Medir diferencias de tiempo
    let currentTime = performance.now();
    let time = (currentTime - lastTime) * 0.001;
    lastTime = currentTime;

    // Controlar animación
    if (animation) {
        let animationTimeDiff = currentTime - animationTime - pauseTime;
        UIColor = (Math.floor((animationTimeDiff) * 0.0075) % 2 == 1) ? animationColor : '#fff';
        if (winner == 0 && animationTimeDiff * 0.001 >= 1.25) {
            UIColor = '#fff';
            animation = false;
        }
        player1Score.style.color = UIColor;
        player2Score.style.color = UIColor;
        canvas.style.border = '2px solid ' + UIColor;
    }

    // Dibujar tablero limpio
    drawGameBoard();

    if (winner == 0) {
        // Mover pelota y jugadores según el tiempo transcurrido
        moveBall(time);
        movePlayers(time);
    }

    // Reajustar el momento de pausa
    pauseTime = 0.0;

    // Ciclo de juego
    requestAnimationFrame(gameLoop);
}

function reloadGame(page) {
    // Pause game
    started = false;
    paused = true;
    winner = 0;
    pauseTime = 0.0;                                    // Tiempo transcurrido desde la pausa
    debugMessage.textContent = "";
    player1Score.textContent = 0;
    player2Score.textContent = 0;

    ballX = canvas.width / 2 - ballSize / 2;            // Posición de la pelota
    ballY = canvas.height / 2 - ballSize / 2;

    player1Y = (canvas.height / 2) - (paddleHeight / 2);    // Posicion palas
    player2Y = (canvas.height / 2) - (paddleHeight2 / 2);
    
    if (playersToPlay == 4) {
        player3Y = (canvas.height / 2) - (paddleHeight / 2);
        player4Y = (canvas.height / 2) - (paddleHeight2 / 2);
    }
    
    UIColor = "#fff";                   // Resetear color animación
    animation = false;
    player1Score.style.color = UIColor;
    player2Score.style.color = UIColor;
    canvas.style.border = '2px solid ' + UIColor;

    drawGameBoard();

    if (page == "game")
        reloadingGamePage();
    else if (page == "tournament")
        reloadingGameTournament();

    // Botones de boost todavía no pulsados
    boostPressedPlayer1 = false;
    boostPressedPlayer2 = false;
}

function reloadingGamePage() {

    /* Mobile mode */
    if (window.innerWidth <= 768) {

        // Enable button (no selection)
        const startButton = document.getElementById("startButton");
        startButton.disabled = false;
        
        // Remove registration process (selection mode enabled)
        generatePlayerForms(2, false, false, "Claudia"); // TODO: Modificar con el username 
    }

    /* PC mode */
    else {
        // Remove registration process (selection mode enabled)
        const popupContainer = document.getElementById("gameRegister");
        popupContainer.innerHTML = "";

        // Remove selected Players (select players available)
        let playersButtons = document.querySelectorAll('.players-btn-group');
        playersButtons.forEach(button => button.classList.remove('button-selected'));

        // Enable selection buttons (no)
        let playerButtons = document.querySelectorAll('.players-btn-group'); 
        playerButtons.forEach(button => button.disabled = false);

        // Disable start button
        const startButton = document.getElementById("startButton");
        startButton.disabled = true;
    }

    /*  Common */

    // Remove error msg
    const error_msg = document.getElementById("game-registration-error");
    hideElement(error_msg);

    // Hide player info (si)
    const gameBoosts = document.getElementById("gameBoosts");
    gameBoosts.style.display = "none";

    // Update score position (si)
    const score = document.getElementById("score");
    score.style.top = "10px";
}

// Iniciar juego
drawGameBoard();

// Función para seleccionar el número de jugadores
function selectPlayers(players) {
    let playersButtons = document.querySelectorAll('.players-btn-group');
    playersButtons.forEach(button => button.classList.remove('button-selected'));

    let selectedButton;
    if (players === 2) {
        selectedButton = playersButtons[0]; // Selecciona el botón de 2 jugador
    } else if (players === 4) {
        selectedButton = playersButtons[1]; // Selecciona el botón de 4 jugadores
    } else {
        selectedButton = playersButtons[0]; // Selecciona el botón de 2 jugador
        players = 2;
    }

    if (selectedButton) {
        selectedButton.classList.add('button-selected');
    } else {
        console.error('No se pudo encontrar el botón para los jugadores:', players);
    }
    
    playersToPlay = players;
    const startButton = document.getElementById('startButton');
    
    if (playersToPlay && startButton) {
        startButton.disabled = false;
        generatePlayerForms(playersToPlay, false, false, "Carlos");  // TODO: Modificar con el username 
    }
    else {
        startButton.disabled = true;
    }
    console.log(`Selected ${playersToPlay} players`);
    drawGameBoard();
}

function generatePlayerForms(num_players, isTournament, isTeamGame, loggedInPlayerName) {
    const popupContainer = document.getElementById("gameRegister");
    showElement(popupContainer);
    popupContainer.style.display = "flex";
    popupContainer.innerHTML = ""; // Limpiar contenido previo

    let teamNumber = num_players == 2 ? 2 : 2;
    let titleKey = num_players == 2 ? "player" : "team";

    // Si es torneo
    if (isTournament) {
        teamNumber = num_players;
        console.log("Is team game" + isTeamGame);
        titleKey = isTeamGame ? "team" : "player";    
    }

    if (titleKey == "team")
        loggedInPlayerName = formatTranslation("usersTeam", {username : loggedInPlayerName})

    let { titleText, username_label, username_placeholder, boost_label, speed_label, power_label, defense_label } = loadPlayerFormTranslations(titleKey);

    for (let i = 1; i <= teamNumber; i++) {
        const playerForm = document.createElement("div");
        playerForm.classList.add("game-register-content");
        
        // Si es el primer jugador (el que hizo login), deshabilitar el input y mostrar su nombre
        let usernameInputHtml = '';
        if (i === 1 && loggedInPlayerName) {
            usernameInputHtml = `
                <input type="text" class="form-control" id="usernameInput${i}" name="usernameInput${i}" value="${loggedInPlayerName}" placeholder="${username_placeholder}" disabled required>
            `;
        } else {
            usernameInputHtml = `
                <input type="text" class="form-control" id="usernameInput${i}" name="usernameInput${i}" placeholder="${username_placeholder}" required>
            `;
        }

        playerForm.innerHTML = `
            <h3 id="modalTitle">${titleText} ${i}</h3>
            <div class="game-register-content-input">
                <label for="usernameInput${i}" class="game-register-content-label">${username_label}</label>
                ${usernameInputHtml}
            </div>
            <div class="game-register-content-input">
                <label class="game-register-content-label">${boost_label}</label>
                <div class="boost-options">
                    <div class="boost-option game-option-selected" data-boost="speed" title="${speed_label}" onclick="selectBoost('speed', ${i})">
                        <img src="images/speed.png" alt="Speed Boost">
                    </div>
                    <div class="boost-option" data-boost="power" title="${power_label}" onclick="selectBoost('power', ${i})">
                        <img src="images/power.png" alt="Power Boost">
                    </div>
                    <div class="boost-option" data-boost="defense" title="${defense_label}" onclick="selectBoost('defense', ${i})">
                        <img src="images/shield.png" alt="Defense Boost">
                    </div>
                </div>
            </div>
        `;
        popupContainer.appendChild(playerForm);
    }
}

function loadPlayerFormTranslations(titleKey) {
    return {
        titleText: translations[document.documentElement.lang]?.[titleKey] || titleKey,
        username_label: translations[document.documentElement.lang]?.["username_label"],
        username_placeholder: translations[document.documentElement.lang]?.["username_placeholder"],
        boost_label: translations[document.documentElement.lang]?.["chooseBoost"],
        speed_label:  translations[document.documentElement.lang]?.["speed"],
        power_label:  translations[document.documentElement.lang]?.["power"],
        defense_label:  translations[document.documentElement.lang]?.["defense"]
    };
}

// Selección del bost
function selectBoost(boostType, playerId) {
    const playerBoosts = document.querySelectorAll(`.game-register-content:nth-child(${playerId}) .boost-option`);

    playerBoosts.forEach(boost => boost.classList.remove('game-option-selected'));

    playerBoosts.forEach(boost => {
        if (boost.dataset.boost === boostType) {            
            boost.classList.add('game-option-selected');
        }
    });

    console.log(`Player ${playerId} selected boost: ${boostType}`);
}

// Función para seleccionar el número de puntos necesarios para ganar
function selectPoints(points) {
    
    let pointsButtons = document.querySelectorAll('.points-btn-group');
    pointsButtons.forEach(button => button.classList.remove('button-selected'));

    
    let selectedButton;
    if (points === 5) {
        selectedButton = pointsButtons[0];
    } else if (points === 10) {
        selectedButton = pointsButtons[1];
    } else if (points === 15) {
        selectedButton = pointsButtons[2];
    }

    if (selectedButton) {
        selectedButton.classList.add('button-selected');
    } else {
        console.error('No se pudo encontrar el botón para los puntos:', points);
    }

    pointsToWin = points;
    console.log(`Selected ${pointsToWin} points to win`);
}

// FUNCION INICIO
function startGame() {
    // 1. Obtenemos datos de registro
    registerData = getFormData("playerForm", "game-registration-error")
    if (!registerData) {
        return; // Datos inválidos
    }

    // 3. Actualizar hechizos
    displayPlayerInfo(registerData)

    // 2. Quitar registro jugadores
    hideElement(document.getElementById("gameRegister"));

    // 3. Modo movil 2 jugadores por defecto siempre
    if (window.innerWidth <= 768)
        playersToPlay = 2;
    
    // 4. Comienza el juego
    if (playersToPlay != null && pointsToWin)
    {
        console.log("Starting game");

        // 4. Deshabilitamos botones seleccion
        disableSelectionButtons();

        // 5. Inicio de juego
        started = true;
        playSound('resume');
        debugMessage.textContent = translations[document.documentElement.lang]?.["pressSpaceBar"];;
        
        // 6. Bucle
        gameLoop();
    } else {
        const error_element = document.getElementById('game-error');
        showElement(error_element)
        error_element.textContent = 'Please select the number of players and points to win';
    }
}

// Deshabilitar botones inicio juego
function disableSelectionButtons()
{
    let playerButtons = document.querySelectorAll('.players-btn-group');
    let pointsButtons = document.querySelectorAll('.points-btn-group');
    const startButton = document.getElementById('startButton');
    
    playerButtons.forEach(button => button.disabled = true);
    pointsButtons.forEach(button => button.disabled = true);
    startButton.disabled = true;
}

// Obtener información formulario registro
function getFormData(form_id, error_id) {
    let playersData = [];

    // 1. Obtener formulario
    const form = document.getElementById(form_id);
    const error_element = document.getElementById(error_id);   // Campo error

    // 2. Limpiar campo error de ejecuciones previas
    hideElement(error_element);
    
    // 2. Comprobamos que los campos cumplen las restricciones
    if (!form.checkValidity()) {
        form.reportValidity();
        error_element.innerHTML = translations[document.documentElement.lang]?.["missingFields"];
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
            errorMsg = formatTranslation("usernameDuplicated", {username: username})
            isValid = false;
        } else if (username.length > 8 && index != 0)  {
            errorMsg = translations[document.documentElement.lang]?.["usernameTooLong"];
            isValid = false;
        } else {
            usernamesSet.add(username);
        }

        // Boost válido
        if (!validBoosts.has(boost)) {
            error_element.innerHTML = translations[document.documentElement.lang]?.["missingFields"];
            errorMsg =  formatTranslation("invalidBoost", { boost: boost });
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

// Mostrar hechizos de jugador
function displayPlayerInfo(playersData) {
    const gameBoosts = document.getElementById("gameBoosts");
    const boostImages = {
        speed: "images/speed.png",
        power: "images/power.png",
        defense: "images/shield.png"
    };

    playersData.forEach((player, index) => {
        console.log(player)
        let playerContainer = gameBoosts.children[index];
        if (playerContainer) {
            let nameElement = playerContainer.querySelector("p, span");
            let button = playerContainer.querySelector("button");

            if (nameElement) {
                nameElement.textContent = truncateName(player.username);
            }
            const boostKey = index === 0 ? "E" : ">";           
            if (button) {
                button.title = translations[document.documentElement.lang]?.[player.boost]
                button.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 5px;">
                        <img src="${boostImages[player.boost]}" alt="${player.boost}" width="30">
                        <span style="
                            font-family: 'retro';
                            color: #161618; 
                            text-transform: uppercase;">
                            ${boostKey}
                        </span>
                    </div>
                `;
                
                // Asegurar que no haya eventos previos duplicados
                button.replaceWith(button.cloneNode(true));
                button = playerContainer.querySelector("button");

                // Asignar la función del boost correspondiente
                button.addEventListener("click", () => activateBoost(player.boost, player.username, index, button));

                // Deshabilitar
                button.disabled = true;
            }
        }
    });

    gameBoosts.style.display = "flex";
    gameBoosts.style.visibility = "visible";
    const score = document.getElementById("score");
    score.style.top = "105px";
}

// FUNCIÓN PARA ACTIVAR EL BOOST CON SOPORTE DE PAUSA / REANUDAR
function activateBoost(boostType, playerName, index, button) {
    // No activar si el juego está en pausa
    if (paused) return;
    
    button.classList.add("active-boost");
    let boostDuration = boostType === "speed" ? 150 : 2000;
    let startTime = performance.now();

    // Aplicamos el efecto inmediatamente
    applyBoost(boostType, playerName, index);

    // Función que se ejecutará al finalizar el boost (para remover su efecto)
    let removalFn = function() {
        removeBoost(boostType, index);
        button.classList.remove("active-boost");
        // Eliminamos el boost de la lista de activos
        delete activeBoosts[index];
    };

    // Iniciamos el temporizador
    let timeoutId = setTimeout(removalFn, boostDuration);

    // Guardamos la información del boost activo
    activeBoosts[index] = {
        boostType: boostType,
        playerName: playerName,
        button: button,
        duration: boostDuration,
        remaining: boostDuration, // Tiempo restante (inicialmente la duración completa)
        startTime: startTime,
        timeoutId: timeoutId,
        removalFn: removalFn
    };

    if (index % 2 === 0) {
        boostPressedPlayer1 = true;
    } else {
        boostPressedPlayer2 = true;
    }
    button.disabled = true;
}

// FUNCIÓN QUE APLICA EL EFECTO DEL BOOST
function applyBoost(boostType, playerName, index) {
    switch (boostType) {
        case "speed":
            console.log(`${playerName} activó el Boost de Velocidad!`);
            ballSpeedX *= 5;
            ballSpeedY *= 5;
            break;
        case "power":
            console.log(`${playerName} activó el Boost de Poder!`);
            if (index % 2 === 0) {
                paddleSpeed *= 2;
            } else {
                paddleSpeed2 *= 2;
            }
            drawGameBoard();   
            break;
        case "defense":
            console.log(`${playerName} activó el Boost de Defensa!`);
            if (index % 2 === 0) {
                paddleHeight = 150;
            } else {
                paddleHeight2 = 150;
            }
            drawGameBoard();   
            break;
        default:
            console.log("Boost desconocido.");
    }
}

// FUNCIÓN QUE REMUEVE EL EFECTO DEL BOOST AL TERMINAR SU DURACIÓN
function removeBoost(boostType, index) {
    switch (boostType) {
        case "speed":
            ballSpeedX /= 5;
            ballSpeedY /= 5;
            break;
        case "power":
            if (index % 2 === 0) {
                paddleSpeed /= 2;
            } else {
                paddleSpeed2 /= 2;
            }
            drawGameBoard();
            break;
        case "defense":
            if (index % 2 === 0) {
                paddleHeight = 100;
            } else {
                paddleHeight2 = 100;
            }
            drawGameBoard();
            break;
        default:
            break;
    }
}

// FUNCIONES PARA PAUSAR Y REANUDAR LOS BOOSTS ACTIVOS
function pauseBoosts() {
    for (let key in activeBoosts) {
        let boost = activeBoosts[key];

        // Detenemos el temporizador
        clearTimeout(boost.timeoutId);

        // Calculamos el tiempo transcurrido
        let elapsed = performance.now() - boost.startTime;

        // Guardamos el tiempo restante
        boost.remaining -= elapsed;

        // Pausar animación del botón si existe
        if (boost.button) {
            boost.button.classList.remove("active-boost");
            boost.button.classList.add("paused-boost"); 
        }
    }
}


function resumeBoosts() {
    for (let key in activeBoosts) {
        let boost = activeBoosts[key];

        // Reiniciamos el temporizador con el tiempo restante
        boost.startTime = performance.now();
        boost.timeoutId = setTimeout(() => {
            boost.button.classList.remove("active-boost", "paused-boost"); // Quita animaciones cuando termine
            boost.removalFn(); // Aplica la eliminación del boost
            delete activeBoosts[key];
        }, boost.remaining);

        // Reanudar la animación del botón si sigue activo
        if (boost.button) {
            boost.button.classList.remove("paused-boost");
            boost.button.classList.add("active-boost");
        }
    }
}


function toggleBoostButtons(enable) {
    const gameBoosts = document.getElementById("gameBoosts");

    if (!gameBoosts) return;

    const playerContainers = gameBoosts.children;

    Array.from(playerContainers).forEach(playerContainer => {
        let buttons = playerContainer.querySelectorAll("button");

        buttons.forEach(button => {
            button.disabled = enable;
        });
    });
}

function pressedBoostButton(letter) {
    const gameBoosts = document.getElementById("gameBoosts");
    
    if (!gameBoosts) return;

    const button1 = gameBoosts.children[0].querySelector("button");
    const button2 = gameBoosts.children[1].querySelector("button");
    
    if (letter == "e" && button1.disabled == false) {
        button1.click();
    } else if (letter = "right" && button2.disabled == false) {
        button2.click();
    }
}

// ---------------------------------------------------

// ACTUALIZAR TAMAÑO BOLA
function updateBallSize(value) {

    console.log("Este es el size input " + value)
    ballSize = parseInt(value);
    ballX = canvas.width / 2 - ballSize / 2;
    ballY = canvas.height / 2 - ballSize / 2;
    localStorage.setItem("ballSize", ballSize);

    drawGameBoard();
}

// ACTUALIZAR VELOCIDAD
function updateBallSpeed(value) {
    
    console.log("Este es el speed input " + value)

    ballSpeedX = value, ballSpeedY = value;
    localStorage.setItem("ballSpeed", value);

    drawGameBoard();
}

// ACTUALIZAR COLOR
function updateBallColor(value) {
    
    console.log("Este es el color input " + value)

    ballColor = value;
    localStorage.setItem("ballColor", ballColor);

    drawGameBoard();

    // Update selected color
    updateColorSelection(value);
}

function updateColorSelection(value) {
    const buttons = document.querySelectorAll('.color-option');
    
    buttons.forEach(button => {
        button.classList.remove('selected');
    });
    
    const selectedButton = Array.from(buttons).find(button => 
        button.style.backgroundColor === value || button.style.backgroundColor === hexToRgb(value)
    );
    if (selectedButton) {
        selectedButton.classList.add('selected');
    }
}

// ACTUALIZAR FONDO
function updateBackground(value) {
console.log("Este es el color input " + value)

    ballColor = value;
    localStorage.setItem("ballColor", ballColor);

    drawGameBoard();

    // Update selected color
    updateColorSelection(value);
}

// ON LOAD PAGE
document.addEventListener("DOMContentLoaded", () => {

    // size
    const savedSize = localStorage.getItem("ballSize");
    
    console.log("Save size " + savedSize)
    if (savedSize == 20 || savedSize == 10 || savedSize == 30) {
        updateBallSize(savedSize)
    } else {
        localStorage.setItem("ballSize", 10)
    }

    // speed
    const savedSpeed = localStorage.getItem("ballSpeed");

    console.log("Save speed " + savedSpeed)
    if (savedSpeed >= 400 && savedSpeed <= 600) {
        updateBallSpeed(savedSpeed)
    } else {
        localStorage.setItem("ballSpeed", 500)
    }

    // color
    const savedColor = localStorage.getItem("ballColor");

    console.log("Save color " + savedColor)
    if (savedColor) {
        updateBallColor(savedColor)
    } else {
        localStorage.setItem("ballColor", "#fff2f2")
    }

    // backgroundColorbackgroundColor
    const savedBackground = localStorage.getItem("backgroundColor")
    const canvas = document.querySelector("canvas");
    console.log("Saved background " + savedBackground)
    if (savedBackground && canvas){
        canvas.style.backgroundColor = savedBackground;
    } else {
        localStorage.setItem("backgroundColor", "#161618")
    }

    // dark mode
    const savedMode = localStorage.getItem("darkMode");

    console.log("Saved mode ", savedMode)
    if (savedMode)
    {
        if (savedMode == "disabled")
        {
            document.body.classList.remove("light-mode");
            
            let canvasBorders = document.querySelectorAll('.canvas-border');
            canvasBorders.forEach(function(element) {
                element.classList.remove("light-mode");
            });
            let navbar = document.querySelectorAll('.navbar');
            navbar.forEach(function(element) {
                element.classList.remove("light-mode");
            });
        }
        else
        {
            document.body.classList.add("light-mode");

            let canvasBorders = document.querySelectorAll('.canvas-border');
            canvasBorders.forEach(function(element) {
                element.classList.add("light-mode");
            });
            let navbar = document.querySelectorAll('.navbar');
            navbar.forEach(function(element) {
               element.classList.add("light-mode");
            });
        }
    }
    //sound 
    if (localStorage.getItem("sound") === "muted") {
        audioContext.suspend();  // Silencia el sonido
    } else {
        audioContext.resume();   // Activa el sonido
    }

    // lenguaje
    loadTranslations();
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
    changeLanguage(savedLanguage);
});
