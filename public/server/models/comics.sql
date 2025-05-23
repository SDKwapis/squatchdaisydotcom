CREATE TABLE IF NOT EXISTS comic_pages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  book INTEGER,
  chapter INTEGER,
  page_number INTEGER,
  image_url TEXT
);
