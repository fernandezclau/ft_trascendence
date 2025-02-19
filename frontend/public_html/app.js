
/* MAIN FUNCTION */
function loadPage(page) {
    if (page === "home") {
        document.getElementById('content-container').innerHTML = "";
        document.getElementById('game').style.display = 'block';
        document.getElementById('game').style.visibility = 'visible';

        const playerSelection = document.getElementById('playerSelection');
        playerSelection.style.display = 'flex';
        playerSelection.style.visibility = 'visible';

        playerSelection.offsetHeight; // Esta línea fuerza el reflujo en el navegador
        playerSelection.style.justifyContent = 'center'; // Asegura que todo esté centrado correctamente

    } else {
        fetch(`pages/${page}.html`)
            .then(response => response.text())
            .then(html => {
                document.getElementById('content-container').innerHTML = html;
                document.getElementById('game').style.display = 'none';
                document.getElementById('game').style.visibility = 'hidden';

                const playerSelection = document.getElementById('playerSelection');
                playerSelection.style.display = 'none';
                playerSelection.style.visibility = 'hidden';
            })
            .catch(error => console.error('Error loading page:', error));
    }
}
