document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.getElementById("toggle");
    const passwordField = document.getElementById("password");
    const confirmPassword = document.getElementById("confirm");
    const passwordError = document.getElementById("repeat");
    const registerBtn = document.getElementById("signin");
    const registerForm = document.getElementById("registerForm");

    if (!toggleButton || !passwordField || !confirmPassword || !passwordError || !registerBtn) {
        console.error("One or more elements not found!");
        return;
    }

    // password t
    toggleButton.addEventListener("click", function () {
        if (passwordField.type === "password") {
            passwordField.type = "text";
            toggleButton.textContent = "Hide Password";
        } else {
            passwordField.type = "password";
            toggleButton.textContent = "Show Password";
        }
    });

    // checks if passwords match
    function validatePasswords() {
        if (passwordField.value.trim() !== confirmPassword.value.trim()) {
            passwordError.style.display = "block";
            registerBtn.disabled = true;
        } else {
            passwordError.style.display = "none";
            registerBtn.disabled = false;
        }
    }

    passwordField.addEventListener("input", validatePasswords);
    confirmPassword.addEventListener("input", validatePasswords);

    if (registerForm) {
        registerForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const formData = new FormData(registerForm);
            const data = Object.fromEntries(formData.entries());

            const response = await fetch("/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (result.error) {
                alert(result.error);
            } else {
                alert(result.success);
                window.location.href = "/";
            }
        });
    }
});