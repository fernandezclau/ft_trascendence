
document.addEventListener("DOMContentLoaded", function () {
    loadPage("game");
});


window.onload = function() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
        localStorage.setItem("jwt", token);
        window.location.href = "/pages/index.html";
    }
};
