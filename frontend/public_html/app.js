

let currentPage = null; // Variable para rastrear la página actual
let reload = true;

async function loadPage(page, callback) {

    if (page === currentPage) {
        console.log(`La página ${page} ya está cargada.`);
        return;
    }

    try {
        const response = await fetch(`pages/${page}.html`);
        const html = await response.text();
        document.getElementById('content-container').innerHTML = html;
        currentPage = page; // Actualizar la página actual

        // Manejo de visibilidad y carga de contenido según la página
        switch (page) {
            case "game":
                loadGame();
                toggleGameVisibility(true);
                break;

            case "tournament":
                loadTournament();
                toggleGameVisibility(true);
                break;

            case "animate":
                loadThreeJS();
                toggleGameVisibility(false);
                break;

            default:
                toggleGameVisibility(false);
                break;
        }

        // Traducir la página según el idioma guardado
        changeLanguage(localStorage.getItem('preferredLanguage'));

        // Ejecutar callback si se proporciona
        if (callback) callback();
    } catch (error) {
        console.error('Error loading page:', error);
    }

    // Implementar lógica recarga juego (solo en pong y tournament)
}

// Función para mostrar u ocultar el juego
function toggleGameVisibility(show) {
    const gameElement = document.getElementById('game');
    if (gameElement) {
        gameElement.style.display = show ? 'block' : 'none';
        gameElement.style.visibility = show ? 'visible' : 'hidden';
    }
}

/* LOADING GAME */
function loadGame() {

    // Title reload button 
    document.getElementById("RELOAD").title = translations[document.documentElement.lang]?.["reload"] || "Reload";
        
    // Disable default start button option 
    document.getElementById("playerForm").addEventListener("submit", function(event) {
        event.preventDefault();
    });
    document.getElementById("RELOAD").addEventListener("submit", function(event) {
        event.preventDefault();
    });

    //Reload game 
    if (reload)
        reloadGame("game");
}

/* LOADING TOURNAMENT */
function loadTournament() {
    // Title reload button
    document.getElementById("RELOAD2").title = translations[document.documentElement.lang]?.["reload"] || "Reload";

    // Disable startButton
    const startButton = document.getElementById('tournamentButton'); 
    startButton.disabled = true;

    const totalTeams = document.getElementById('tournamentButton'); 
    totalTeams.disabled = true;

    // Disable default start button option
    document.getElementById("tournamentButton").addEventListener("submit", function(event) {
        event.preventDefault();
    });
    document.getElementById("tournamentForm").addEventListener("submit", function(event) {
        event.preventDefault();
    });    

    //Reload game
    if (reload)
        reloadGame("tournament");
}

/* LOADING SETTINGS */
function loadSettings() {
    loadPage("settings", () => {
        // Cargar configuraciones guardadas en el localStorage
        
        // size
        const sizeRange = document.getElementById("sizeRange");
        const savedSize = localStorage.getItem("ballSize");

        if (sizeRange && savedSize) {
            sizeRange.value = savedSize;
        }
        
        // speed
        const speedRange = document.getElementById("ballRange");
        const savedSpeed = localStorage.getItem("ballSpeed");

        if (savedSpeed && savedSpeed) {
            speedRange.value = savedSpeed;
        }

        // color
        const colorButtons = document.querySelectorAll('.color-option');
        colorButtons.forEach(button => button.classList.remove('selected'));

        const selectedColorButton = Array.from(colorButtons).find(button => button.style.backgroundColor === ballColor  || button.style.backgroundColor === hexToRgb(ballColor));
        if (selectedColorButton) {
            selectedColorButton.classList.add('selected');
        }

        // background
        const backgroundButtons = document.querySelectorAll('.background-option');
        const savedBackground = localStorage.getItem("backgroundColor");
        backgroundButtons.forEach(button => button.classList.remove('selected'));
        
        const selectedButton = document.querySelector(`.background-option[data-color="${savedBackground}"]`);
        console.log("Selected button bg" + selectedButton)
        if (selectedButton) {
            selectedButton.classList.add('selected');
        }

        // Cargar estado del sonido
        let soundIcon = document.getElementById("soundIcon");
        if (soundIcon){
            if (localStorage.getItem("sound") === "muted") {
                soundIcon.classList.replace("fa-bell", "fa-bell-slash");
                audioContext.suspend();  // Silencia el sonido
            } else {
                soundIcon.classList.replace("fa-bell-slash", "fa-bell");
                audioContext.resume();   // Activa el sonido
            }
        }

        if (modeIcon && localStorage.getItem("darkMode") === "enabled") {
            document.body.classList.add("dark-mode");
            modeIcon.classList.replace("fa-sun", "fa-moon");
        }
        
        // Lenguaje 
        const savedLanguage = localStorage.getItem('preferredLanguage');
        
        if (savedLanguage) {
            document.querySelector(`.language-select`).value = savedLanguage;
            changeLanguage(savedLanguage);
        }
    });
}