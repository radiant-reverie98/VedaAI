import express from 'express'
import { createAssignment,deleteAssignment,getSingleAssignment,getMyAssignments, generateAssessment } from '../controller/assignment.controller.js'
import { verifyUser } from '../middleware/verifyUser.middleware.js';
import { upload } from '../middleware/multer.middleware.js';
const router = express.Router();


router.post('/create',verifyUser,upload.single("pdf"),createAssignment)
router.get('/fetch-all',verifyUser,getMyAssignments)
router.delete('/:assignmentId',verifyUser,deleteAssignment)
router.get('/:assignmentId',verifyUser,getSingleAssignment)

router.post('/generate/:assignmentId',verifyUser,generateAssessment)



export default router;