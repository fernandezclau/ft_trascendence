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
document.addEventListener("DOMContentLoaded", function () {
    const modeIcon = document.getElementById("modeIcon");

    // Cargar el tema guardado y actualizar el icono
    if (localStorage.getItem("theme") === "light") {
        document.body.classList.add("light-mode");
        modeIcon.classList.remove("fa-sun");
        modeIcon.classList.add("fa-moon");
    } else {
        document.body.classList.remove("light-mode");
        modeIcon.classList.remove("fa-moon");
        modeIcon.classList.add("fa-sun");
    }
});

// Función para alternar el modo claro/oscuro
function toggleMode() {
    const modeIcon = document.getElementById("modeIcon");

    document.body.classList.toggle("light-mode");

    if (document.body.classList.contains("light-mode")) {
        localStorage.setItem("theme", "light");
        modeIcon.classList.remove("fa-sun");
        modeIcon.classList.add("fa-moon");
    } else {
        localStorage.setItem("theme", "dark");
        modeIcon.classList.remove("fa-moon");
        modeIcon.classList.add("fa-sun");
    }
}