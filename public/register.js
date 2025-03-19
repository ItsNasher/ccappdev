document.addEventListener("DOMContentLoaded", function () {
    console.log("Script loaded!"); // Debugging
    const toggleButton = document.getElementById("toggle");
    const passwordField = document.getElementById("password");

    if (!toggleButton || !passwordField) {
        console.error("Toggle button or password field not found!");
        return;
    }

    toggleButton.addEventListener("click", function () {
        console.log("Toggle button clicked"); // Debugging
        console.log("Current type:", passwordField.type); // Debugging

        if (passwordField.type === "password") {
            passwordField.type = "text";
            toggleButton.textContent = "Hide Password";
        } else {
            passwordField.type = "password";
            toggleButton.textContent = "Show Password";
        }
    });
});