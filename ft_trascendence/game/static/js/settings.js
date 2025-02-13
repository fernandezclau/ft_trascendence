//SOUND
function toggleSound() {
    const soundIcon = document.getElementById('soundIcon');

    // Cambiar el icono entre campana y campana con raya
    if (soundIcon.classList.contains('fa-bell')) {
        soundIcon.classList.remove('fa-bell');
        soundIcon.classList.add('fa-bell-slash');
    } else {
        soundIcon.classList.remove('fa-bell-slash');
        soundIcon.classList.add('fa-bell');
    }
}

//DARK MODE
function toggleMode() {
    const modeIcon = document.getElementById('modeIcon');

    // Cambiar el icono entre luna (modo oscuro) y sol (modo claro)
    if (modeIcon.classList.contains('fa-sun')) {
        modeIcon.classList.remove('fa-sun');
        modeIcon.classList.add('fa-moon');
    } else {
        modeIcon.classList.remove('fa-moon');
        modeIcon.classList.add('fa-sun');
    }
}

//COLOR BALL
function changeBallColor(color, selectedElement) {
    // Cambiar el color de la pelota
    const ball = document.getElementById('pongBall');
    ball.style.backgroundColor = color;

    // Eliminar la clase 'selected' de todos los elementos
    const allColors = document.querySelectorAll('.color-option');
    allColors.forEach(option => {
        option.classList.remove('selected');
    });

    // Añadir la clase 'selected' al círculo que fue clickeado
    selectedElement.classList.add('selected');
}


