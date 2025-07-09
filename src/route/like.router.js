
import {toggleLikeComment} from "../controllers/likes.controllers.js";

import {toggleLikeTweet} from "../controllers/likes.controllers.js";

import {toggleLikeVideo} from "../controllers/likes.controllers.js";

import {getLikedVideos} from "../controllers/likes.controllers.js";

import {Router} from "express";

import {verifyJWT} from "../middleware/auth.middleware.js";


const router = Router();

// id in tjhe params
router.route('/toggleLikeTweet/:tweetId').post(verifyJWT,toggleLikeTweet);
// the id in the params
router.route('/toggleLikeComment/:commentId').post(verifyJWT,toggleLikeComment);
// id in the params
router.route('/toggleLikeVideo').post(verifyJWT,toggleLikeVideo);
// just the authentication places
router.route('/getLikedVideos').post(verifyJWT,getLikedVideos);



 export default router;