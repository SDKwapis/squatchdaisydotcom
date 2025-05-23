document.addEventListener("DOMContentLoaded", () => {
  // Blog form submission
  document.getElementById("blogForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const post = {
      title: document.getElementById("blogTitle").value,
      date: document.getElementById("blogDate").value,
      content: document.getElementById("blogContent").value
    };

    const res = await fetch("http://localhost:3000/api/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post)
    });

    if (res.ok) {
      alert("✅ Blog post submitted!");
      e.target.reset();
    } else {
      alert("❌ Error submitting blog post.");
    }
  });

  // Comic form submission
  document.getElementById("comicForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    const res = await fetch("http://localhost:3000/api/comics", {
      method: "POST",
      body: formData
    });

    if (res.ok) {
      alert("✅ Comic page uploaded!");
      form.reset();
      loadComicList();
    } else {
      alert("❌ Error uploading comic page.");
    }
  });

  async function loadComicList() {
    const res = await fetch("http://localhost:3000/api/comics");
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

      list.appendChild(item);
    });

    // Add event listeners to all delete buttons
    document.querySelectorAll("button[data-id]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-id");
        const confirmDelete = confirm("Delete this comic page?");
        if (!confirmDelete) return;

        const res = await fetch(`http://localhost:3000/api/comics/${id}`, {
          method: "DELETE"
        });

        if (res.ok) {
          alert("🗑️ Deleted!");
          loadComicList();
        } else {
          alert("❌ Failed to delete.");
        }
      });
    });
  }

  // Load comic list on page load
  loadComicList();
});
