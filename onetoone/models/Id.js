import mongoose from "mongoose";
const Schema = mongoose.Schema;

const idSchema = new Schema({
  cardCode: String,
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
});

export default mongoose.model("Id", idSchema, "ids");
