document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:3000/api/blogs")
    .then(res => res.json())
    .then(posts => {
      const blogList = document.getElementById("blog-list");

      if (!posts.length) {
        blogList.innerHTML = `<p class="text-center text-muted">No blog posts yet.</p>`;
        return;
      }

      // Newest first
      posts.sort((a, b) => new Date(b.date) - new Date(a.date));


      posts.forEach(post => {
        const card = document.createElement("div");
        card.className = "col-12";

        card.innerHTML = `
          <div class="card bg-dark text-light shadow border-light">
            <div class="card-body">
              <h3 class="card-title">${post.title}</h3>
              <h6 class="card-subtitle mb-2 text-muted">${new Date(post.date).toLocaleDateString()}</h6>
              <p class="card-text">${post.content}</p>
            </div>
          </div>
        `;

        blogList.appendChild(card);
      });
    })
    .catch(err => {
      console.error("Error loading blog posts:", err);
    });
});

