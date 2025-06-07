const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const sequelize = require("./models/index");
const blogRoutes = require("./routes/blogRoutes");
const comicRoutes = require("./routes/comicRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Enable CORS + allow cookies on cross‐origin requests
app.use(
  cors({
    origin: true,       // allow requests from the same origin (your Render URL)
    credentials: true,  // enable Set-Cookie
  })
);

// Parse cookies and JSON bodies
app.use(cookieParser());
app.use(express.json());

// API routes
app.use("/api/blogs", blogRoutes);
app.use("/api/comics", comicRoutes);
app.use("/api", authRoutes);

// Serve your React/Static frontend
app.use(express.static(path.join(__dirname, "../public")));

// Sync DB and start server
const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

