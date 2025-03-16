async function registerUser() {
    const username = document.getElementById("newUsername").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("newPassword").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    if (!username || !email || !password || !confirmPassword) {
        alert(translations[document.documentElement.lang]?.["fields_required"]);
        PageManager.load("register", updateNavbar);
        return;
    }
    if (!email.includes("@") || !email.includes(".") || email.indexOf("@") > email.lastIndexOf(".")) {
        alert(translations[document.documentElement.lang]?.["invalid_mail"]);
        PageManager.load("register", updateNavbar);
        return;
    }

    if (username.length < 4) {
        alert(translations[document.documentElement.lang]?.["invalid_username"]);
        PageManager.load("register", updateNavbar);
        return;
    }

    if (password.length < 8) {
        alert(translations[document.documentElement.lang]?.["invalid_passwd_length"]);
        PageManager.load("register", updateNavbar);
        return;
    }

    if (!/[A-Z]/.test(password)) {
        alert(translations[document.documentElement.lang]?.["invalid_passwd_upper"]);
        PageManager.load("register", updateNavbar);
        return;
    }
    if (!/[0-9]/.test(password)) {
        alert(translations[document.documentElement.lang]?.["invalid_passwd_number"]);
        PageManager.load("register", updateNavbar);
        return;
    }

    if (password !== confirmPassword) {
        alert(translations[document.documentElement.lang]?.["invalid_passwd_match"]);
        PageManager.load("register", updateNavbar);
        return;
    }

    try {
        const csrfToken = await getCsrfToken();  

        const response = await fetch("https://localhost:8441/api/auth/register", {
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
            let language = localStorage.getItem("preferredLanguage") || "en";
            language = localStorage.setItem("preferredLanguage", language);
            localStorage.setItem("temp_token", data.temp_token);
            localStorage.setItem("jwt_backend2", data.token);
            PageManager.load("setup_2fa");
        } else {
            alert("⚠️ Error: " + (data.error || "Error desconocido."));
        }
    } catch (error) {
    }
}

async function loginUser() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        alert(translations[document.documentElement.lang]?.["fields_required"]);
        return;
    }

    if (!email.includes("@") || !email.includes(".") || email.indexOf("@") > email.lastIndexOf(".")) {
        alert(translations[document.documentElement.lang]?.["invalid_mail"]);
        return;
    }

    if (password.length < 8) {
        alert(translations[document.documentElement.lang]?.["invalid_passwd_length"]);
        return;
    }

    try {
        const csrfToken = await getCsrfToken();

        const response = await fetch("https://localhost:8441/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken
            },
            credentials: "include",
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {

            localStorage.setItem("temp_token", data.temp_token);
            PageManager.load("verify_otp");
        } else {
            alert("⚠️ Error: " + (data.error || "Error desconocido." ));
        }
    } catch (error) {
    }
}

async function getCsrfToken() {
    try {
        const response = await fetch("https://localhost:8441/api/auth/csrf/", {
            method: "GET",
            credentials: "include"
        });

        const data = await response.json();
        return data.csrfToken;
    } catch (error) {
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

document.addEventListener("DOMContentLoaded", function () {
    const signUpLink = document.querySelector(".sign-up");
    const loginButton = document.getElementById("loginButton");
    const  otpCode = document.getElementById('otpCode');

    if (signUpLink) {
        signUpLink.addEventListener("click", function (event) {
            event.preventDefault();
            if (typeof PageManager !== "undefined" && PageManager.load) {
                PageManager.load("register");
            }
        });
    }

    if (loginButton) {
        loginButton.addEventListener("click", function (event) {
            event.preventDefault();
            if (typeof PageManager !== "undefined" && PageManager.load) {
                PageManager.load("login");
            }
        });
    }
});
