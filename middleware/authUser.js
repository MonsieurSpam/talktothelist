const jwt = require("jsonwebtoken");


module.exports = (req, res, next) => {
// Your code here
  let token=req.header("x-authtoken");

  if(token){
    try{
      req.jwtPayLoad=jwt.verify(token,process.env.JWTKey);
      next();
    }catch{
      res.status(401).send("Access denied. Invalid token");
    }
  }else{
    res.status(401).send("Access denied. No token provided");
  }
};