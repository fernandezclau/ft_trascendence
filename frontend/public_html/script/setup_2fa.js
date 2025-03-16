let secretKey = '';
let qrUrl = '';
let qrCodeInstance = null;

function initSetup2FA() {
	tempToken = localStorage.getItem("temp_token");
    if (!tempToken) {
        setTimeout(() => PageManager.load('register'), 2000);
        return;
    }
    
    const generateBtn = document.getElementById('generateKeyBtn');
    if (generateBtn) {
        generateBtn.addEventListener('click', generateTOTPKey);
    }
    
    const copyBtn = document.getElementById('copyBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            copyToClipboard('secretKey');
        });
    }
    
    const verifyBtn = document.getElementById('verifyBtn');
    if (verifyBtn) {
        verifyBtn.addEventListener('click', verifyOTP);
    }

}

function generateTOTPKey() {
    const generateBtn = document.getElementById('generateKeyBtn');
    generateBtn.disabled = true;
    generateBtn.textContent = 'Generando...';
    
    try {
        generateLocalKey();
    } catch (error) {

        generateBtn.disabled = false;
        generateBtn.textContent = 'Intentar de nuevo';
    }
}

function generateLocalKey() {
    secretKey = generateRandomBase32Key(16);

    const username = localStorage.getItem('username_backend2') || 'usuario';
    const issuer = encodeURIComponent('PongApp');
    const encodedKey = encodeURIComponent(secretKey);
    const encodedUsername = encodeURIComponent(username);
    
    qrUrl = `otpauth://totp/${issuer}:${encodedUsername}?secret=${encodedKey}&issuer=${issuer}&algorithm=SHA1&digits=6&period=30`;

    displayKeyAndQR(secretKey, qrUrl);
}

function generateRandomBase32Key(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let result = '';

    if (window.crypto && window.crypto.getRandomValues) {
        const randomValues = new Uint8Array(length);
        window.crypto.getRandomValues(randomValues);
        for (let i = 0; i < length; i++) {
            result += chars.charAt(randomValues[i] % chars.length);
        }
    } else {
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
    }
    
    return result;
}

function displayKeyAndQR(key, url) {
    const secretKeyElement = document.getElementById('secretKey');
    if (secretKeyElement) {
        secretKeyElement.textContent = key;
    }
    
    const keyDetails = document.getElementById('keyDetails');
    if (keyDetails) {
        keyDetails.style.display = 'block';
    }

    try {
        if (typeof QRCode !== 'undefined') {
            const qrContainer = document.getElementById('qrcode');
            if (qrContainer) {
                qrContainer.innerHTML = '';

                new QRCode(qrContainer, {
                    text: url,
                    width: 200,
                    height: 200,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.H
                });

                const qrCodeContainer = document.getElementById('qrCodeContainer');
                if (qrCodeContainer) {
                    qrCodeContainer.style.display = 'block';
                }
            }
        }
    } catch (e) {
    }

    const step2 = document.getElementById('step2');
    if (step2) {
        step2.style.display = 'block';
    }
    
    const step3 = document.getElementById('step3');
    if (step3) {
        step3.style.display = 'block';
    }

    const generateBtn = document.getElementById('generateKeyBtn');
    if (generateBtn) {
        generateBtn.textContent = 'Clave generada';
        generateBtn.classList.replace('btn-primary', 'btn-success');
    }
    

}

async function verifyOTP() {
    const otpCode = document.getElementById('otpCode').value.trim();
    
    if (!otpCode || otpCode.length !== 6 || !/^\d+$/.test(otpCode)) {
        return;
    }
    
    if (!tempToken) {
        setTimeout(() => PageManager.load('register'), 2000);
        return;
    }
    
    if (!secretKey) {
        return;
    }
    
    try {
        
        const csrfToken = await getCsrfToken();
        const cleanSecretKey = secretKey.replace(/=+$/, '');
        
        const requestData = {
            temp_token: tempToken,
            otp_code: otpCode,
            secret_key: cleanSecretKey
        };
        
        const response = await fetch("https://localhost:8441/api/auth/verify-2fa-setup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken
            },
            credentials: "include",
            body: JSON.stringify(requestData)
        });
    } catch (error) {
    }
}

function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.textContent;
    
    navigator.clipboard.writeText(text)
        .then(() => {
            const button = document.getElementById('copyBtn');
            const originalText = button.textContent;
            button.textContent = '¡Copiado!';
            setTimeout(() => { button.textContent = originalText; }, 2000);
        })
        .catch(err => {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            const button = document.getElementById('copyBtn');
            button.textContent = '¡Copiado!';
            setTimeout(() => { button.textContent = 'Copiar clave'; }, 2000);
        });
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
                return cookie.substring('csrftoken='.length, cookie.length);
            }
        }
        return "";
    }
}
