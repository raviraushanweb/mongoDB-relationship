import express from "express";
import mongoose from "mongoose";
const app = express();
import { Tags, Tutorial } from "./models";

// Database connection
mongoose.connect(
  "mongodb://127.0.0.1:27017/manytomany?readPreference=primary&appname=MongoDB%20Compass&ssl=false",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
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
  res.json("Homepage Many to Many");
});

app.post("/tags", async (req, res) => {
  let { name, slug, tutorials } = req.body;
  const verifyTuts = req.body.tutorials;
  const length = verifyTuts.length;
  for (let i = 0; i < length; i++) {
    if (!mongoose.isValidObjectId(verifyTuts[i])) {
      res.json("Tutorial object id is not valid format");
      return;
    }
    let tut = await Tutorial.findById(verifyTuts[i]);
    if (!tut) {
      res.json("Tutorial doesn't exist in the database");
      return;
    }
  }
  let tutorial = new Tags({ name, slug, tutorials });
  const result = await tutorial.save();
  res.json(result);
});
app.get("/tags", async (req, res) => {
  const tags = await Tags.find()
    .populate({ path: "tutorials", select: "title author" })
    .select("-__v");
  res.json(tags);
});

app.post("/tutorial", async (req, res) => {
  let { title, author, tags } = req.body;
  const verifyTags = req.body.tags;
  const length = verifyTags.length;
  for (let i = 0; i < length; i++) {
    if (!mongoose.isValidObjectId(verifyTags[i])) {
      res.json("Tags object id is not valid format");
      return;
    }
    let tut = await Tags.findById(verifyTags[i]);
    if (!tut) {
      res.json("Tags doesn't exist in the database");
      return;
    }
  }
  let tutorial = new Tutorial({ title, author, tags });
  const result = await tutorial.save();
  res.json(result);
});

app.get("/tutorial", async (req, res) => {
  const result = await Tutorial.find().select("-__v");
  res.json(result);
});
app.get("/tutorialByTags/:id", async (req, res) => {
  const tagId = req.params.id;
  console.log(tagId);
  const result = await Tutorial.find({ tags: tagId })
    .populate({ path: "tags", select: "name slug" })
    .select("-__v");
  res.json(result);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT} ....`));
