document.addEventListener("DOMContentLoaded", function () {
    const jwtToken = localStorage.getItem("jwt");

    if (!jwtToken) {
        // Si no hay token, cargar la página de login
        loadPage("login");
    } else {
        // Si hay token, cargar la página del juego
        loadPage("game");
    }

    updateNavbar(); // Actualizar el navbar según el estado de autenticación
});

window.onload = function () {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const page = params.get("page");

    if (token) {
        localStorage.setItem("jwt", token);
        window.history.replaceState({}, document.title, "/");
        updateNavbar();  

        // Si se especificó una página en la URL, cargarla, de lo contrario, ir al juego
        if (page) {
            loadPage(page);
        } else {
            loadPage("game");
        }
    } else {
        updateNavbar();
    }
};

function updateNavbar() {
    const authContainer = document.getElementById("auth-container");
    const navbarLinks = document.querySelectorAll(".navbar-nav .nav-item");
    const jwtToken = localStorage.getItem("jwt");

    if (jwtToken) {
        fetch("http://localhost:8000/api/auth/user", {
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
                authContainer.innerHTML = `
                    <div class="user-info">
                        <img src="${data.image_url}" alt="Profile" class="profile-pic">
                        <span class="username">${data.username}</span>
                        <button class="btn logout-button" onclick="logout()">Logout</button>
                    </div>
                `;

                // Mostrar las opciones del navbar para usuarios logueados
                navbarLinks.forEach(link => {
                    link.style.display = "block";
                });
            }
        })
        .catch(error => {
            console.error("Error fetching user data:", error);
            localStorage.removeItem("jwt"); // Eliminar token si hay un error
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
        <button class="btn signup-button" onclick="loadPage('register')" data-key="signup">Sign up</button>
    `;

    // Ocultar las opciones del navbar para usuarios no autenticados
    navbarLinks.forEach(link => {
        link.style.display = "none";
    });
}

function logout() {
    localStorage.removeItem("jwt");
    window.location.reload();
}
