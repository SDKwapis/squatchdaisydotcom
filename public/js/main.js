let currentPage = 0;

const imageElement = document.getElementById("comic-image");
const pageNumberText = document.getElementById("page-number");
const prevButton = document.getElementById("prev-btn");
const nextButton = document.getElementById("next-btn");

function renderPage() {
  const page = sampleComic.pages[currentPage];
  imageElement.src = page.imageUrl;
  pageNumberText.textContent = `Page ${page.number}`;
  prevButton.disabled = currentPage === 0;
  nextButton.disabled = currentPage === sampleComic.pages.length - 1;
}

prevButton.addEventListener("click", () => {
  if (currentPage > 0) {
    currentPage--;
    renderPage();
  }
});

nextButton.addEventListener("click", () => {
  if (currentPage < sampleComic.pages.length - 1) {
    currentPage++;
    renderPage();
  }
});

renderPage(); // Load first page
