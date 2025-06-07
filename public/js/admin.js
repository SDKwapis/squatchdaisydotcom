document.addEventListener("DOMContentLoaded", () => {
  // Blog form submission
  document.getElementById("blogForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const post = {
      title: document.getElementById("blogTitle").value,
      date: document.getElementById("blogDate").value,
      content: document.getElementById("blogContent").value
    };

    const res = await fetch("/api/blogs", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post)
    });

    if (res.ok) {
      alert("✅ Blog post submitted!");
      e.target.reset();
      loadBlogList();
    } else {
      alert("❌ Error submitting blog post.");
    }
  });

  // Comic form submission
  document.getElementById("comicForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const res = await fetch("/api/comics", {
      method: "POST",
      credentials: "include",
      body: formData
    });

    if (res.ok) {
      alert("✅ Comic page uploaded!");
      e.target.reset();
      loadComicList();
    } else {
      alert("❌ Error uploading comic page.");
    }
  });

  // Load and render all comic pages
  async function loadComicList() {
    const res = await fetch("/api/comics", {
      credentials: "include"
    });
    const comics = await res.json();

    const list = document.getElementById("comicList");
    list.innerHTML = "";

    comics.forEach((comic) => {
      const item = document.createElement("li");
      item.className = "list-group-item d-flex justify-content-between align-items-center";

      item.innerHTML = `
        <div>
          <strong>Book ${comic.book}, Chapter ${comic.chapter}, Page ${comic.pageNumber}</strong><br>
          <img src="${comic.imageUrl}" alt="Comic" style="height: 60px; margin-top: 5px;">
        </div>
        <button class="btn btn-sm btn-danger" data-id="${comic.id}">Delete</button>
      `;

      // Delete handler
      item.querySelector("button").addEventListener("click", async () => {
        if (!confirm("Delete this comic page?")) return;
        const del = await fetch(`/api/comics/${comic.id}`, {
          method: "DELETE",
          credentials: "include"
        });
        if (del.ok) {
          alert("🗑️ Deleted!");
          loadComicList();
        } else {
          alert("❌ Failed to delete.");
        }
      });

      list.appendChild(item);
    });
  }

  // Load and render all blog posts
  async function loadBlogList() {
    const res = await fetch("/api/blogs", {
      credentials: "include"
    });
    const blogs = await res.json();

    const blogList = document.getElementById("blogList");
    blogList.innerHTML = "";

    // Newest first
    blogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    blogs.forEach((blog) => {
      const item = document.createElement("li");
      item.className = "list-group-item d-flex justify-content-between align-items-center";

      item.innerHTML = `
        <div>
          <strong>${blog.title}</strong><br>
          <small class="text-muted">${new Date(blog.date).toLocaleDateString()}</small>
        </div>
        <button class="btn btn-sm btn-danger" data-id="${blog.id}">Delete</button>
      `;

      // Delete handler
      item.querySelector("button").addEventListener("click", async () => {
        if (!confirm("Delete this blog post?")) return;
        const del = await fetch(`/api/blogs/${blog.id}`, {
          method: "DELETE",
          credentials: "include"
        });
        if (del.ok) {
          alert("🗑️ Blog post deleted!");
          loadBlogList();
        } else {
          alert("❌ Failed to delete blog post.");
        }
      });

      blogList.appendChild(item);
    });
  }

  // Logout button
  document.getElementById("logoutBtn").addEventListener("click", async () => {
    const res = await fetch("/api/logout", {
      method: "POST",
      credentials: "include"
    });

    if (res.ok) {
      window.location.href = "/login.html";
    } else {
      alert("❌ Failed to log out.");
    }
  });

  // Initial loads
  loadComicList();
  loadBlogList();
});

