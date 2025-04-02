// edit post
document.querySelectorAll('.editPost').forEach(button => {
    button.addEventListener('click', async function() {
        const postId = this.getAttribute('post-id');
        const postTitle = document.querySelector('.post-title').innerText;
        const postContentElement = document.querySelector('.post-content');
        let currentContent = '';

        if (postContentElement.querySelector('p')) { //text
            currentContent = postContentElement.querySelector('p').innerText;
        } 
        else if (postContentElement.querySelector('img')) { //img
            currentContent = postContentElement.querySelector('img').src;
        } 
        else if (postContentElement.querySelector('iframe')) { //video
            currentContent = postContentElement.querySelector('iframe').src;
        } 
        else if (postContentElement.querySelector('a')) { //link
            currentContent = postContentElement.querySelector('a').href;
        }

        const newTitle = prompt("Edit your post title:", postTitle);
        if (newTitle === null) return;
        
        const newContent = prompt("Edit your post content:", currentContent);
        if (newContent !== null && newContent.trim() !== "") {
            try 
            {
                const response = await fetch('/editpost', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ 
                        postId: Number(postId),
                        newTitle,
                        newContent 
                    })
                });

                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) 
                {
                    const text = await response.text();
                    throw new Error(text || 'Failed to edit post');
                }

                const result = await response.json();
                
                if (!response.ok) 
                    {
                    throw new Error(result.message || 'Failed to edit post');
                }
                
                document.querySelector('.post-title').innerText = newTitle;
                
                if (postContentElement.querySelector('p')) {
                    postContentElement.querySelector('p').innerText = newContent;
                } 
                else if (postContentElement.querySelector('img')) {
                    postContentElement.querySelector('img').src = newContent;
                } 
                else if (postContentElement.querySelector('iframe')) {
                    postContentElement.querySelector('iframe').src = newContent;
                } 
                else if (postContentElement.querySelector('a')) {
                    const link = postContentElement.querySelector('a');
                    link.href = newContent;
                    link.innerText = newContent;
                }
            } 
            
            catch(error) {
                console.error(error);
                alert(error.message);
            }
        }
    });
});

// delete post
document.querySelectorAll('.deletePost').forEach(button => {
    button.addEventListener('click', async function() {
        const postId = this.getAttribute('post-id');
        
        const isConfirmed = confirm("Are you sure you want to delete this post? This action cannot be undone.");
        if (isConfirmed) {
            try {
                const response = await fetch('/deletepost', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ 
                        postId: Number(postId)
                    })
                });

                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    const text = await response.text();
                    throw new Error(text || 'Failed to delete post');
                }

                const result = await response.json();
                
                if (!response.ok) {
                    throw new Error('Failed to delete post');
                }

                window.location.href = '/home';
            } 
            
            catch (error) {
                console.error(error);
                alert(error.message);
            }
        }
    });
});