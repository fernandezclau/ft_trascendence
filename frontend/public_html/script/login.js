async function registerUser() {
    const username = document.getElementById("newUsername").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("newPassword").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    if (!username || !email || !password || !confirmPassword) {
        alert("❌ Todos los campos son obligatorios.");
        return;
    }

    if (password !== confirmPassword) {
        alert("❌ Las contraseñas no coinciden.");
        return;
    }

    try {
        const csrfToken = await getCsrfToken();  

        const response = await fetch("http://localhost:8001/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken  
            },
            credentials: "include",  
            body: JSON.stringify({ username, email, password })
        });
        const data = await response.json();

        if (response.ok) {
            if (data.requiresOTP && data.setup_token) {
                // Guardar el token de configuración
                localStorage.setItem("otp_setup_token", data.setup_token);
                
                // Guardar el código QR temporalmente para mostrar en la página de configuración
                sessionStorage.setItem("tempQrCode", data.qr_code);
                
                // Cargar página de configuración OTP
                PageManager.load("otp-setup", function() {
                    // Mostrar el código QR una vez que la página esté cargada
                    const qrImg = document.getElementById("qrCode");
                    if (qrImg && data.qr_code) {
                        qrImg.src = data.qr_code;
                    } else {
                        console.error("No se pudo mostrar el código QR");
                    }
                });
            } else {
                localStorage.setItem("jwt_backend2", data.token);
                localStorage.setItem("username_backend2", data.username);
                if (data.image_url) {
                    localStorage.setItem("image_url_backend2", data.image_url);
                }
                PageManager.load("game", updateNavbar);
            }
        } else {
            alert("⚠️ Error: " + (data.error || "Error desconocido."));
        }
    } catch (error) {
        console.error("🚨 Error en la solicitud:", error);
    }
}

async function loginUser() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const otpField = document.getElementById("otpField");
    const otpCode = document.getElementById("otpCode")?.value.trim();

    if (!email || !password) {
        alert("❌ Email y contraseña son obligatorios.");
        return;
    }

    try {
        const csrfToken = await getCsrfToken();

        const response = await fetch("http://localhost:8001/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken
            },
            credentials: "include",
            body: JSON.stringify({ 
                email, 
                password,
                otp: otpCode
            })
        });

        const data = await response.json();

        if (response.ok) {
            if (data.requiresOTP) {
                // Mostrar campo OTP si no está visible
                if (otpField) {
                    otpField.style.display = "block";
                }
                
                // Si hay un token de login temporal, guardarlo
                if (data.login_token) {
                    localStorage.setItem("otp_login_token", data.login_token);
                }
                
                return;
            }
            
            // Login exitoso
            localStorage.setItem("jwt_backend2", data.token);
            localStorage.setItem("username_backend2", data.username);
            localStorage.setItem("image_url_backend2", data.image_url || "https://i.imgur.com/DP2aShH.png");

            PageManager.load("game", updateNavbar);
        } else {
            alert("⚠️ Error: " + (data.error || "Error desconocido." ));
        }
    } catch (error) {
        console.error("🚨 Error en la solicitud:", error);
    }
}

async function verifyOTP() {
    // Obtener el código OTP ingresado
    const otpCode = document.getElementById("otpCode").value.trim();
    
    if (!otpCode) {
        alert("❌ Por favor, ingresa el código de verificación.");
        return;
    }

    if (otpCode.length !== 6 || !/^\d+$/.test(otpCode)) {
        alert("❌ El código debe tener 6 dígitos numéricos.");
        return;
    }
    
    // Determinar qué token usar (setup o login)
    const setupToken = localStorage.getItem("otp_setup_token");
    const loginToken = localStorage.getItem("otp_login_token");
    const token = setupToken || loginToken;
    
    if (!token) {
        alert("Sesión expirada. Por favor, inténtalo nuevamente.");
        PageManager.load("login");
        return;
    }

    try {
        const csrfToken = await getCsrfToken();

        const response = await fetch("http://localhost:8001/api/auth/verify-otp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken,
                "Authorization": `Bearer ${token}`
            },
            credentials: "include",
            body: JSON.stringify({ otp: otpCode })
        });

        const data = await response.json();

        if (response.ok) {
            // Limpiar tokens temporales
            localStorage.removeItem("otp_setup_token");
            localStorage.removeItem("otp_login_token");
            sessionStorage.removeItem("tempQrCode");
            
            // Guardar datos de sesión
            localStorage.setItem("jwt_backend2", data.token);
            localStorage.setItem("username_backend2", data.username);
            localStorage.setItem("image_url_backend2", data.image_url || "https://i.imgur.com/DP2aShH.png");

            alert("✅ Verificación completada. Redirigiendo...");
            PageManager.load("game", updateNavbar);
        } else {
            alert("⚠️ Error: " + (data.error || "Código inválido"));
        }
    } catch (error) {
        console.error("🚨 Error en la verificación:", error);
    }
}

