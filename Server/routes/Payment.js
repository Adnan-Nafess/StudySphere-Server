import express from 'express';
const router = express.Router();

import { capturePayment, verifySignature } from '../controllers/payment.js';
import { auth, isInstructor, isStudent, isAdmin } from '../middlewares/auth.js';

router.post('/capturePayment', auth, isStudent, capturePayment);
router.post('/verifySignature', auth, isStudent, verifySignature);

// Export the router
export default router;