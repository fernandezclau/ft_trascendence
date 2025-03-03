
document.addEventListener("DOMContentLoaded", function () {

    const jwtToken = localStorage.getItem("jwt");

    if (!jwtToken) {
        loadPage("login");
    } else {
        loadPage("game");
    }

    updateNavbar();
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

window.onload = function () {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const authMethod = params.get("auth");

    if (token) {
        localStorage.setItem("jwt", token);
        if (authMethod) {
            localStorage.setItem("auth_method", authMethod);
        }
        window.history.replaceState({}, document.title, "/");
        updateNavbar();
        loadPage("game");
    } else {
        updateNavbar();
    }
};

function updateNavbar() {
    const authContainer = document.getElementById("auth-container");
    const navbarLinks = document.querySelectorAll(".navbar-nav .nav-item");
    const jwtToken = localStorage.getItem("jwt");

    if (jwtToken) {
        // Determinar qué backend consultar (8000 para la API de 42, 8001 para login normal)
        const apiUrl = localStorage.getItem("auth_method") === "42" 
            ? "http://localhost:8000/api/auth/user" 
            : "http://localhost:8001/api/auth/user";

        fetch(apiUrl, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${jwtToken}`,
                "Content-Type": "application/json"
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch user data");
            }
            return response.json();
        })
        .then(data => {
            if (data.username) {
                // Si el usuario no tiene imagen, asignar una imagen por defecto
                const imageUrl = data.image_url ? data.image_url : "/images/default-avatar.png";

                authContainer.innerHTML = `
                    <div class="user-info">
                        <img src="${imageUrl}" alt="Profile" class="profile-pic">
                        <span class="username">${data.username}</span>
                        <button class="btn logout-button" onclick="logout()">Logout</button>
                    </div>
                `;
                navbarLinks.forEach(link => {
                    link.style.display = "block";
                });
            }
        })
        .catch(error => {
            console.error("Error fetching user data:", error);
            localStorage.removeItem("jwt");
            resetNavbar();
        });
    } else {
        resetNavbar();
    }
}

function resetNavbar() {
    const authContainer = document.getElementById("auth-container");
    const navbarLinks = document.querySelectorAll(".navbar-nav .nav-item");

    authContainer.innerHTML = `
        <button class="btn login-button" onclick="loadPage('login')" data-key="login">Log in</button>
        <button class="btn signup-button" onclick="loadPage('register')" data-key="signup_button">Sign up</button>
    `;
    navbarLinks.forEach(link => {
        link.style.display = "none";
    });
}

function logout() {
    localStorage.removeItem("jwt");
    localStorage.removeItem("auth_method"); // Eliminar el método de autenticación
    window.location.reload();
}
