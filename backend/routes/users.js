import express from 'express';
import { update, get, deleteUser, subscribe, unsubscribe, like, dislike} from '../controllers/controlUser.js'
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

//get a user
router.get("/find/:id", get)
//update a user
router.put("/:id", verifyToken, update)
//delete a user
router.delete("/:id", verifyToken, deleteUser)
//subscribe a user
router.put("/sub/:id", verifyToken, subscribe)
//unsubscribe a user
router.put("/unsub/:id", verifyToken, unsubscribe)
//like a video
router.put("/likes/:videoId", verifyToken, like)
//dislike as video
router.put("/dislikes/:videoId", verifyToken, dislike)


export default router;