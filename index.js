const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(process.env.MONGO_URI);

const trySchema = new mongoose.Schema({
  name: String,
  editing: { type: Boolean, default: false }
});

const Task = mongoose.model("task", trySchema);


app.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.render("list", { ejes: tasks });
  } catch (err) {
    res.status(500).send("Error fetching tasks");
  }
});


app.post("/", async (req, res) => {
  const taskName = req.body.ele1.trim();
  if (!taskName) return res.redirect("/");

  const newTask = new Task({ name: taskName });
  await newTask.save();
  res.redirect("/");
});


app.post("/delete", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.body.checkbox1);
    res.redirect("/");
  } catch (err) {
    res.status(500).send("Error deleting task");
  }
});


app.get("/edit/:id", async (req, res) => {
  await Task.updateMany({}, { editing: false });
  await Task.findByIdAndUpdate(req.params.id, { editing: true });
  res.redirect("/");
});


app.post("/edit/:id", async (req, res) => {
  const updatedName = req.body.newName.trim();
  if (updatedName) {
    await Task.findByIdAndUpdate(req.params.id, {
      name: updatedName,
      editing: false
    });
  }
  res.redirect("/");
});

app.listen(port, () => {
  console.log("Server started on port " + port);
});
