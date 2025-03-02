
document.addEventListener("DOMContentLoaded", function () {
    loadPage("login");
});


window.onload = function () {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const page = params.get("page");

    if (token) {
        localStorage.setItem("jwt", token);
        window.history.replaceState({}, document.title, "/");

        if (page) {
            loadPage(page);
        } else {
            loadPage("game");
        }
    }
};

