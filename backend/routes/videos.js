import express from 'express';
import {verifyToken} from '../middleware/verifyToken.js';
import { getVideo, addVideo, updateVideo, deleteVideo, addView, trend, randomVideo, subscribedVideo, getByTag, getBySearch } from '../controllers/controlVideo.js';


const router = express.Router();

router.post('/', verifyToken, addVideo)
router.put('/:id', verifyToken, updateVideo)
router.delete('/:id', verifyToken, deleteVideo)
router.get('/find/:id',getVideo)
router.put('/view/:id',addView)
router.get('/trend',trend)
router.get('/random',randomVideo)
router.get('/sub', verifyToken,subscribedVideo)
router.get('/tag', getByTag)
router.get('/search', getBySearch)

export default router;