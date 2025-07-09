import { createTweet } from "../controllers/tweet.controller.js";

import { deleteTweet } from "../controllers/tweet.controller.js";

import { updateTweet } from "../controllers/tweet.controller.js";

import { editTweet } from "../controllers/tweet.controller.js";

import { getUserTweet } from "../controllers/tweet.controller.js";

import {verifyJWT} from "../middleware/auth.middleware.js";

 

import {Router} from "express";

const router = Router();

// just teh body of the connnt and the authentication
router.route('/createTweet').post(verifyJWT,createTweet);
// add the id in the params
router.route('/deleteTweet/:tweetID').post(deleteTweet);
// in the param tweet id and the body content
router.route('/updateTweet/:tweetID').post(updateTweet);
// the id in the params and the edited content in the tweet
router.route('/editTweet/:tweetID').post(editTweet);
// just the authentication of thes user to get the user related tweets
router.route('/getUserTweet').post(verifyJWT,getUserTweet);



export default router