const express= require("express");
const User=require("../models/user.js");

const router=new express.Router(); 

//authentication stuff
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const authUser=require("../middleware/authUser.js");
const authName=require("../middleware/authName.js")

//Account login and registration
router.post("/register",(req,res)=>{

  User.findOne({username:req.body.username},(err,result)=>{
    if(!err){
      if(!result){
        let newUser= new User(req.body);
        let valErr=newUser.validateSync();

        if(!valErr){
          newUser.password=bcrypt.hashSync(newUser.password,10);

          newUser.save((err,result)=>{
            if(!err){

              let payLoad={
                username:newUser.username
              }

              let token=jwt.sign(payLoad,process.env.JWTKey);
              res.status(201).send({
                username:result.username,
                suggestionsList:result.suggestionsList,
                watchingList:result.watchingList,
                jwt:token
              });
            }else{
              res.status(400).send(err.message);
            }
          });
        }else{
          res.status(400).send(valErr.message);
        }
      }else{
        res.status(400).send("User already exists");
      }
    }else{
      res.status(400).send(err.message);
    }
  });
}); 

router.post("/login",(req,res)=>{
  User.findOne({username:req.body.username},(err,result)=>{
    if(!err){
      if(result){
        bcrypt.compare(req.body.password,result.password,(err,bcresult)=>{
          if(bcresult){
            let payLoad={
              username:result.username
            } 

            let token=jwt.sign(payLoad,process.env.JWTKey);

            res.status(201).send({
              username:result.username,
              suggestionsList:result.suggestionsList,
              watchingList:result.watchingList,
              jwt:token
            });
          }else{
            res.status(400).send("Invalid email/password.")
          }
        });
      }else{
        res.status(400).send("User does not exist");
      }
    }else{
      res.status(400).send(err.message);
    }
  });
});

//Public endpoints
router.get("/:id",(req,res)=>{
  User.findOne({username:req.params.id},(err,result)=>{
    if(!err){
      if(result){
      
      
        res.status(200).send({
          username:result.username,
          suggestionslist:result.suggestionsList,
          watchingList:result.watchingList
        });




      }else{
        res.status(400).send("User does not exist")
      }
    }else{
      res.status(400).send(err.message);
    }
  });
}); 

router.post("/:id",(req,res)=>{
  if(req.body.category=="Music"){
    req.body.title+=" 🎵";
  }else if(req.body.category=="Game"){
    req.body.title+=" 🎮";
  }else if (req.body.category=="Movie"){
    req.body.title+=" 🎥";
  }else if(req.body.category=="TV Show"){
    req.body.title+=" 📺";
  }

 User.findOneAndUpdate(
    {username:req.params.id},
    {$push:{suggestionsList:req.body}}, 
    {new:true},
    function(err,result){
      if(err){
        res.status(400).send(err.message);
      }else{
        res.status(200).send({
          username:result.username,
          suggestionslist:result.suggestionsList,
          watchingList:result.watchingList
        });
      }
    }
 );
}); 


//Profile endpoints


router.put("/profile/:id",authUser,authName,(req,res)=>{
  if(req.body.password){
    req.body.password=bcrypt.hashSync(req.body.password,10);
  }
  //for editing username or password 

   User.findOne({username:req.body.username},(err,result)=>{
    if(!err){
      if(!result){
        User.findOneAndUpdate(
          {username:req.params.id},
          req.body, 
          {new:true},
          function(err,result){
            if(err){
              
              res.status(400).send(err.message);
            }else{
              let payLoad={
              username:result.username
            } 

            let token=jwt.sign(payLoad,process.env.JWTKey);
              res.status(200).send({
                username:result.username,
                password:result.password,
                jwt:token,
                message:"Profile modified"

              });
            }
          }
        );
      }else{
        res.status(400).send("User already exists");
      }
    }else{
      res.status(400).send(err.message);
    }
  });
  
}); 

router.delete("/profile/:id",authUser,authName,(req,res)=>{
  User.findOneAndDelete(
    {username:req.params.id},
    (err,result)=>{
      if(!err){
        res.status(200).send(result);
      }else{
        res.status(400).send(err);
      }
    }
  );
}); 


//Suggestions List specific endpoints
router.put("/profile/suggestionslist/:id",authUser,authName,(req,res)=>{ 
  //deletes item from suggestionslist
  User.findOneAndUpdate(
    {username:req.params.id},
    {$pull:{suggestionsList:req.body}},
    {new:true},
    function(err,result){
      if(err){
        res.status(400).send(err.message);
      }else{
        res.status(200).send(result);
      }
    }
  );
});

//Watchlist specific endpoints 

router.put("/profile/watchlist/:id",authUser,authName,(req,res)=>{
  User.findOneAndUpdate(
    {username:req.params.id},
    {$pull:{watchingList:req.body}},
    {new:true},
    function(err,result){
      if(err){
        res.status(400).send(err.message);
      }else{
        res.status(200).send(result);
      }
    }
  );
}); 

//Moves item from suggestions list to watchlist
router.post("/profile/watchlist/:id",authUser,authName,(req,res)=>{
  User.findOneAndUpdate(
    {username:req.params.id},
    {$pull:{suggestionsList:req.body},
     $push:{watchingList:req.body}
    },
    {new:true},
    function(err,result){
      if(err){
        res.status(400).send(err.message);
      }else{
        res.status(200).send(result);
      }
    }
  );
});

module.exports=router;