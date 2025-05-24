let currentPage = 0;
let comicPages = [];

const imageElement = document.getElementById("comic-image");
const pageNumberText = document.getElementById("page-number");
const prevButton = document.getElementById("prev-btn");
const nextButton = document.getElementById("next-btn");
const firstButton = document.getElementById("first-btn");
const lastButton = document.getElementById("last-btn");
const bookSelect = document.getElementById("bookSelect");
const chapterSelect = document.getElementById("chapterSelect");


async function fetchComicPages() {
  try {
    const res = await fetch("http://localhost:3000/api/comics");
    const pages = await res.json();

    comicPages = pages.sort((a, b) => {
      return (
        a.book - b.book ||
        a.chapter - b.chapter ||
        a.pageNumber - b.pageNumber
      );
    });

    buildBookChapterMenus(); // ✅ moved here after comicPages is populated
    renderPage();
  } catch (error) {
    console.error("Failed to load comics:", error);
  }
}


function renderPage() {
  if (!comicPages.length) {
    imageElement.src = "";
    pageNumberText.textContent = "No pages available.";
    return;
  }

  const page = comicPages[currentPage];
  imageElement.src = page.imageUrl;
  pageNumberText.textContent = `Page ${currentPage + 1} of ${comicPages.length}`;

  prevButton.disabled = currentPage === 0;
  nextButton.disabled = currentPage === comicPages.length - 1;
  firstButton.disabled = currentPage === 0;
  lastButton.disabled = currentPage === comicPages.length - 1;

  // Preload next and previous images
  preloadImage(comicPages[currentPage + 1]);
  preloadImage(comicPages[currentPage - 1]);
}

function preloadImage(page) {
  if (page && page.imageUrl) {
    const img = new Image();
    img.src = page.imageUrl;
  }
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

function buildBookChapterMenus() {
  const books = [...new Set(comicPages.map(p => p.book))].sort((a, b) => a - b);

  bookSelect.innerHTML = `<option value="">Select Book</option>`;
  chapterSelect.innerHTML = `<option value="">Select Chapter</option>`;

  books.forEach(book => {
    const opt = document.createElement("option");
    opt.value = book;
    opt.textContent = `Book ${book}`;
    bookSelect.appendChild(opt);
  });
}

bookSelect.addEventListener("change", () => {
  const selectedBook = parseInt(bookSelect.value);
  const chapters = [...new Set(
    comicPages.filter(p => p.book === selectedBook).map(p => p.chapter)
  )].sort((a, b) => a - b);

  chapterSelect.innerHTML = `<option value="">Select Chapter</option>`;
  chapters.forEach(chap => {
    const opt = document.createElement("option");
    opt.value = chap;
    opt.textContent = `Chapter ${chap}`;
    chapterSelect.appendChild(opt);
  });
});

chapterSelect.addEventListener("change", () => {
  const book = parseInt(bookSelect.value);
  const chapter = parseInt(chapterSelect.value);

  const targetIndex = comicPages.findIndex(p => p.book === book && p.chapter === chapter);
  if (targetIndex !== -1) {
    currentPage = targetIndex;
    renderPage();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    if (currentPage > 0) {
      currentPage--;
      renderPage();
    }
  } else if (e.key === "ArrowRight") {
    if (currentPage < comicPages.length - 1) {
      currentPage++;
      renderPage();
    }
  } else if (e.key === "Home") {
    currentPage = 0;
    renderPage();
  } else if (e.key === "End") {
    currentPage = comicPages.length - 1;
    renderPage();
  }
});


// Start it off
fetchComicPages();
buildBookChapterMenus();

