
document.addEventListener("DOMContentLoaded", function () {
    loadPage("game");
    applySettings();

    window.addEventListener("resize", mobileGame);
    window.addEventListener("resize", mobileTournament);
});

// Hacer resize sobre pantalla Juego
function mobileGame() {
    const button = document.getElementById("startButton")
    if (window.innerWidth <= 768){

        // Activamos botón START
        if (button){
            button.disabled = false;
            // Mostramos formularios
            generatePlayerForms(2, false, false, "Claudia"); // TODO: Modificar con el username 
        }

        // 2 jugadores
        if (playersToPlay != 2) {
            playersToPlay = 2;
            drawGameBoard();
        }
    }
    else {
        if (button) {
            button.disabled = true;
        }
        let playersButtons = document.querySelectorAll('.players-btn-group');
        if (playersButtons) {
            playersButtons.forEach(button => button.classList.remove('button-selected'));
            if (playersButtons[0])
                playersButtons[0].classList.add('button-selected');
        }
    }
}

// Hacer resize sobre pantalla Torneo
function mobileTournament() {
    const teamsButton = document.querySelectorAll(".tour-players-btn-group")
    if (window.innerWidth <= 768){
        // Activamos botones de seleccion equipo (no opcion +2 jugadores en un mismo equipo)
        if (teamsButton)
            teamsButton.forEach(button => button.disabled = false)

    } else {
        if (teamsButton)
            teamsButton.forEach(button => button.disabled = true)
    }
}