import User from '../modals/User.js'
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

//To use the variables in the env file
dotenv.config();

//signUP with details
export  const signup = ([
    body('name', "Please enter your name").isLength({min: 2}),
    body('email', "Please enter your email").isEmail(),
    body('password', "Please enter your password").isLength({min: 5}),
], async(req,res)=>{
    // if there is error the it will return 404 BAD request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    //It will check the DB with refrence of email and will return 404 BAD request 
    let user = await User.findOne({ name: req.body.name });
    if (user) {
        return res.status(404).json({ "error": "Sorry, a user exist with this email already" })
    }
    //Salt is added to password and backend will generate the HASH to store in the DATABASE
    //The below 10 is the length of the salt
    const salt = bcrypt.genSaltSync(10);
    //bcrypt is the function that will generate a HASH with reference to the password and salt
    const securePassword = await bcrypt.hash(req.body.password, salt);

    try{
        const user = new User({...req.body, password: securePassword});
        await user.save();
        res.send("success user created");
    }catch(err){
        res.status(500).send("Internal server error");
    }
});

//Sign in with name and password
export const signin = ([
    body('name', "Please enter your name").isLength({min: 2}),
    body('password', "Please enter your password").isLength({min: 5}),
], async(req,res)=>{
    // if there is error the it will return 404 BAD request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name , password } = req.body;

    try{
        let user = await User.findOne({ name });
        if (!user) {
            return res.status(404).json({ error: "Please Login with the correct credentials" })
        }        
        const passwordCompare = bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(404).json({ error: "Please Login with the correct credentials" })
        }
        const authToken = jwt.sign({id:user._id}, process.env.jwt_key);
        {
            const {password,...others} = user._doc;
            res.cookie("auth_token", authToken,{
                httpOnly: true,
            }).status(200).json(others);
        }
    }catch(err){
        res.status(500).send("Internal server error");
    }
});

//sign in with Google account
export const googleAuth = async(req,res,next)=>{
    try {
        const user = await User.findOne({email:req.body.email});
        if(user){
        const authToken = jwt.sign({id:user._id}, process.env.jwt_key)
        res .cookie("auth_token", authToken,{
            httpOnly: true,
        }).status(200).json(user._doc)
        }else{
            const newUser = new User({
                ...req.body,
                fromGoogle : true,
            })
            const savedUser = await newUser.save();
            const authToken = jwt.sign({id:savedUser._id}, process.env.jwt_key)
            res .cookie("auth_token", authToken,{
                httpOnly: true,
            }).status(200).json(savedUser._doc)
        }
    } catch (error) {
        next(error);
    }
};