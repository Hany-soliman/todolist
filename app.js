//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const _ = require('lodash');


const app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://admin-Hany:24724700@cluster0-hca8z.mongodb.net/todolistDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const itemsSchema = {
  name: String
};



const Item = mongoose.model('Item', itemsSchema);

const item1 = new Item({
  name: "Welcome to your todolist!"
});

const item2 = new Item({
  name: "Hit the + button to add a new item."
});

const item3 = new Item({
  name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);



app.get("/", function(req, res) {

  Item.find({}, function(err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Success");
        }
      });
      res.redirect("/");
    } else {
      res.render('list', {
        listTitle: "Today",
        newListItem: foundItems
      });
    }

  });

});

app.get("/:customListName", function(req, res) {


  const customListName = _.capitalize(req.params.customListName);
  List.findOne({
    name: customListName
  }, function(err, foundList) {
    if (!err) {
      if (!foundList) {
        const list = new List({
          name: customListName,
          items: defaultItems
        });

        list.save();
        res.redirect("/" + customListName);
      } else {
        res.render("list", {
          listTitle: foundList.name,
          newListItem: foundList.items
        });
      }
    }
  });

});

app.post("/", function(req, res) {
  const newItem = req.body.newItem;
  const listName = req.body.list;
  const item = new Item({
    name: newItem
  });

  if(listName === "Today"){
    newerItem.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName}, function(err, foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }

});


app.post("/delete", function(req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today"){
    Item.deleteOne({
      _id: checkedItemId
    }, function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Success fully deleted the selected item!");
      }
    });
    res.redirect("/");
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
      if (!err){
        res.redirect("/" + listName);
      }
    });
  }

});



app.get("/about", function(req, res) {
  res.render("about");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen(port, function() {
  console.log("Server started Successfully");
});









// if(currentDay === 1){
//   day = "Monday";
// } else if (currentDay === 2){
//   day = "Tuesday";
// } else if (currentDay === 3){
//   day = "Wednesday";
// } else if (currentDay === 4) {
//   day = "Thursday";
// } else if (currentDay === 5) {
//   day = "Friday";
// }else if (currentDay === 6) {
//   day = "Saturday";
// } else {
//   day = "Sunday";
// }
//
// switch (currentDay) {
//   case 0:
//     day = "Sunday";
//     break;
//   case 1:
//     day = "Monday";
//     break;
//   case 2:
//     day = "Tuesday";
//     break;
//   case 3:
//     day = "Wednesday";
//     break;
//   case 4:
//     day = "Thursday";
//     break;
//   case 5:
//     day = "Friday";
//     break;
//   case 6:
//     day = "Saturday";
//     break;
//
//   default:
//     console.log("Error: current day is equal to: " + currentDay);
//
// }
