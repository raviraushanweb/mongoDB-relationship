import mongoose from "mongoose";
const Schema = mongoose.Schema;

const tutorialSchema = new Schema({
  title: String,
  author: String,
  category: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
});

export default mongoose.model("Tutorial", tutorialSchema, "tutorials");
