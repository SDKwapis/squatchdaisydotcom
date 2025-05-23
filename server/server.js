const express = require("express");
const cors = require("cors");
const sequelize = require("./models/index");
const blogRoutes = require("./routes/blogRoutes");
const comicRoutes = require("./routes/comicRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/blogs", blogRoutes);
app.use("/api/comics", comicRoutes);

const path = require("path");
app.use(express.static(path.join(__dirname, "../public")));

sequelize.sync().then(() => {
  app.listen(3000, () =>
    console.log("Server running at http://localhost:3000")
  );
});
