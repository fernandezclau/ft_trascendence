
// Función para mostrar u ocultar la contraseña
function togglePassword(passwordId, iconId) {
    const passwordInput = document.getElementById(passwordId);
    const icon = document.getElementById(iconId);

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    } else {
        passwordInput.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    }
}

// Mostrar formulario de registro
document.getElementById("toggleToRegister").addEventListener("click", function() {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("registerFormContainer").style.display = "block";
});

// Mostrar formulario de inicio de sesión
document.getElementById("toggleToLogin").addEventListener("click", function() {
    document.getElementById("login-form").style.display = "block";
    document.getElementById("registerFormContainer").style.display = "none";
});
