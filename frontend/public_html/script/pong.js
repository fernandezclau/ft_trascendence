let players = [];
let palleteColor;
const canvas = document.getElementById('pongCanvas');
const context = canvas.getContext('2d');
const player1Score = document.getElementById('player1Score');
const player2Score = document.getElementById('player2Score');
const debugMessage = document.getElementById('debugMessage');

// # SECCIÓN DE JUEGO
let paused = true;                                      // Guarda si el juego está pausado
let winner = 0;                                         // Guarda si hay un ganador (0:No, 1:Jugador1, 2:Jugador2)
let lastTime = performance.now();                       // Contadores de tiempo
let pauseTime = 0.0;                                    // Tiempo transcurrido desde la pausa
let animationTime;                                      // Tiempo transcurrido desde el inicio de la animación
let animation = false;                                  // Guarda si se está actualmente en una animación
let animationColor;                                     // Color del jugador que provocó la animación
let UIColor = '#fff';                                   // Color actual de la interfaz
let pointsToWin = 10;                                   // Puntos para ganar
let playersToPlay = 1;                                  // Numero de jugadores
let countDownValue = 3;                                 // Inicia la cuenta atrás 3

// # SECCIÓN DE JUGADOR
const paddleWidth = 10, paddleHeight = 100;             // Dimensiones de los rectángulos
const paddleSpeed = 600;                                // Velocidad de los jugadores
let player1Y = canvas.height / 2 - paddleHeight / 2;    // Posiciones de ambos jugadores
let player2Y = player1Y;
let wPressed = false, sPressed = false;                 // Controla si se están pulsando las teclas W/S
let upPressed = false, downPressed = false;             // Controla si se están pulsando las teclas Arriba/Abajo

// # SECCIÓN DE PELOTA
let ballSize = 10;                                    // Dimensiones de la pelota
let ballBSpeed = 500;                                 // Velocidad base de la pelota
let ballX = canvas.width / 2 - ballSize / 2;            // Posición de la pelota
let ballY = canvas.height / 2 - ballSize / 2;
let ballSpeedX = 500, ballSpeedY = 500;                // Velocidades en X e Y de la pelota
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

    // Zona del jugador 1
    if (ballX <= paddleWidth) {
        // Gol
        if (ballX + ballSize <= 0)
            playerScore(2);

        // Rebote
        else if (ballY >= player1Y && ballY <= player1Y + paddleHeight) {
            ballX = paddleWidth;
            ballSpeedX = -ballSpeedX * (Math.random() * 0.2 + 0.9);
            ballSpeedY = ballSpeedY * (Math.random() * 0.2 + 0.9);
            playSound('bounce');
        }
    }

    // Zona del jugador 2
    if (ballX + ballSize >= canvas.width) {
        // Gol
        if (ballX >= canvas.width)
            playerScore(1);

        // Rebote
        else if (ballY >= player2Y && ballY <= player2Y + paddleHeight) {
            ballX = canvas.width - paddleWidth - ballSize;
            ballSpeedX = -ballSpeedX * (Math.random() * 0.2 + 0.9);
            ballSpeedY = ballSpeedY * (Math.random() * 0.2 + 0.9);
            playSound('bounce');
        }
    }
}

function playerScore(player) {
    // Comprobar victoria
    if (player == 1) {
        player1Score.textContent = parseInt(player1Score.textContent) + 1;
        animationColor = "#357ABD";
        if (parseInt(player1Score.textContent) >= pointsToWin) {
            winner = 1;
            debugMessage.classList.add('winner');
            debugMessage.textContent = "PLAYER 1 WINS!";
            debugMessage.style.color = 'blue';
        }
    }
    else {
        player2Score.textContent = parseInt(player2Score.textContent) + 1;
        animationColor = "#BD3535";
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
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'w' || event.key === 'W') wPressed = true;
    if (event.key === 's' || event.key === 'S') sPressed = true;
    if (event.key === 'ArrowUp') upPressed = true;
    if (event.key === 'ArrowDown') downPressed = true;
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
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'w' || event.key === 'W') wPressed = false;
    if (event.key === 's' || event.key === 'S') sPressed = false;
    if (event.key === 'ArrowUp') upPressed = false;
    if (event.key === 'ArrowDown') downPressed = false;
});

