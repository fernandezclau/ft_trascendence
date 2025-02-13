
function togglePassword(inputId, iconId) {
    let passwordInput = document.getElementById(inputId);
    let icon = document.getElementById(iconId);

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash"); // Cambia el icono a "cerrado"
    } else {
        passwordInput.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye"); // Vuelve a "abierto"
    }
}

document.getElementById('toggleToLogin').addEventListener('click', function () {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('toggleFormText').style.display = 'block';
    document.getElementById('toggleFormText2').style.display = 'none';
    document.getElementById('loginModalLabel').innerText = "Iniciar Sesión";
    document.getElementById('loginWith42').innerText = "Iniciar Sesion con 42";
});

// Funcionalidad para enviar el formulario de login
document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    console.log("Usuario:", username);
    console.log("Contraseña:", password);
    alert("Formulario de Login enviado");
});

// Funcionalidad para enviar el formulario de registro
document.getElementById('registerForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const newUsername = document.getElementById('newUsername').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword === confirmPassword) {
        console.log("Usuario registrado:", newUsername);
        console.log("Contraseña registrada:", newPassword);
        alert("Formulario de Registro enviado");
    } else {
        alert("Las contraseñas no coinciden");
    }
});

function changeLanguage(language) {
    var languageIcon = document.getElementById('languageIcon');

    switch(language) {
        case 'es':
            languageIcon.src = "https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg";
            break;
        case 'en':
            languageIcon.src = "https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_the_United_States.svg";
            break;
        case 'de':
            languageIcon.src = "https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Germany.svg";
            break;
    }
}

document.getElementById("settingsBtn").addEventListener("click", function() {
    var settingsModal = new bootstrap.Modal(document.getElementById("settingsModal"));
    settingsModal.show();
});

