let currentPage = 0;
let comicPages = [];

const imageElement = document.getElementById("comic-image");
const pageNumberText = document.getElementById("page-number");
const prevButton = document.getElementById("prev-btn");
const nextButton = document.getElementById("next-btn");
const firstButton = document.getElementById("first-btn");
const lastButton = document.getElementById("last-btn");

async function fetchComicPages() {
  const res = await fetch("http://localhost:3000/api/comics");
  const pages = await res.json();

  // Optional: sort by book, chapter, pageNumber
  comicPages = pages.sort((a, b) => {
    return (
      a.book - b.book ||
      a.chapter - b.chapter ||
      a.pageNumber - b.pageNumber
    );
  });

  renderPage();
}

function renderPage() {
  if (!comicPages.length) {
    imageElement.src = page.imageUrl;

    pageNumberText.textContent = "No pages available.";
    return;
  }

  const page = comicPages[currentPage];
  imageElement.src = page.imageUrl;
  pageNumberText.textContent = `Page ${page.pageNumber} (Book ${page.book}, Chapter ${page.chapter})`;

  prevButton.disabled = currentPage === 0;
  nextButton.disabled = currentPage === comicPages.length - 1;
  firstButton.disabled = currentPage === 0;
  lastButton.disabled = currentPage === comicPages.length - 1;
}

prevButton.addEventListener("click", () => {
  if (currentPage > 0) currentPage--;
  renderPage();
});

nextButton.addEventListener("click", () => {
  if (currentPage < comicPages.length - 1) currentPage++;
  renderPage();
});

firstButton.addEventListener("click", () => {
  currentPage = 0;
  renderPage();
});

lastButton.addEventListener("click", () => {
  currentPage = comicPages.length - 1;
  renderPage();
});

// Start it off
fetchComicPages();

