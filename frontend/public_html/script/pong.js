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
let playersToPlay = null;                                  // Numero de jugadores

// # SECCIÓN DE JUGADOR
const paddleWidth = 10, paddleHeight = 100;             // Dimensiones de los rectángulos
const paddleSpeed = 600;                                // Velocidad de los jugadores
let player1Y = canvas.height / 2 - paddleHeight / 2;    // Posiciones de ambos jugadores
let player2Y = player1Y;
let player3Y = player1Y;
let player4Y = player1Y;
let playerDistance = 100;
let wPressed = false, sPressed = false;                 // Controla si se están pulsando las teclas W/S
let upPressed = false, downPressed = false;             // Controla si se están pulsando las teclas Arriba/Abajo
let iPressed = false, kPressed = false;                 // Controla si se están pulsando las teclas I/K
let np8Pressed = false, np5Pressed = false;

// # SECCIÓN DE PELOTA
let ballSize = 10;                                    // Dimensiones de la pelota
let ballBSpeed = 50;                                 // Velocidad base de la pelota
let ballX = canvas.width / 2 - ballSize / 2;            // Posición de la pelota
let ballY = canvas.height / 2 - ballSize / 2;
let ballSpeedX = Math.random() < 0.5 ? ballBSpeed : -ballBSpeed;       // Velocidad de la pelota
let ballSpeedY = Math.random() < 0.5 ? ballBSpeed : -ballBSpeed; 
let ballColor = '#fff';

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
            else if (ballX + ballSize <= canvas.width - playerDistance && ballY + ballSize >= player4Y && ballY <= player4Y + paddleHeight) {
                ballX = canvas.width - playerDistance - paddleWidth - ballSize;
                ballSpeedX = -ballSpeedX * (Math.random() * 0.15 + 0.95);
                ballSpeedY = ballSpeedY * (Math.random() * 0.15 + 0.95);
                playSound('bounce');
            }

            // Colisi贸n con el jugador 2
            else if (ballX + ballSize >= canvas.width - paddleWidth && ballY + ballSize >= player2Y && ballY <= player2Y + paddleHeight) {
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
            else if (ballY + ballSize >= player2Y && ballY <= player2Y + paddleHeight) {
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
    player2Y = Math.min(canvas.height - paddleHeight, Math.max(0, player2Y + paddleSpeed * time * (downPressed - upPressed)));
    if (playersToPlay == 4) {
        player3Y = Math.min(canvas.height - paddleHeight, Math.max(0, player3Y + paddleSpeed * time * (kPressed - iPressed)));
        player4Y = Math.min(canvas.height - paddleHeight, Math.max(0, player4Y + paddleSpeed * time * (np5Pressed - np8Pressed)));
    }
}

document.addEventListener('keydown', (event) => {
    if (started) {
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
        if (event.key === ' ' && winner == 0) {
            paused = !paused;
            if (paused) {
                // Guardar el momento de pausa
                pauseTime = performance.now();

                // Pausar
                playSound('pause');
                debugMessage.textContent = "PAUSED";
                debugMessage.classList.add('paused');
            } else {
                // Continuar
                playSound('resume');
                debugMessage.textContent = "";
                debugMessage.classList.remove('paused');
            }
        }
    }
});

document.addEventListener('keyup', (event) => {
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
});

function drawGameBoard() {
    // Dibujar tablero limpio
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar Jugador 1
    context.fillStyle = "#4C6A90";
    context.fillRect(0, player1Y, paddleWidth, paddleHeight);
    // Dibujar Jugador 2
    context.fillStyle = "#DA5C5C";
    context.fillRect(canvas.width - paddleWidth, player2Y, paddleWidth, paddleHeight);
    
    if (playersToPlay == 4) {
        // Dibujar Jugador 3
        context.fillStyle = "#625286";
        context.fillRect(playerDistance, player3Y, paddleWidth, paddleHeight);
        // Dibujar Jugador 4
        context.fillStyle = "#BE4F8A";
        context.fillRect(canvas.width - playerDistance - paddleWidth, player4Y, paddleWidth, paddleHeight);
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
    if (paused || !started) {
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

// Iniciar juego
drawGameBoard();
//gameLoop();

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
        generatePlayerForms(playersToPlay);
    }
    else if (startButton){
        startButton.disabled = true;
    }
    console.log(`Selected ${playersToPlay} players`);
    drawGameBoard();
}

// Función para seleccionar el número de puntos necesarios para ganar
function selectPoints(points) {
    
    let pointsButtons = document.querySelectorAll('.points-btn-group');
    pointsButtons.forEach(button => button.classList.remove('selected'));

    
    let selectedButton;
    if (points === 5) {
        selectedButton = pointsButtons[0];
    } else if (points === 10) {
        selectedButton = pointsButtons[1];
    } else if (points === 15) {
        selectedButton = pointsButtons[2];
    }

    if (selectedButton) {
        selectedButton.classList.add('selected');
    } else {
        console.error('No se pudo encontrar el botón para los puntos:', points);
    }

    pointsToWin = points;
    console.log(`Selected ${pointsToWin} points to win`);
}

function startGame() {
    const form = document.getElementById("playerForm");

    if (!form.checkValidity()) {
        form.reportValidity();
        const error = document.getElementById("game-registration-error")
        error.style.display = "block";
        error.style.visibility = "visible";
        return;
    }

    const playerForms = document.querySelectorAll(".game-register-content");
    let playersData = [];

    playerForms.forEach((form, index) => {
        const usernameInput = document.getElementById(`usernameInput${index + 1}`);
        //const boostInput = document.getElementById(`boostInput${index + 1}`);

        playersData.push({
            username: usernameInput.value.trim(),
            //boost: boostInput.value
        });
    });

    console.log("Player Data Submitted:", playersData);
    
    // Quitar jugadores
    const gameRegister = document.getElementById("gameRegister")
    gameRegister.style.display = "none";
    gameRegister.style.visibility = "visible";

    if (playersToPlay != null && pointsToWin)
    {
        
        console.log("Starting game");

        // 2 . Disabled players/points buttons
        disableSelectionButtons();
        
        // 3. Disabled start button
        if (startButton)
            startButton.disabled = true;

        // 4. Start game
        started = true;
        playSound('resume');
        debugMessage.textContent = "PRESS SPACEBAR";

        
        gameLoop();
    } else {
        error_element = document.getElementById('game-error');
        error_element.style.display = 'block';
        error_element.textContent = 'Please select the number of players and points to win';
    }
}

// Deshabilitar botones inicio juego
function disableSelectionButtons()
{
    let playerButtons = document.querySelectorAll('.players-btn-group');
    let pointsButtons = document.querySelectorAll('.points-btn-group');
    
    playerButtons.forEach(button => button.disabled = true);
    pointsButtons.forEach(button => button.disabled = true);
}
// Deshabilitar botones inicio juego
function disableSelectionButtons()
{
    let playerButtons = document.querySelectorAll('.players-btn-group');
    let pointsButtons = document.querySelectorAll('.points-btn-group');
    
    playerButtons.forEach(button => button.disabled = true);
    pointsButtons.forEach(button => button.disabled = true);
}

// Generación de formularios de registro
function generatePlayerForms(num_players) {
    const popupContainer = document.getElementById("gameRegister");
    popupContainer.innerHTML = ""; // Limpiar contenido previo

    let teamNumber = num_players == 2 ? 2 : 2;
    let title = num_players == 2 ? "Player" : "Team";

    for (let i = 1; i <= teamNumber; i++) {
        const playerForm = document.createElement("div");
        playerForm.classList.add("game-register-content");
        playerForm.innerHTML =`
            <h3 id="modalTitle">${title} ${i}</h3>
            <div class="game-register-content-input">
                <label for="usernameInput${i}" class="game-register-content-label">Username</label>
                <input type="text" class="form-control" id="usernameInput${i}" name="usernameInput${i}" placeholder="Username" required>
            </div>
            <div class="game-register-content-input">
                <label class="game-register-content-label" data-key="chooseBoost">Choose a Boost</label>
                <div class="boost-options">
                    <div class="boost-option game-option-selected" data-boost="speed" onclick="selectBoost('speed', ${i})">
                        <img src="images/speed.png" alt="Speed Boost">
                    </div>
                    <div class="boost-option" data-boost="power" onclick="selectBoost('power', ${i})">
                        <img src="images/power.png" alt="Power Boost">
                    </div>
                    <div class="boost-option" data-boost="defense" onclick="selectBoost('defense', ${i})">
                        <img src="images/shield.png" alt="Defense Boost">
                    </div>
                </div>
            </div>
        `;
        popupContainer.appendChild(playerForm);
    }
}

// Selección del bost
function selectBoost(boostType, playerId) {
    // Selecciona todos los boost-options del jugador correspondiente
    const playerBoosts = document.querySelectorAll(`.game-register-content:nth-child(${playerId}) .boost-option`);

    // Remueve la clase 'selected' de todos los boosts del jugador
    playerBoosts.forEach(boost => boost.classList.remove('game-option-selected'));

    // Encuentra el boost seleccionado y agrégale la clase 'selected'
    playerBoosts.forEach(boost => {
        if (boost.dataset.boost === boostType) {
            
            boost.classList.add('game-option-selected');
        }
    });

    console.log(`Player ${playerId} selected boost: ${boostType}`);
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

function hexToRgb(hex) {
    // Elimina el "#" si está presente
    hex = hex.replace(/^#/, '');
    
    // Convierte a RGB
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    return `rgb(${r}, ${g}, ${b})`;
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
    }

    // speed
    const savedSpeed = localStorage.getItem("ballSpeed");

    console.log("Save speed " + savedSpeed)
    if (savedSpeed >= 400 && savedSpeed <= 600) {
        updateBallSpeed(savedSpeed)
    }

    // color
    const savedColor = localStorage.getItem("ballColor");

    console.log("Save color " + savedColor)
    if (savedColor) {
        updateBallColor(savedColor)
    }

    // backgroundColor
    const savedBackground = localStorage.getItem("backgroundColor")
    const canvas = document.querySelector("canvas");
    console.log("Saved background " + savedBackground)
    if (savedBackground && canvas){
        canvas.style.backgroundColor = savedBackground;
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

    // lenguaje
    loadTranslations();
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
    changeLanguage(savedLanguage);
});
