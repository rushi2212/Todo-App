const express = require("express");
const bodyParser = require("body-parser");
var app=express();
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/todo");
const trySchema = new mongoose.Schema({
  name:String
});

const item = mongoose.model("task",trySchema);
const todo = new item({
  name:"Create a video"
});
const todo2 = new item({
  name:"Learn DSA"
});
const todo3 = new item({
  name:"Learn React"
});

//todo2.save();
//todo3.save();

app.get("/", async function(req, res) {
  try {
    const foundItems = await item.find({});
    res.render("list", { ejes: foundItems });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching tasks");
  }
});

app.post("/",function(req,res){
  const itemName = req.body.ele1;
  const todo4 = new item({
    name:itemName
  })
  todo4.save();
  res.redirect("/");
});

app.post("/delete", async function(req, res) {
  const checked = req.body.checkbox1;
  try {
    await item.findByIdAndDelete(checked);
    console.log("deleted");
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error deleting task");
  }
});


app.listen(3000, () => {
  console.log("Server started on port 3000");
});
