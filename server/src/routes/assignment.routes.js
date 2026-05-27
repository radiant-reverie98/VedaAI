import express from 'express'
import { createAssignment,deleteAssignment,getSingleAssignment,getMyAssignments } from '../controller/assignment.controller.js'
import { verifyUser } from '../middleware/verifyUser.middleware.js';
import { upload } from '../middleware/multer.middleware.js';
const router = express.Router();


router.post('/create',verifyUser,upload.single("pdf"),createAssignment)
router.delete('/:assignmentId',verifyUser,deleteAssignment)
router.get('/:assignmentId',verifyUser,getSingleAssignment)
router.get('/fetch-all',verifyUser,getMyAssignments)


export default router;