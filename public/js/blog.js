const blogContainer = document.getElementById("blog-posts");

function renderBlogList() {
  blogPosts.forEach(post => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("blog-post");

    const title = document.createElement("h2");
    title.textContent = post.title;

    const date = document.createElement("p");
    date.classList.add("blog-date");
    date.textContent = post.date;

    const preview = document.createElement("p");
    preview.textContent = post.content.slice(0, 100) + "...";

    const readMore = document.createElement("button");
    readMore.textContent = "Read More";
    readMore.onclick = () => showFullPost(post);

    wrapper.appendChild(title);
    wrapper.appendChild(date);
    wrapper.appendChild(preview);
    wrapper.appendChild(readMore);

    blogContainer.appendChild(wrapper);
  });
}

function showFullPost(post) {
  blogContainer.innerHTML = "";

  const title = document.createElement("h2");
  title.textContent = post.title;

  const date = document.createElement("p");
  date.classList.add("blog-date");
  date.textContent = post.date;

  const content = document.createElement("p");
  content.textContent = post.content;

  const backBtn = document.createElement("button");
  backBtn.textContent = "⬅ Back to Posts";
  backBtn.onclick = () => {
    blogContainer.innerHTML = "";
    renderBlogList();
  };

  blogContainer.appendChild(title);
  blogContainer.appendChild(date);
  blogContainer.appendChild(content);
  blogContainer.appendChild(backBtn);
}

renderBlogList();
