const mongoose = require("mongoose");

//Connecting to MongoDB database
mongoose.connect("mongodb+srv://"+process.env.DBUser+":"+process.env.DBPass+"@cs157.2zk95.mongodb.net/TalkToTheList?retryWrites=true&w=majority",
  { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  }, (err) => {
    if (!err) {
      console.log("Connected to MongoDB");
    } else {
      console.log(err);
    }
  }
);