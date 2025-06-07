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
    // ▶️ Use relative URL so it works when deployed
    const res = await fetch("/api/comics");
    const pages = await res.json();

    comicPages = pages.sort((a, b) => {
      return (
        a.book - b.book ||
        a.chapter - b.chapter ||
        a.pageNumber - b.pageNumber
      );
    });

    buildBookChapterMenus();
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
  document.getElementById("bookNum").textContent = page.book;

  pageNumberText.textContent = `Page ${currentPage + 1} of ${comicPages.length}`;

  prevButton.disabled = currentPage === 0;
  nextButton.disabled = currentPage === comicPages.length - 1;
  firstButton.disabled = currentPage === 0;
  lastButton.disabled = currentPage === comicPages.length - 1;

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
  bookSelect.innerHTML = `<option value="">📁 Open Drawer</option>`;
  chapterSelect.innerHTML = `<option value="">📄 Pull Case File</option>`;

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

// 🧠 Konami Code + secret poem password feature
const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
let keysPressed = [];

const poem = atob("U29mdCB0ZW5kcmlscyBodW0gaW4gc2lsZW50IGR1c2sKVGhyb3VnaCBlbWVyYWxkIHZlaWwsIGEgd2hpc3BlciBsaW5nZXJzCklud292ZW4gcGV0YWxzIGNsaW5nIGxpa2UgbWVtb3JpZXMKQ3Jlc2NlbmRvcyByaXNlIGluIGxhdHRpY2UgZ3JlZW4KCktlZXBzYWtlcyBvZiB3b29kbGFuZOKAmXMgaGlkZGVuIHNvbmcKUmVzb25hbmNlIGRyaXBzIGZyb20gdGhvcm5sZXNzIGJvd3MKQmVuZWF0aCBtb3NzeSBib3VnaCwgYSBjb3ZlcnQgcHVsc2UKVW5zZWVuIGhhbmRzIHBsdWNrIGEgY3J5c3RhbCBzdHJpbmcKClNoYWRvd3MgYnJlYXRoZSBpbiBtZWxvZGljIGhhemUKSGVyZSB0aGUgZGFuY2VycyB3ZWFyIG5vIG1hc2sKSW4gc29waG9tb3JlIHNhZ2EsIHR3byBraW4gc2xpcCBzdGVhbHRoeQpCYXJyZWwtZmlyZSByb2NrZXRzIGNhcnZlIHNlY3JldCB2YXVsdHMKClBvbnl0YWlsIHN3aXJscyB0aHJvdWdoIGNyZWVwaW5nIHZpbmVzClNpbHZlciB0b2tlbnMgZ2xpbnQgaW4gZHVza3kgbm9va3MKTmlnaHRmYWxsIG9yY2hlc3RyYXRlcyB0aGUgaHVzaApZb3UgZm9sbG93IHRoZSBzZWNyZXQgb3ZlcnR1cmUK");

document.addEventListener("keydown", (e) => {
  keysPressed.push(e.keyCode);
  if (keysPressed.length > konamiCode.length) keysPressed.shift();

  if (JSON.stringify(keysPressed) === JSON.stringify(konamiCode)) {
    const flicker = document.querySelector('.secret-flicker');
    const triggerPrompt = () => {
      const answer = prompt(poem + "\n\nEnter the password to proceed:");
      if (answer && answer.trim() === "Stickerbush Symphony") {
        window.open("secret.html", "_blank");
      } else {
        alert("🕸️ The forest remains silent.");
      }
    };

    if (flicker) {
      flicker.classList.add('flash-secret');
      setTimeout(() => {
        flicker.classList.remove('flash-secret');
        triggerPrompt();
      }, 600);
    } else {
      triggerPrompt();
    }
  }
});

// 👣 Console hint (only runs once per session)
if (!sessionStorage.getItem("squatch_console_hint_shown")) {
  console.log("%c👣 You found a footprint...", "color: #ffcc00; font-size: 16px; font-weight: bold;");
  console.log("%c01101011 01101111 01101110 01100001 01101101 01101001 00100000 01100011 01101111 01100100 01100101", "color: #00ffcc; font-family: monospace;");
  sessionStorage.setItem("squatch_console_hint_shown", "true");
}

document.getElementById("toggleDark").addEventListener("click", () => {
  document.body.classList.toggle("crt");
});

function checkPass() {
  const pass = document.getElementById("secretPass").value.trim();
  const feedback = document.getElementById("feedback");
  if (pass === "CipherRelic") {
    window.location.href = "/manifest/cipher.html"; // change this to your next secret file
  } else {
    feedback.textContent = "Access denied. That’s not the key.";
    feedback.style.color = "#f00";
  }
}

// Start loading content
fetchComicPages();



