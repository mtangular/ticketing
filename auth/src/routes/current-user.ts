import express from 'express'
import { JsonWebTokenError } from 'jsonwebtoken';

import {currentUser} from '@tmangtickets/common'


const router = express.Router()

router.get('/api/users/currentuser',currentUser, (req, res) => {
  
  res.send({currentUser:req.currentUser|| null})
});

export {router as currentUserRouter}