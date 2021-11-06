import mongoose from "mongoose";
const Schema = mongoose.Schema;

const tutorialSchema = new Schema({
  title: String,
  author: String,
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
    },
  ],
});

export default mongoose.model("Tutorial", tutorialSchema, "tutorials");
