import {Router} from 'express';
import {registerUser} from '../controllers/user.controller.js'
import {loginUser} from '../controllers/user.controller.js'
import {loggedOut} from '../controllers/user.controller.js'
import {refreshAccessToken} from '../controllers/user.controller.js'
import {upload} from "../middleware/multer.middleware.js"

import { GetUserChannel } from '../controllers/user.controller.js';

import { getWatchHistory } from '../controllers/user.controller.js';

import { changeCurrentPassword } from '../controllers/user.controller.js';

import { changeAvatar } from '../controllers/user.controller.js';

import { getCurrentUser } from '../controllers/user.controller.js';

import { changeAccountDetails } from '../controllers/user.controller.js';

import {addVideo} from '../controllers/user.controller.js' 
import {addhistory} from '../controllers/user.controller.js' 



import {verifyJWT} from "../middleware/auth.middleware.js"
const router=Router();

router.route('/register').post(
    upload.fields([{
        name:'avatar',
        maxCount:1
    },{
        name:'coverImage',
        maxCount:1
    }]),
    registerUser)


router.route('/login').post(loginUser)

router.route('/logout').post(verifyJWT,loggedOut)

router.route('/updateAccess').post(refreshAccessToken);
// just the username of the USER  no need to authentication
router.route('/GetUserChannel/:username').post(GetUserChannel);
// just the authentications required

// all of the below routes are the secured routers and theses router are needed to be gone only whene the user is logged in to the website
// so nowownword every routers need the authentication first so the verify route is needed so the cookie is needed to be sent over req.
router.route('/getWatchHistory').post(verifyJWT,getWatchHistory);

// from body old paass amd the new pass 
router.route('/changeCurrentPassword').post(verifyJWT,changeCurrentPassword);
// usind multer one single file is uploaded
router.route('/changeAvatar').post(  upload.single('avatar'),verifyJWT,changeAvatar);
// just  autheication
router.route('/getCurrentUser').post(verifyJWT,getCurrentUser);
// fullname or email form the body  ans verify

router.route('/changeAccountDetails').post(verifyJWT,changeAccountDetails);


router.route('/addvideo').post(upload.fields([{name:"video",maxCount:1},{name:"thumbnail",maxCount:1}]),verifyJWT,addVideo);

router.route('/addhistory').post(verifyJWT,addhistory)

export default router;