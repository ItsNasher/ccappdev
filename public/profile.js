document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll(".mediatype-tabs .tab");
    const postsSection = document.getElementById("posts-section");
    const commentsSection = document.getElementById("comments-section");

    tabs.forEach(tab => {
        tab.addEventListener("click", function () {
            tabs.forEach(t => t.classList.remove("active"));
            postsSection.classList.remove("active");
            commentsSection.classList.remove("active");

            this.classList.add("active");
            if (this.dataset.tab === "posts") {
                postsSection.classList.add("active");
            } else if (this.dataset.tab === "comments") {
                commentsSection.classList.add("active");
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("editProfileModal");
    const editButton = document.getElementById("editProfileButton");
    const closeButton = document.querySelector(".close");

    if (editButton) {
        editButton.addEventListener("click", () => {
            modal.style.display = "block";
        });
    }

    if (closeButton) {
        closeButton.addEventListener("click", () => {
            modal.style.display = "none";
        });
    }

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    const editProfileForm = document.getElementById("editProfileForm");
    if (editProfileForm) {
        editProfileForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const username = document.getElementById("username").value;
            const bio = document.getElementById("bio").value;

            try {
                const response = await fetch("/updateProfile", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username, bio }),
                });

                const result = await response.json();

                if (result.success) {
                    alert("Profile updated successfully!");
                    location.reload();
                } else {
                    alert("Failed to update profile: " + result.error);
                }
            } catch (error) {
                console.error("Error updating profile:", error);
                alert("An error occurred. Please try again.");
            }
        });
    }
});