const userRouter = require('../routes/userRoutes');
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const tokenModel = require('../models/tokenModel');
const sendMail = require('../services/sendMail');


//normal Signup:
const signup = async (req, res) => {
    const { name, email,password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    //verify email
    const userExists = await userModel.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: "User already exists" });
    }

    //generate a token:
    const token = jwt.sign({ name, email,password, googleLogin: false }, process.env.JWT_SECRET_KEY, { expiresIn: '5m' });

    //send email
    const emailSent = await sendMail({
        email: email,
        subject: "Verify your email",
        message: `Click this link to verify your email: http://localhost:3000/api/userRoutes/verify/${token}`,
        html: "<b>This is a HTML email</b>"
    });

    if (emailSent) {
        return res.status(200).json({ message: "Email sent successfully" });
    }
    else {
        return res.status(500).json({ message: "Email could not be sent" });
    }

}

const verifyEmailLink = async (req, res) => {
    const { token } = req.params;
    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    if (!user) {
        return res.status(400).json({ message: "Invalid token" });
    }

    const userExists = await userModel.findOne({ email: user.email });
    if (userExists) {
        return res.status(400).json({ message: "User already exists" });
    }

    const response =await userModel.create({name:user.name,email:user.email,password:user.password,googleLogin:false});
    if(!response){
        return res.status(500).json({ message: "Error saving user" });
    }
    return res.status(200).json({ message: "Email verified successfully , you can now login" });

}

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }
    if(user.googleLogin){
            console.log("user",user);
        return res.status(400).json({ message: "Please login using Google" });
    }
    if (user.password !== password) {
        return res.status(400).json({ message: "Invalid password" });
    }

    //generate a token:
    const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    const userId = user._id;
    return res.status(200).json({ message: "Login successful",token,userId,user});
}

const googleLogin = async (req, res) => {
    const { email,name } = req.body;
    let user = await userModel.findOne({ email });
    
    if (!user) {
        //store the user:
        user = await userModel.create({ name,email,googleLogin: true });
        if (!user) {
            return res.status(500).json({ message: "Error saving user" });
        }
    }

    //generate a token:
    const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    const userId = user._id;
    return res.status(200).json({ message: "Login successful",token,userId,success: true });
}


const forgotPassword = async (req, res) => {
    const {email} = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    //generate a token:
    const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

    //save token in the database:
    const tokenDoc = await tokenModel.create({ email, token,purpose:"resetPassword" });
    if (!tokenDoc) {
        return res.status(500).json({ message: "Error saving token" });
    }

    //send email
    const emailSent = await sendMail({
        email: email,
        subject: "Reset your password",
        message: `Click this link to reset your password: http://localhost:3000/reset-password/${token}`,
        html: "<b>This is a HTML email</b>"
    });
    if (emailSent) {
        return res.status(200).json({ message: "Email sent successfully" });
    }
    else {
        return res.status(500).json({ message: "Email could not be sent" });
    }
}


const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    const tokenDoc = await tokenModel.findOne({ token,purpose:"resetPassword" });
    if (!tokenDoc) {
        return res.status(400).json({ message: "Invalid token" });
    }
    const user = await userModel.findOne({ email: tokenDoc.email });
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }
    user.password = password;
    await user.save();
    await tokenDoc.remove();
    return res.status(200).json({ message: "Password reset successful" });
}


module.exports={
    signup,verifyEmailLink,login,googleLogin,forgotPassword,resetPassword
}