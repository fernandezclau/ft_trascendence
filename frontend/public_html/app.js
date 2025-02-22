
/* LOADING FUNCTION */
function loadPage(page, callback) {
    if (page === "home") {
        document.getElementById('content-container').innerHTML = "";
        document.getElementById('game').style.display = 'block';
        document.getElementById('game').style.visibility = 'visible';

        const playerSelection = document.getElementById('playerSelection');
        playerSelection.style.display = 'flex';
        playerSelection.style.visibility = 'visible';

        playerSelection.offsetHeight;
        playerSelection.style.justifyContent = 'center';
    } else {
        fetch(`pages/${page}.html`)
            .then(response => response.text())
            .then(html => {
                document.getElementById('content-container').innerHTML = html;
                document.getElementById('game').style.display = 'none';
                document.getElementById('game').style.visibility = 'hidden';

                const playerSelection = document.getElementById('playerSelection');
                playerSelection.style.display = 'none';
                playerSelection.style.visibility = 'hidden';

                const savedLanguage = localStorage.getItem('preferredLanguage');
                changeLanguage(savedLanguage);

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

                if (callback) callback();
            })
            .catch(error => console.error('Error loading page:', error));
    }
}

// LOADING SETTINGS
function loadSettings() {
    loadPage("settings", () => {

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
        
        const selectedColorButton = Array.from(colorButtons).find(button => button.style.backgroundColor === ballColor);
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

        // Sesión accesible
        
        // Lenguaje 
        const savedLanguage = localStorage.getItem('preferredLanguage');
        
        console.log("Idioma " + savedLanguage)
        if (savedLanguage) {
            document.querySelector(`.language-select`).value = savedLanguage;
            changeLanguage(savedLanguage);
        }
    });
}