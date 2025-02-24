

let currentPage = null; // Variable para rastrear la página actual

function loadPage(page, callback) {
    // No recargar si ya está en la página solicitada
    if (page === currentPage) {
        console.log(`La página ${page} ya está cargada.`);
        return;
    }

    fetch(`pages/${page}.html`)
        .then(response => response.text())
        .then(html => {
            document.getElementById('content-container').innerHTML = html;
            currentPage = page; // Actualizar la página actual
            
            // Ocultar el juego si no está en la página del juego
            if (page !== 'game') {
                document.getElementById('game').style.display = 'none';
                document.getElementById('game').style.visibility = 'hidden';
            } else {
                loadGame(); // Cargar el juego si está en la página del juego
                document.getElementById('game').style.display = 'block';
                document.getElementById('game').style.visibility = 'visible';
            }

            // Verifica si estamos en "animate" y carga Three.js si es necesario
            if (page === "animate") {
                if (typeof THREE === "undefined") {
                    const script = document.createElement("script");
                    script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
                    script.onload = function () {
                        console.log("Three.js cargado correctamente.");
                        startAnimation(); // Inicia la animación después de cargar Three.js
                    };
                    document.head.appendChild(script);
                } else {
                    startAnimation(); // Si ya está cargado, inicia la animación directamente
                }
            }
            
            // Traducir el contenido de la página solicitada
            const savedLanguage = localStorage.getItem('preferredLanguage');
            changeLanguage(savedLanguage);

            // Ejecutar la función de devolución de llamada si se proporciona
            if (callback) callback();
        })
        .catch(error => console.error('Error loading page:', error));
}

function loadGame() {
    const startButton = document.getElementById('startButton'); 
    startButton.disabled = true;
    
    document.getElementById("playerForm").addEventListener("submit", function(event) {
        event.preventDefault();
    });
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