import { Request, Response } from 'express';
import Contact from '../../models/Contact';
import { createError } from '../../middleware/errorHandler';
import mongoose from 'mongoose';

// Get all contacts for admin
export const getContacts = async (req: Request, res: Response): Promise<void> => {
    const {
        page = 1,
        limit = 12,
        search,
        status,
        priority,
        source,
        sort = '-createdAt'
    } = req.query;

    const filter: any = {};

    if (search) {
        filter.$or = [
            { name: new RegExp(search as string, 'i') },
            { email: new RegExp(search as string, 'i') },
            { phone: new RegExp(search as string, 'i') },
            { subject: new RegExp(search as string, 'i') }
        ];
    }

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (source) filter.source = source;

    const skip = (Number(page) - 1) * Number(limit);

    const [contacts, total] = await Promise.all([
        Contact.find(filter)
            .populate('assignedTo', 'name email')
            .sort(sort as string)
            .skip(skip)
            .limit(Number(limit)),
        Contact.countDocuments(filter)
    ]);

    res.json({
        success: true,
        data: {
            contacts,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        }
    });
};

// Get single contact for admin
export const getContact = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const contact = await Contact.findById(id)
        .populate('assignedTo', 'name email');

    if (!contact) {
        throw createError('Contact not found', 404);
    }

    res.json({
        success: true,
        data: { contact }
    });
};

// Update contact status
export const updateContactStatus = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { status, notes, assignedTo } = req.body;

    if (!['new', 'contacted', 'resolved', 'closed'].includes(status)) {
        throw createError('Invalid status', 400);
    }

    const updateData: any = { status };
    if (notes) updateData.notes = notes;
    if (assignedTo) updateData.assignedTo = assignedTo;

    const contact = await Contact.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
    ).populate('assignedTo', 'name email');

    if (!contact) {
        throw createError('Contact not found', 404);
    }

    res.json({
        success: true,
        message: 'Contact status updated successfully',
        data: { contact }
    });
};

// Delete contact
export const deleteContact = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
        throw createError('Contact not found', 404);
    }

    res.json({
        success: true,
        message: 'Contact deleted successfully'
    });
};

// Add internal notes to contact
export const addContactNotes = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { notes, author } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw createError('Invalid contact ID', 400);
    }

    if (!notes || !notes.trim()) {
        throw createError('Notes content is required', 400);
    }

    const contact = await Contact.findByIdAndUpdate(
        id,
        {
            $push: {
                internalNotes: {
                    content: notes.trim(),
                    author: author || 'admin',
                    createdAt: new Date()
                }
            },
            updatedAt: new Date()
        },
        { new: true, runValidators: true }
    ).populate('assignedTo', 'name email');

    if (!contact) {
        throw createError('Contact not found', 404);
    }

    res.json({
        success: true,
        message: 'Internal notes added successfully',
        data: { contact }
    });
};
