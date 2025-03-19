document.getElementById('createpost').addEventListener('click', function() {
    window.location.href = '/createpost';
});

document.getElementById('profile-button').addEventListener('click', function() {
    window.location.href = '/profile';
});

document.addEventListener("DOMContentLoaded", function () { // Changes the size of the box, and character counter.
    const titleInput = document.getElementById("title");
    const charCounter = document.getElementById("char-counter");

    const maxChars = 400;
    const minHeight = 45; 
    const padding = 24; 
    const lineHeight = 20; 
    const resetThreshold = 50; 

    titleInput.style.height = `${minHeight}px`;
    titleInput.style.overflowY = "hidden"; 

    titleInput.addEventListener("input", function () {
        if (this.value.length > maxChars) {
            this.value = this.value.substring(0, maxChars);
        }

        charCounter.textContent = `${this.value.length}/${maxChars}`;

        this.style.height = "auto";

        const lines = Math.floor((this.scrollHeight - padding) / lineHeight);

        if (this.value.length < resetThreshold) {
            this.style.height = `${minHeight}px`;
        } else {
            this.style.height = `${this.scrollHeight}px`;
        }
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll(".tab");
    const contentBox = document.getElementById("content-box");

    tabs.forEach((tab) => {
        tab.addEventListener("click", function () {
            // remove active class from all
            tabs.forEach(t => t.classList.remove("active"));

            // apply active to the one clicked
            this.classList.add("active");

            // change content
            const selectedType = this.dataset.type;
            updateContent(selectedType);
        });
    });

    function updateContent(type) {
        if (type === "text") {
            contentBox.innerHTML = `<textarea placeholder="Write something..." rows="5"></textarea>`;
        } else if (type === "image") {
            contentBox.innerHTML = `<input type="file" accept="image/*">`;
        } else if (type === "video") {
            contentBox.innerHTML = `<input type="text" placeholder="Paste a video or link here...">`;
        }
    }
});