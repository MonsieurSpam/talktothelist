module.exports = (req, res, next) => {
  // Your code here 
 if(req.jwtPayLoad){
   if(req.jwtPayLoad.username==req.params.id){
     next();
   }else{
     console.log(req.jwtPayLoad.username)
     res.status(401).send("Usernames do not match");
   }
 }else{
   res.status(401).send("User is not authenticated");
 }
}; 