
import { addComment } from "../controllers/comment.controller.js";

import { deleteCommnet } from "../controllers/comment.controller.js";

import { updateCommnet } from "../controllers/comment.controller.js";

import { getVideoComment } from "../controllers/comment.controller.js";

import {verifyJWT} from "../middleware/auth.middleware.js";

import {Router } from "express";

const router=Router();

// the video id and the comment in the body
router.route('/addcomment/:videoId').post(verifyJWT,addComment);
// just the id of the comment in the params
router.route('/deletecomment/:commentID').post(deleteCommnet);

// id in the params and the content in the body of the postman
router.route('/updatecomment/:commentID').post(updateCommnet);

router.route('/getvideoscomment').post(verifyJWT,getVideoComment);


export default router;
