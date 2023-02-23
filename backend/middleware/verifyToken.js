import jwt from 'jsonwebtoken'
import { createError } from '../error.js';
import dotenv from 'dotenv';
dotenv.config()

export const verifyToken = (req, res, next) =>{
    const token = req.cookies.auth_token;
    if(!token){
        return next(createError(403, "You are not authenticated!"))
    }
    jwt.verify(token, process.env.jwt_key,(err,user)=>{
        if(err){
            return next(createError(403, "You are not authenticated!"))
        }
        req.user = user;
        next();
    });
};