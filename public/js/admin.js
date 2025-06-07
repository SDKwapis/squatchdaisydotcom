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

  async function loadComicList() {
    const res = await fetch("/api/comics", {
      credentials: "include"
    });
    const comics = await res.json();
    // …rest unchanged…
  }

  async function loadBlogList() {
    const res = await fetch("/api/blogs", {
      credentials: "include"
    });
    const blogs = await res.json();
    // …rest unchanged…
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
