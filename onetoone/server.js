import express from "express";
import mongoose from "mongoose";
import { Customer, Id } from "./models";
const app = express();

// Database connection
mongodb: mongoose.connect(
  "mongodb://127.0.0.1:27017/onetoone?readPreference=primary&appname=MongoDB%20Compass&ssl=false",
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
  res.json("Homepage");
});

app.post("/customer", async (req, res) => {
  const { name, age, gender } = req.body;
  let customer = new Customer({
    name,
    age,
    gender,
  });
  customer = await customer.save();
  res.json(customer);
});

app.get("/customer", async (req, res) => {
  const customer = await Customer.find().select("-__v");
  res.json(customer);
});

app.post("/id", async (req, res) => {
  const { cardCode, customer } = req.body;
  if (!mongoose.isValidObjectId(customer)) {
    res.json("Object id format is not correct");
    return;
  }
  const cus = await Customer.findById(customer);
  if (!cus) {
    res.json("Customer doesn't exist");
    return;
  }

  let id = new Id({
    cardCode,
    customer,
  });
  id = await id.save();
  res.json(id);
});

app.get("/id", async (req, res) => {
  const id = await Id.find()
    .populate({ path: "customer", select: "-__v" })
    .select("-__v");
  res.json(id);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT} ...`));
