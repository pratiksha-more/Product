import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import products from "./models/product.js";

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

async function connectToDatabase() {
  await mongoose.connect("mongodb://localhost:27017/Products");
  console.log("Connected to database");
}
connectToDatabase();

app.get("/", async (req, res) => {
  const allproduct = await products.find();
  res.render("index", { allProducts: allproduct });
});

app.get("/addproduct", async (req, res) => {
  const { id } = req.query;
  const allProducts = await products.find();

  if (id) {
    const product = await products.findById(id);
    return res.render("addproduct", { allProducts, record: product });
  }
  return res.render("addproduct", { allProducts, record: null });
});

app.post("/addproduct", async (req, res) => {
  const { title, content, price } = req.body;
  const { id } = req.query;

  if (id) {
    await products.findByIdAndUpdate(id, { title, content, price });
    return res.redirect("/addproduct");
  }
  await products.create({ title, content, price });
  return res.redirect("/");
});

app.get("/products", async (req, res) => {
  const { id } = req.query;
  const allProducts = await products.find();

  if (id) {
    const product = await products.findById(id);
    return res.render("products", { allProducts, record: product });
  }
  return res.render("products", { allProducts, record: null });
});

app.get("/search", async (req, res) => {
  const { key } = req.query;

  const results = await products.find({
    $or: [
      { title: { $regex: key, $options: "i" } },
      { content: { $regex: key, $options: "i" } },
      { price: { $regex: key, $options: "i" } },
    ],
  });

  res.render("index", { allNews: results });
});

app.post("/products", async (req, res) => {
  const { title, content, price } = req.body;

  await product.create({
    name: title,
    content: content,
    price: price,
  });
  res.redirect("/products");
});

app.get("/delete/:id", async (req, res) => {
  const { id } = req.params;
  await products.findByIdAndDelete(id);
  res.redirect("/products");
});
app.get("/update/:id", async (req, res) => {
  const { id } = req.params;
  await products.findByIdAndDelete(id);
  res.redirect("/products");
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
