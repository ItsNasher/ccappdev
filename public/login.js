document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector(".credentials");

    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const formData = new FormData(loginForm);
            const data = Object.fromEntries(formData.entries());

            const response = await fetch("/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (result.error) {
                alert(result.error);
            } else {
                alert(result.success);
                window.location.href = "/home";
            }
        });
    }
});