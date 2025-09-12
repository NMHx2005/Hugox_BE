import express from 'express';
import { getContacts, getContact, updateContactStatus, deleteContact, addContactNotes } from '../../controllers/admin/contactController';
import { authenticate, authorize } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/errorHandler';

const router = express.Router();

// All routes require admin authentication
router.use(authenticate);
router.use(authorize('admin'));

// Routes
router.get('/', asyncHandler(getContacts));
router.get('/:id', asyncHandler(getContact));
router.put('/:id/status', asyncHandler(updateContactStatus));
router.post('/:id/notes', asyncHandler(addContactNotes));
router.delete('/:id', asyncHandler(deleteContact));

export default router;
