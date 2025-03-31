document.addEventListener("DOMContentLoaded", async () => {
    const modal = document.getElementById("tagFilterModal");
    const openButton = document.getElementById("tagfilter-button");
    const closeButton = document.querySelector(".modalclose");
    const applyFilterButton = document.getElementById("applyFilter");
    const tagOptions = document.getElementById("tagOptions");
    let selectedTags = new Set();

    openButton.addEventListener("click", () => {
        modal.style.display = "block";
    });

    closeButton.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });


    try {
        const response = await fetch("/savetags"); 
        const tags = await response.json();

        console.log("Fetched tags:", tags);

        tags.forEach(tag => {
            console.log("Appending tag:", tag);
            const label = document.createElement("label");
            label.innerHTML = `<input type="checkbox" value="${tag.name}"> ${tag.name}`;
            tagOptions.appendChild(label);
        });
    } catch (err) {
        console.error("Error fetching tags:", err);
    }

    // selected tags filter
    applyFilterButton.addEventListener("click", () => {
        selectedTags.clear();
        document.querySelectorAll("#tagOptions input:checked").forEach(checkbox => {
            selectedTags.add(checkbox.value);
        });

        filterPosts(); 
        modal.style.display = "none"; 
    });

    // filter posts
    function filterPosts() {
        const posts = document.querySelectorAll(".post");
        posts.forEach(post => {
            const postTags = Array.from(post.querySelectorAll(".tags li")).map(tag => tag.innerText);
            const hasMatchingTag = postTags.some(tag => selectedTags.has(tag));
            const separator = post.nextElementSibling; 

            if (selectedTags.size === 0 || hasMatchingTag) {
                post.style.display = "block"; 
                if (separator && separator.classList.contains("post-separator")) {
                    separator.style.display = "block"; 
                }
            } else {
                post.style.display = "none"; 
                if (separator && separator.classList.contains("post-separator")) {
                    separator.style.display = "none"; 
                }
            }
        });
    }
});

// logout
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("logoutModal");
    const logoutButton = document.getElementById("logout");
    const closeButton = modal.querySelector(".close");
    const confirmLogoutButton = document.getElementById("confirmLogout");
    const cancelLogoutButton = document.getElementById("cancelLogout");

    logoutButton.addEventListener("click", (event) => {
        event.preventDefault(); 
        modal.style.display = "block";
    });

    closeButton.addEventListener("click", () => {
        modal.style.display = "none";
    });

    cancelLogoutButton.addEventListener("click", () => {
        modal.style.display = "none";
    });

    confirmLogoutButton.addEventListener("click", () => {
        window.location.href = "/logout";
    });

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});