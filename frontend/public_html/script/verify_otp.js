let tempToken = localStorage.getItem('temp_token') || '';

function initVerifyOtp() {

    
    tempToken = localStorage.getItem('temp_token');
    if (tempToken) {
        document.getElementById('tempToken').value = tempToken;
    } else {;
    }
    
    verifyOtp();
}

async function verifyOtp() {
    const otpCode = document.getElementById('otpCode').value.trim();
    const messageElement = document.getElementById('otp-message');

    if (!otpCode || otpCode.length !== 6 || !/^\d+$/.test(otpCode)) {
        alert("El código de verificación debe tener 6 dígitos numéricos");
        return;
    }

    if (!tempToken) {
        PageManager.load('login');
        return;
    }
    
    
    try {
        const csrfToken = await getCsrfToken();
        
        const requestData = { 
            temp_token: tempToken,
            otp_code: otpCode
        };

        const response = await fetch("https://localhost:8441/api/auth/verify-otp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken
            },
            credentials: "include",
            body: JSON.stringify(requestData)
        });
        
        const responseText = await response.text();
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            return;
        }

        if (response.ok) {
            localStorage.setItem("jwt_backend2", data.token);
            localStorage.setItem("username_backend2", data.username);
            localStorage.setItem("image_url_backend2", data.image_url || "https://i.imgur.com/DP2aShH.png");

            localStorage.removeItem("temp_token");
            PageManager.load("game", updateNavbar);
        } else {
            alert("Error en la verificación: " + data.error);
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

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        return data.csrfToken;
    } catch (error) {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith('csrftoken=')) {
                const token = cookie.substring('csrftoken='.length, cookie.length);
                return token;
            }
        }
        return "";
    }
}
