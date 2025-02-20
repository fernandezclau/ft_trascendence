function toggleSound() {
    let soundIcon = document.getElementById("soundIcon");

    if (audioContext.state === "running") {
        audioContext.suspend();  // Pausa el sonido
        
        soundIcon.classList.replace("fa-bell", "fa-bell-slash");
        localStorage.setItem("sound", "muted");
    } else {
        audioContext.resume();   // Reanuda el sonido
        soundIcon.classList.replace("fa-bell-slash", "fa-bell");
        localStorage.setItem("sound", "unmuted");
    }
}

function toggleMode() {
    let modeIcon = document.getElementById("modeIcon");

    if (document.body.classList.contains("light-mode")) {
        document.body.classList.remove("light-mode");
        modeIcon.classList.replace("fa-moon", "fa-sun");
        localStorage.setItem("darkMode", "disabled");
        
        let canvasBorders = document.querySelectorAll('.canvas-border');
        canvasBorders.forEach(function(element) {
            element.classList.remove("light-mode");
        });
    } else {
        document.body.classList.add("light-mode");
        modeIcon.classList.replace("fa-sun", "fa-moon");
        localStorage.setItem("darkMode", "enabled");

        let canvasBorders = document.querySelectorAll('.canvas-border');
        canvasBorders.forEach(function(element) {
            element.classList.add("light-mode");
        });
    }
}

function changeBackground(value, button) {
    const canvas = document.querySelector("canvas");

    const buttons = document.querySelectorAll('.background-option');
    
    buttons.forEach(button => {
        button.classList.remove('selected');
    });

    if (button)
        button.classList.add('selected');

    if (value) {
        canvas.style.backgroundColor = value;
        localStorage.setItem("backgroundColor", value); //Guardar en localStorage
        console.log("Paso")
    }
}

// LANGUAGE
let translations = {};

function loadTranslations() {
    fetch('script/translations.json')
        .then(response => response.json())
        .then(data => {
            translations = data;
            console.log("Traducciones cargadas:", translations);
            const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
            changeLanguage(savedLanguage);
        })
        .catch(error => {
            console.error('Error loading translations:', error);
        });
}

function changeLanguage(language) {
    document.documentElement.lang = language; 
    const translation = translations[language];

    if (!translation) {
        console.warn('Idioma no encontrado:', language);
        return;
    }

    document.querySelectorAll('[data-key]').forEach(function(element) {
        const key = element.getAttribute('data-key');
        if (translation[key]) {
            if (element.tagName === "INPUT") {
                // Si es un input, cambiar el placeholder
                element.placeholder = translation[key];
            } else {
                // Para otros elementos, cambiar el texto
                element.textContent = translation[key];
            }
            
        } else {
            console.warn(`Clave de traducción no encontrada para: ${key}`);
        }
    });
}

// Cambiar idioma cuando se selecciona uno
function setLanguage(language) {
    localStorage.setItem('preferredLanguage', language);
    changeLanguage(language);
}




