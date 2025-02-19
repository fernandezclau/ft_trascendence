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
const ballSize = 10;                                    // Dimensiones de la pelota
const ballBSpeed = 500;                                 // Velocidad base de la pelota
let ballX = canvas.width / 2 - ballSize / 2;            // Posición de la pelota
let ballY = canvas.height / 2 - ballSize / 2;
let ballSpeedX = 500, ballSpeedY = 500 ;                // Velocidades en X e Y de la pelota

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
    context.fillStyle = '#fff';
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
    let playersButtons = document.querySelectorAll('.players-btn-group');
    playersButtons.forEach(button => button.classList.remove('selected'));

    // Añadir la clase 'selected' al botón que fue clicado
    // Ajuste de índice para que coincida con los valores disponibles (1, 2, 4 jugadores)
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

// Start button
startButton.addEventListener('click', () => {
    
    console.log("Points to win: " + pointsToWin)
    console.log("Number of players: " + playersToPlay)
    
    
    // 1. Deshabilitamos botones
    disableSelectionButtons();

    // 2. 
});

