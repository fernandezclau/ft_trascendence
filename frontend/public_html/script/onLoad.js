
document.addEventListener("DOMContentLoaded", function () {
    loadPage("game");
    
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
    }
    else {
        if (button) {
            button.disabled = true;
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