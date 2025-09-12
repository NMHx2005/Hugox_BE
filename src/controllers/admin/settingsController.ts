import { Request, Response } from 'express';
import { createError } from '../../middleware/errorHandler';
import Settings from '../../models/Settings';

// Get settings
export const getSettings = async (req: Request, res: Response): Promise<void> => {
    let settings = await Settings.findOne();

    if (!settings) {
        // Create default settings if none exist
        settings = await Settings.create({});
    }

    res.json({
        success: true,
        data: { settings }
    });
};

// Update settings
export const updateSettings = async (req: Request, res: Response): Promise<void> => {
    const { section, data } = req.body;

    if (!section || !data) {
        throw createError('Section and data are required', 400);
    }

    let settings = await Settings.findOne();

    if (!settings) {
        settings = await Settings.create({});
    }

    // Update the specific section
    const updateQuery = { [`${section}`]: { ...settings[section as keyof typeof settings], ...data } };
    settings = await Settings.findByIdAndUpdate(settings._id, updateQuery, { new: true });

    res.json({
        success: true,
        message: 'Settings updated successfully',
        data: { settings }
    });
};

// Get general settings
export const getGeneralSettings = async (req: Request, res: Response): Promise<void> => {
    let settings = await Settings.findOne();

    if (!settings) {
        settings = await Settings.create({});
    }

    res.json({
        success: true,
        data: { settings: settings.general }
    });
};

// Update general settings
export const updateGeneralSettings = async (req: Request, res: Response): Promise<void> => {
    const updateData = req.body;

    let settings = await Settings.findOne();

    if (!settings) {
        settings = await Settings.create({});
    }

    settings.general = {
        ...settings.general,
        ...updateData
    };

    settings = await Settings.findByIdAndUpdate(settings._id, { general: settings.general }, { new: true });

    res.json({
        success: true,
        message: 'General settings updated successfully',
        data: { settings: settings?.general }
    });
};

// Get contact settings
export const getContactSettings = async (req: Request, res: Response): Promise<void> => {
    let settings = await Settings.findOne();

    if (!settings) {
        settings = await Settings.create({});
    }

    const contactSettings = {
        phone: settings.general.phone,
        address: settings.general.address,
        zalo: settings.general.zalo,
        facebook: settings.general.facebook,
        youtube: settings.general.youtube,
        adminEmail: settings.general.adminEmail,
        supportEmail: settings.general.supportEmail
    };

    res.json({
        success: true,
        data: { settings: contactSettings }
    });
};

// Update contact settings
export const updateContactSettings = async (req: Request, res: Response): Promise<void> => {
    const updateData = req.body;

    let settings = await Settings.findOne();

    if (!settings) {
        settings = await Settings.create({});
    }

    settings.general = {
        ...settings.general,
        ...updateData
    };

    settings = await Settings.findByIdAndUpdate(settings._id, { general: settings.general }, { new: true });

    res.json({
        success: true,
        message: 'Contact settings updated successfully',
        data: { settings: settings?.general }
    });
};
