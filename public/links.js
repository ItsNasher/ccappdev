document.getElementById('createpost').addEventListener('click', function() {
    window.location.href = '/createpost';
});

document.getElementById('profile-button').addEventListener('click', function() {
    window.location.href = '/profile';
});

// changes box size and counter
document.addEventListener("DOMContentLoaded", function () {
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
            tabs.forEach(t => t.classList.remove("active"));

            this.classList.add("active");

            const selectedType = this.dataset.type;
            updateContent(selectedType);
        });
    });
});

    // changes content box based on what tab you are on
    function updateContent(type) {
        const contentBox = document.getElementById("content-box");

        contentBox.innerHTML = "";
    
        if (type === "text") {
            contentBox.innerHTML = `<textarea id="post-text" placeholder="Write something..." rows="3"></textarea>`;
            
            const textarea = document.getElementById("post-text");
            const minHeight = 135;
            const padding = 24;
            const lineHeight = 20;
    
            textarea.style.height = `${minHeight}px`;
            textarea.style.overflowY = "hidden";
    
            textarea.addEventListener("input", function () {
                this.style.height = "auto";
                const newHeight = this.scrollHeight - padding;
                this.style.height = `${Math.max(newHeight, minHeight)}px`;
            });
        } else if (type === "image") {
            contentBox.innerHTML = `
                <div style="display: flex; align-items: flex-start; gap: 15px; margin-top: 48px; margin-left: 1.5rem; width: 85%">
                        <div id="imageContainer" style="width: 300px; height: 300px; border: 2px dashed #ccc; display: flex; justify-content: center; align-items: center; overflow: hidden;">
                            <img id="uploadedImage" src="" alt="Uploaded Image" style="max-width: 100%; max-height: 100%; display: none;">
                        </div>
                        <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 8px; width: 50%; margin-top: 2rem;">
                            <input type="file" name ="file" id="imageUpload" accept="image/*, video/*" style="margin-top: 0rem; margin-left: 0rem; width: 55%">
                            <button id="removeImage" style="display: none;">Remove</button>
                        </div>
                    </div>
                `;

            const imageUpload = document.getElementById("imageUpload");
            const uploadedImage = document.getElementById("uploadedImage");
            const removeImageButton = document.getElementById("removeImage");

            imageUpload.addEventListener("change", function (event) {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        uploadedImage.src = e.target.result;
                        uploadedImage.style.display = "block";
                        removeImageButton.style.display = "block";
                    };
                    reader.readAsDataURL(file);
                }
            });

            removeImageButton.addEventListener("click", function () {
                uploadedImage.src = "";
                uploadedImage.style.display = "none";
                removeImageButton.style.display = "none";
                imageUpload.value = "";
            });
        } else if (type === "video") {
            contentBox.innerHTML = `
                <div style="width: 75%">
                    <input type="text" name="videoUrl" id="videoUrlInput" placeholder="Paste a video or link here..." style="width: 100%; padding: 8px; margin-bottom: 10px;">
                    <div id="videoPreview" style="width: 100%; max-width: 600px; height: 315px; border: 1px solid #a6a6a6; display: none; margin-left: 1.5rem;"></div>
                </div>
            `;

            const videoUrlInput = document.getElementById("videoUrlInput");
            const videoPreview = document.getElementById("videoPreview");

            videoUrlInput.addEventListener("input", function () {
                const url = this.value.trim();
                if (url) {
                    let embedUrl = "";

                    const youtubeMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([a-zA-Z0-9_-]+)/);
                    if (youtubeMatch) {
                        embedUrl = `https://www.youtube.com/embed/${youtubeMatch[1]}`;
                    } else {
                        embedUrl = url; 
                    }

                    videoPreview.innerHTML = `<iframe src="${embedUrl}" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>`;
                    videoPreview.style.display = "block";
                } else {
                    videoPreview.innerHTML = "";
                    videoPreview.style.display = "none";
                }
            });
        }
        document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
        document.querySelector(`.tab[data-type="${type}"]`).classList.add("active");
    }

// to switch post button to not disabled
document.addEventListener("DOMContentLoaded", function () {
    const titleInput = document.getElementById("title");
    const postButton = document.getElementById("create-post");

    titleInput.addEventListener("input", function () {
        postButton.disabled = titleInput.value.trim() === "";
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("tags-modal");
    const openModalBtn = document.getElementById("add-tags-btn");
    const closeModalBtn = document.querySelector(".close");
    const confirmTagsBtn = document.getElementById("confirm-tags");
    const tagList = document.getElementById("tag-list");
    const newTagInput = document.getElementById("new-tag-input");
    const addNewTagBtn = document.getElementById("add-new-tag");
    const selectedTagsDisplay = document.getElementById("selected-tags");
    const selectedTagsContainer = document.getElementById("selected-tags-container");
    
    let selectedTags = [];
    let availableTags = ["News", "Tech", "Sports", "Gaming"];

    openModalBtn.addEventListener("click", () => {
        modal.style.display = "block";
    });

    closeModalBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    tagList.addEventListener("click", (event) => {
        if (event.target.classList.contains("tag-btn")) {
            const tagText = event.target.getAttribute("data-tag");
            if (selectedTags.includes(tagText)) {
                selectedTags = selectedTags.filter(t => t !== tagText);
                event.target.classList.remove("selected");
            } else {
                selectedTags.push(tagText);
                event.target.classList.add("selected");
            }
        }
    });

    addNewTagBtn.addEventListener("click", () => {
        const newTag = newTagInput.value.trim();
        if (newTag && !availableTags.includes(newTag)) {
            availableTags.push(newTag);
            const newTagBtn = document.createElement("button");
            newTagBtn.classList.add("tag-btn");
            newTagBtn.setAttribute("data-tag", newTag);
            newTagBtn.textContent = newTag;
            tagList.appendChild(newTagBtn);
            newTagInput.value = "";
        } else if (availableTags.includes(newTag)) {
            alert("Tag already exists!");
        }
    });

    confirmTagsBtn.addEventListener("click", () => {
        if (selectedTags.length > 0) {
            selectedTagsContainer.style.display = "block";
            selectedTagsDisplay.innerHTML = selectedTags
                .map(tag => `<span class="selected-tag">${tag}</span>`)
                .join(" ");
    
            document.getElementById("tags").value = selectedTags.join(",");
        } else {
            selectedTagsContainer.style.display = "none";
            document.getElementById("tags").value = ""; 
        }
        modal.style.display = "none";
    });
});

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".tab").forEach(tab => {
        tab.addEventListener("click", () => {
            let type = tab.getAttribute("data-type");
            document.getElementById("content_type").value = type;

            if (type === "image" || type === "video") {
                document.getElementById("file-upload").style.display = "block";
                document.getElementById("content").style.display = "none";
            } else {
                document.getElementById("file-upload").style.display = "none";
                document.getElementById("content").style.display = "block";
            }
        });
    });

    document.getElementById("confirm-tags").addEventListener("click", () => {
        let selectedTags = Array.from(document.querySelectorAll("#selected-tags .tag-btn"))
                                .map(tag => tag.dataset.tag);
        document.getElementById("tags").value = JSON.stringify(selectedTags);
    });
});