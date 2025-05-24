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
        const article = document.createElement("article");
        article.className = "blog-post";

        article.innerHTML = `
          <div class="blog-meta">
            <span class="blog-stamp">FIELD REPORT</span>
            <span class="blog-date">🕰️ ${new Date(post.date).toLocaleDateString()}</span>
          </div>
          <h2 class="blog-title">${post.title}</h2>
          <p class="blog-body">${post.content}</p>
        `;

        blogList.appendChild(article);
      });
    })
    .catch(err => {
      console.error("Error loading blog posts:", err);
    });
});


