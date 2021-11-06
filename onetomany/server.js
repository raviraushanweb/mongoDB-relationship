import express from "express";
import mongoose, { mongo } from "mongoose";
const app = express();
import { Category, Tutorial } from "./models";

// Database connection
mongodb: mongoose.connect(
  "mongodb://127.0.0.1:27017/onetomany?readPreference=primary&appname=MongoDB%20Compass&ssl=false",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("DB connected...");
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.json("Homepage One to Many");
});

app.post("/category", async (req, res) => {
  const { name, desc } = req.body;
  let category = new Category({ name, desc });
  category = await category.save();
  res.json(category);
});
app.get("/category", async (req, res) => {
  const category = await Category.find().select("-__v");
  res.json(category);
});

app.post("/tutorial", async (req, res) => {
  let { title, author, category } = req.body;
  console.log(req.body);
  if (!mongoose.isValidObjectId(category)) {
    res.json("Category object id is not valid format");
    return;
  }
  let cat = await Category.findById(category);
  if (!cat) {
    res.json("category doesn't exist in the database");
    return;
  }
  let tutorial = new Tutorial({ title, author, category });
  const result = await tutorial.save();
  res.json(result);
});
app.get("/tutorial", async (req, res) => {
  const result = await Tutorial.find()
    .populate({ path: "category", select: "-__v" })
    .select("-__v");
  res.json(result);
});

app.get("/tutorialbycategory/:category", async (req, res) => {
  const { category } = req.params;
  if (!mongoose.isValidObjectId(category)) {
    res.json("Category object id is not valid format");
    return;
  }
  let cat = await Category.findById(category);
  if (!cat) {
    res.json("category doesn't exist in the database");
    return;
  }
  const result = await Tutorial.find({ category: cat })
    .populate({ path: "category", select: "-__v" })
    .select("-__v");
  res.json(result);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT} ...`));