function drawGameBoard() {
    // Dibujar tablero limpio
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar Jugador 1
    context.fillStyle = "#357ABD";
    context.fillRect(0, player1Y, paddleWidth, paddleHeight);
    // Dibujar Jugador 2
    context.fillStyle = "#BD3535";
    context.fillRect(canvas.width - paddleWidth, player2Y, paddleWidth, paddleHeight);
    // Dibujar perlota
    context.fillStyle = ballColor;
    context.beginPath();
    context.arc(ballX + ballSize / 2, ballY + ballSize / 2, ballSize / 2, 0, Math.PI * 2);
    context.fill();

    // Dibujar línea discontinua en el centro
    context.setLineDash([7, 7]);
    context.beginPath();
    context.moveTo(canvas.width / 2, 0);
    context.lineTo(canvas.width / 2, canvas.height);
    context.strokeStyle = UIColor;
    context.lineWidth = 2;
    context.stroke();
    context.setLineDash([]);
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

// Iniciar juego
drawGameBoard();
gameLoop();

// Función para seleccionar el número de jugadores
function selectPlayers(players) {
    let playersButtons = document.querySelect// Añadir la clase 'selected' al botón que fue clicado
    // Ajuste de índice para que coincida con los valores disponibles (1, 2, 4 jugadores)orAll('.players-btn-group');
    playersButtons.forEach(button => button.classList.remove('selected'));

    let selectedButton;
    if (players === 1) {
        selectedButton = playersButtons[0]; // Selecciona el botón de 1 jugador
    } else if (players === 2) {
        selectedButton = playersButtons[1]; // Selecciona el botón de 2 jugadores
    } else if (players === 4) {
        selectedButton = playersButtons[2]; // Selecciona el botón de 4 jugadores
    }

    if (selectedButton) {
        selectedButton.classList.add('selected');
    } else {
        console.error('No se pudo encontrar el botón para los jugadores:', players);
    }

    playersToPlay = players;
    console.log(`Selected ${playersToPlay} players`);
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

const startButton = document.getElementById('startButton');

// Deshabilitar botones inicio juego
function disableSelectionButtons()
{
    let playerButtons = document.querySelectorAll('.players-btn-group');
    let pointsButtons = document.querySelectorAll('.points-btn-group');
    
    playerButtons.forEach(button => button.disabled = true);
    pointsButtons.forEach(button => button.disabled = true);
}

// start button
document.getElementById("startButton").addEventListener("click", function() {

    let iPlayers = 1;   // Jugadores registrados
    
    // 1. Deshabilitar botones seleccion
    disableSelectionButtons();

    // Abrir pop up
    function openPopup(playerNumber) {

        // Extraer campos
        const modal = document.getElementById("popupContainer");
        const modalTitle = document.getElementById("modalTitle");
        const usernameInput = document.getElementById("usernameInput");
        const boostSpell = document.getElementById("boostSelect");
        const saveButton = document.getElementById("saveButton");
        
        // 1. Set title
        modalTitle.innerText = `Player ${playerNumber}`;
        usernameInput.value = '';

        // 2. Show modal
        modal.style.display = 'block';

        // 3. Save name
        saveButton.onclick = function() {
            const playerName = usernameInput.value.trim();
            const playerBoost = boostSpell.value;

            if (playerName && playerBoost) {
                const player = {
                    name: playerName,
                    boost: playerBoost,
                    color: palleteColor
                };
                
                // 3. Añadimos jugador
                if (isPlayerValid(players, player))        
                    players.push(player);
                else
                {
                    alert(`Nombre invalido: ${playerName}`);
                    return ;
                }
                
                alert(`Jugador ${playerNumber} registrado: ${playerName}`);
                modal.style.display = 'none'; // Cerrar el popup
                iPlayers++;
                
                // Si hay más jugadores, abrir el siguiente popup
                if (iPlayers <= playersToPlay) {
                    openPopup(iPlayers);
                }
            } else {
                alert("Por favor ingresa un nombre.");
            }
        };
    }
    // Cerrar el popup
    document.getElementById("closeButton").addEventListener("click", function() {
        
        document.getElementById("popupContainer").style.display = 'none';
        players = []
        
    });

    // 2. Abrir pop up
    openPopup(iPlayers);

    console.log(players);

    // Cuenta atrás empezar juego

    // 4. INicio juego
});


// Verificamos que el username sea único
function isPlayerValid(players, player) {

    if (players.some(p => p.name === player.name))
        return false; // Si el nombre ya existe, no es válido
    return true;
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
    UpdateColorSelection(value);
}

function UpdateColorSelection(value) {
    const buttons = document.querySelectorAll('.color-option');
    
    buttons.forEach(button => {
        button.classList.remove('selected');
    });
    
    const selectedButton = Array.from(buttons).find(button => button.style.backgroundColor === value);
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
    UpdateColorSelection(value);
}

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
        }
        else
        {
            document.body.classList.add("light-mode");

            let canvasBorders = document.querySelectorAll('.canvas-border');
            canvasBorders.forEach(function(element) {
                element.classList.add("light-mode");
           });
        }
    }

    // lenguaje
    loadTranslations();
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
    changeLanguage(savedLanguage);
});
