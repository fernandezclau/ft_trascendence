document.addEventListener("DOMContentLoaded", function () {
    const themeToggle = document.getElementById("theme-toggle");

    // Cargar modo guardado
    if (localStorage.getItem("theme") === "light") {
        document.body.classList.add("light-mode");
    }

    // Alternar modo claro/oscuro
    themeToggle.addEventListener("click", function () {
        document.body.classList.toggle("light-mode");

        // Guardar en localStorage
        if (document.body.classList.contains("light-mode")) {
            localStorage.setItem("theme", "light");
        } else {
            localStorage.setItem("theme", "dark");
        }
    });
});
