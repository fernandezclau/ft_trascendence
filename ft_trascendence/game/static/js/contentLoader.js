document.addEventListener("DOMContentLoaded", function () {
    function loadPage() {
        let route = window.location.hash.substring(2) || "home"; // Quita "#/"
        fetch(`/content/${route}`) // Pide solo el contenido parcial
            .then(response => response.text())
            .then(html => {
                document.getElementById("content-container").innerHTML = html;
            })
            .catch(error => console.error("Error cargando la página:", error));
    }

    window.addEventListener("hashchange", loadPage); // Detecta cambios en el hash
    loadPage(); // Carga inicial
});