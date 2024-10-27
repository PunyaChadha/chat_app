const userModel = require("../Models/userModel")
const bcrypt = require("bcrypt")
const validator = require("validator")
const jwt = require("jsonwebtoken")

const createToken = (_id) => {
     const jwt_key = process.env.JWT_KEY;
     return jwt.sign({_id}, jwt_key, {expiresIn: "3d"});
}

const registerUser = async (req,res) => {
    try{
        const {name, email, password} = req.body

        let user = await userModel.findOne({email});
        if(user) return res.status(400).json("User already exists !");
    
        if(!name || !email || !password) return res.statu(400).json("All fields are required !");

        if(!validator.isEmail(email)) return res.status(400).json("Invalid Email !");

        if(!validator.isStrongPassword(password)) return res.status(400).json("Must be a strong password !");

        user = new userModel({name, email, password})
        //generates a random string/key of 10 characters to hash the password...
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        await user.save();

        const token = createToken(user._id);

        res.status(200).json({_id:user._id, name, email, token})
    }catch(e){
        console.log(e);
        res.status(500).json("Server Not Respondingg");
    }
};

const loginUser = async (req,res) => {
    const {email, password} = req.body;
    try{
        let user = await userModel.findOne({email});
        if(!user) return res.status(400).json("User Not Found..");
        
        const isValidPassword = await bcrypt.compare(password, user.password);
        if(!isValidPassword) return res.status(400).json("Invalid Password..");

        const token = createToken(user._id);

        res.status(200).json({_id:user._id, name : user.name, email, token})
    }catch(e){
        console.log(e);
        res.status(500).json("Server Not Responding..")
    }
}

const findUser = async(req,res) => {
    const userId = req.params.userId;
    try{
        const user = await userModel.findById(userId);
        res.status(200).json(user);
    }catch(e){
        console.log(e);
        res.status(500).json(e);
    }
}

const getUsers = async(req,res) => {
    try{
        const user = await userModel.find();
        res.status(200).json(user);
    }catch(e){
        console.log(e);
        res.status(500).json(e);
    }
}

const getId = async(req,res) => {
    const email = req.params.email;
    try{
        const user = await userModel.findOne({email});        
        res.status(200).json(user._id);
    }catch(e){
        console.log(e);
        res.status(500).json(e);
    }
}

module.exports = {registerUser, loginUser, findUser, getUsers, getId};