//edit comment
document.querySelectorAll('.editComment').forEach(button => {
    button.addEventListener('click', async function() {
        const commentId = this.getAttribute('comment-id');
        const commentText = document.getElementById('comment-text-' + commentId).innerText;

        const newText = prompt("Edit your comment:", commentText);
        if (newText !== null && newText.trim() !== "") {
            try {
                const response = await fetch('/editcomment', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ 
                        commentId: Number(commentId),
                        newText 
                    })
                });

                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    const text = await response.text();
                }

                const result = await response.json();
                
                if (!response.ok) {
                    throw new Error('Failed to edit comment');
                }
                
                document.getElementById('comment-text-' + commentId).innerText = newText;
            } 
            
            catch(error) {
                console.error(error);
                alert(error.message);
            }
        }
    });
});

//delete comment
document.querySelectorAll('.deleteComment').forEach(button => {
    button.addEventListener('click', async function() {
        const commentId = this.getAttribute('comment-id');
        
        const isConfirmed = confirm("Are you sure you want to delete this comment?");
        if (isConfirmed) {
            try {
                const response = await fetch('/deletecomment', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ 
                        commentId: Number(commentId)
                    })
                });

                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    const text = await response.text();
                }

                const result = await response.json();
                
                if (!response.ok) {
                    throw new Error('Failed to delete comment');
                }

                const commentElement = document.getElementById('comment-' + commentId);
                if (commentElement) {
                    commentElement.remove();
                }
            } 
            
            catch (error) {
                console.error(error);
                alert(error.message);
            }
        }
    });
});