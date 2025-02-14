
document.addEventListener('DOMContentLoaded', () => {
    // Inicializamos el router
    initializeRouter();
    console.log("Inicializado...")
});

// Función para inicializar el router
function initializeRouter() {
    // Escucha los cambios de URL sin recargar la página
    window.addEventListener('popstate', handleRouteChange);

    // Controla la ruta actual al cargar la página
    handleRouteChange();
}

// Función para manejar el cambio de ruta
function handleRouteChange() {
    const path = window.location.hash || "#/home";  // Usa el hash (#) para determinar la ruta

    // Mostrar contenido basado en la ruta actual
    switch (path) {
        case '#/home':
            loadHomePage();
            break;
        case '#/tournament':
            loadTournamentPage();
            break;
        case '#/dashboard':
            loadDashboardPage();
            break;
        case '#/info':
            loadInfoPage();
            break;
        case '#/login':
            loadLoginPage();
            break;
        case '#/settings':
            loadSettingsPage();
            break;
        default:
            loadHomePage(); // Ruta predeterminada
            break;
    }
}

// Función para cargar el contenido de la página de inicio
function loadHomePage() {
    fetch('pages/home.html')
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al cargar el archivo HTML');
        }
        return response.text();
    })
    .then(data => {
        document.getElementById('content-container').innerHTML = data;
    })
    .catch(error => {
        console.error('Hubo un problema con la carga del contenido:', error);
    });
}

// Función para cargar el contenido de la página de crear torneo
function loadTournamentPage() {
    fetch('pages/tournament.html')
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al cargar el archivo HTML');
        }
        return response.text();
    })
    .then(data => {
        document.getElementById('content-container').innerHTML = data;
    })
    .catch(error => {
        console.error('Hubo un problema con la carga del contenido:', error);
    });
}

// Función para cargar el contenido del dashboard
function loadDashboardPage() {
    document.getElementById('content-container').innerHTML = `
        <h1>Dashboard</h1>
        <p>Revisa tus estadísticas y detalles del torneo.</p>
    `;
}

// Función para cargar la página de "How to play?"
function loadInfoPage() {
    document.getElementById('content-container').innerHTML = `
        <h1>How to Play?</h1>
        <p>Instrucciones para jugar Pong.</p>
    `;
}

// Función para cargar la página de inicio de sesión
function loadLoginPage() {
    document.getElementById('content-container').innerHTML = `
        <h1>Inicio de Sesión</h1>
        <p>Por favor, ingresa para continuar.</p>
    `;
}

// Función para cargar la página de configuración
function loadSettingsPage() {
    document.getElementById('content-container').innerHTML = `
        <h1>Configuración</h1>
        <p>Aquí puedes cambiar la configuración de tu cuenta.</p>
    `;
}
