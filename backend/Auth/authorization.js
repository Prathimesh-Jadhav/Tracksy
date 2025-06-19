const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

const authorize = async (req,res,next) => {
    const token = req.headers["authorization"].split(" ")[1];
    if(!token){
        return res.status(401).json({message:"You are not logged in"});
    }

    const userEmail = jwt.verify(token,process.env.JWT_SECRET_KEY);

    if(!userEmail){
        return res.status(401).json({message:"You are not logged in"});
    }
    
    
    const user = await userModel.findOne({email:userEmail.email});
    if(!user){
        return res.status(401).json({message:"You are not logged in"});
    }
    req.user = user;
    next();
}

module.exports = {authorize};