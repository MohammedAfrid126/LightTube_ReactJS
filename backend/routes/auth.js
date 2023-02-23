import express from 'express';
import  { signup, signin, googleAuth }  from '../controllers/controlAuth.js'

const router = express.Router();

//In the Authentication mainly we create a user and Login a user (Sign In) 

//Create a new user
router.post('/signup', signup)
//Sign In a user
router.post('/signin', signin)
//Google Authenticate a user
router.post('/google', googleAuth)

export default router;