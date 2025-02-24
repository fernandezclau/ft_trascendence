
function selectPalleteColor(value, button) {
    const buttons = document.querySelectorAll('.game-color-options');
    
    buttons.forEach(button => {
        button.classList.remove('selected');
    });

    if (button)
        button.classList.add('selected');

    if (value) {
        canvas.style.backgroundColor = value;
        localStorage.setItem("backgroundColor", value); //Guardar en localStorage
        console.log("Paso")
    }
}