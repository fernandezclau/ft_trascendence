document.addEventListener("DOMContentLoaded", function () {
    const jwtToken = localStorage.getItem("jwt");

    if (!jwtToken) {
        loadPage("login");
    } else {
        loadPage("game");
    }

    updateNavbar();
});

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
        <button class="btn signup-button" onclick="loadPage('register')" data-key="signup">Sign up</button>
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
