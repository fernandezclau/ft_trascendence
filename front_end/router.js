
/* MAIN FUNCTION */
document.addEventListener('DOMContentLoaded', () => {

    window.addEventListener('popstate', handleRouteChange);
    handleRouteChange();

});

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
            loadNotFoundPage();
            break;
    }
}

/* HOME PAGE */
function loadHomePage() {
    loadPage('pages/home.html')
}

/* TOURNAMENT PAGE */
function loadTournamentPage() {
    loadPage('pages/tournament.html')
}

/* DASHBOARD PAGE */
function loadDashboardPage() {
    loadPage('pages/dashboard.html')
}

/* INFO PAGE */
function loadInfoPage() {
    loadPage('pages/info.html')
}

/* LOGIN PAGE */
function loadLoginPage() {
    loadPage('pages/login.html')
}

/* SETTINGS PAGE */
function loadSettingsPage() {
    loadPage('pages/settings.html')
}

function loadNotFoundPage() {
    loadPage('pages/not_found.html')
}

/* GENERIC LOADING FUNCTION */
function loadPage(path) {
    fetch(path)
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