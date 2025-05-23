const express = require('express');
const cors = require('cors');
const app = express();
const blogRoutes = require('./routes/blogRoutes');
const comicRoutes = require('./routes/comicRoutes');

app.use(cors());
app.use(express.json());
app.use('/api/blogs', blogRoutes);
app.use('/api/comics', comicRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
