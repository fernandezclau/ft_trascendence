// # SECCIÓN DE SONIDO
let audioContext;
const soundBuffer = {};

// Crear audioContext solo después de una interacción del usuario
document.addEventListener("click", () => {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        preloadSounds(); // Cargar sonidos solo después de la interacción
    }
});

// Función para cargar un sonido
async function loadSound(name, url) {
    if (!audioContext) return; // Asegurarse de que audioContext está disponible
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    soundBuffer[name] = await audioContext.decodeAudioData(arrayBuffer);
}

// Función para reproducir un sonido
function playSound(name) {
    if (!soundBuffer[name] || !audioContext) return;
    const source = audioContext.createBufferSource();
    source.buffer = soundBuffer[name];
    source.connect(audioContext.destination);
    source.start();
}

// Función para cargar todos los sonidos después de la interacción del usuario
function preloadSounds() {
    loadSound('bounce', 'sound/bound.wav');
    loadSound('score', 'sound/score.mp3');
    loadSound('gameover', 'sound/gameover.mp3');
    loadSound('pause', 'sound/pause.mp3');
    loadSound('resume', 'sound/resume.mp3');
}
