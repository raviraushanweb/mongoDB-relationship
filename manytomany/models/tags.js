import mongoose from "mongoose";
const Schema = mongoose.Schema;

const tagSchema = new Schema({
  name: String,
  slug: String,
  tutorials: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tutorial",
    },
  ],
});

export default mongoose.model("Tag", tagSchema, "tags");
