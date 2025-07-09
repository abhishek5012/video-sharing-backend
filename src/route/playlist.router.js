
import {createPlaylist} from "../controllers/playlist.controller.js";
import {updatePlaylist} from "../controllers/playlist.controller.js";
import {getUserPlaylist} from "../controllers/playlist.controller.js";
import {deletePlaylist} from "../controllers/playlist.controller.js";
import {addVideoToPlaylist} from "../controllers/playlist.controller.js";
import {verifyJWT} from "../middleware/auth.middleware.js"
import {selectVideosFromUser } from "../middleware/playlist.middleware.js"
import {verifyPlaylist } from "../middleware/playlist.middleware.js"

import { Router } from 'express';

const router =Router();


//  give the videos from the body of the postman
router.route('/createPlaylist').post(verifyJWT,selectVideosFromUser,createPlaylist);
// enter the name ,description from the body and the id in the params
router.route('/updatePlaylist/:Id').post(verifyPlaylist,updatePlaylist);
// nothing to do the user is verified accourng to the tokenes
router.route('/getUserPlaylist').post(verifyJWT,getUserPlaylist);
// plylist id is provided in the params
router.route('/deletePlaylist/:Id').post(verifyPlaylist,deletePlaylist);
// id in the params or the videos from the body 
router.route('/addVideoToPlaylist/:Id').post(selectVideosFromUser,verifyPlaylist,addVideoToPlaylist);
 


export default router;