// Función para cargar la configuración OTP desde la página otp-setup.html
function loadOTPSetup() {
    // Verificar si hay un código QR en sessionStorage
    const qrCode = sessionStorage.getItem("tempQrCode");
    const qrImg = document.getElementById("qrCode");
    
    if (qrImg && qrCode) {
        qrImg.src = qrCode;
    } else if (qrImg) {
        // Si no hay código QR en sessionStorage pero sí hay token de configuración,
        // intentar obtener el código QR del servidor
        const setupToken = localStorage.getItem("otp_setup_token");
        
        if (setupToken) {
            fetch("http://localhost:8001/api/auth/otp-setup", {
                headers: {
                    "Authorization": `Bearer ${setupToken}`
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.qr_code) {
                    qrImg.src = data.qr_code;
                } else {
                    console.error("No se recibió un código QR válido");
                    alert("Error al cargar el código QR. Por favor, regístrate nuevamente.");
                    PageManager.load("register");
                }
            })
            .catch(error => {
                console.error("Error al obtener el código QR:", error);
                alert("Error de conexión. Por favor, inténtalo nuevamente.");
            });
        } else {
            // No hay token ni código QR, redirigir al registro
            alert("Sesión no válida. Por favor, regístrate nuevamente.");
            PageManager.load("register");
        }
    }
}

async function getCsrfToken() {
    try {
        const response = await fetch("http://localhost:8001/api/auth/csrf/", {
            method: "GET",
            credentials: "include"
        });

        const data = await response.json();
        return data.csrfToken;
    } catch (error) {
        console.error("🚨 No se pudo obtener el CSRF Token:", error);
        return "";
    }
}

function togglePassword(passwordFieldId, toggleIconId) {
    const passwordField = document.getElementById(passwordFieldId);
    const toggleIcon = document.getElementById(toggleIconId);
    if (passwordField.type === "password") {
        passwordField.type = "text";
        toggleIcon.classList.add("fa-eye-slash");
        toggleIcon.classList.remove("fa-eye");
    } else {
        passwordField.type = "password";
        toggleIcon.classList.add("fa-eye");
        toggleIcon.classList.remove("fa-eye-slash");
    }
}

// Event listeners
document.addEventListener("DOMContentLoaded", function() {
    // Configurar eventos para links de registro/login
    const signUpLink = document.querySelector(".sign-up");
    const loginButton = document.getElementById("loginButton");

    if (signUpLink) {
        signUpLink.addEventListener("click", function(event) {
            event.preventDefault();
            if (typeof PageManager !== "undefined" && PageManager.load) {
                PageManager.load("register");
            }
        });
    }

    if (loginButton) {
        loginButton.addEventListener("click", function(event) {
            event.preventDefault();
            if (typeof PageManager !== "undefined" && PageManager.load) {
                PageManager.load("login");
            }
        });
    }
    
    // Verificar si estamos en la página OTP
    if (document.querySelector(".otp-setup-container")) {
        loadOTPSetup();
    }
    
    // Manejar formularios
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function(event) {
            event.preventDefault();
            loginUser();
        });
    }
    
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", function(event) {
            event.preventDefault();
            registerUser();
        });
    }
});