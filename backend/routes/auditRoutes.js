// FreshFlow Node.js File System (FS) Audit Routes
import express from 'express';
import { saveLog, viewLog } from '../controllers/auditController.js';

const router = express.Router();

router.post('/save', saveLog);
router.get('/view', viewLog);

export default router;
