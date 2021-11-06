import mongoose from "mongoose";
const Schema = mongoose.Schema;

const customerSchema = new Schema({
  name: String,
  age: Number,
  gender: String,
});

export default mongoose.model("Customer", customerSchema, "customers");
