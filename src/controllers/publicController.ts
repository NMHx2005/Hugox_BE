import { Request, Response } from 'express';
import Settings from '../models/Settings';

// Get public general settings (no sensitive data)
export const getPublicGeneralSettings = async (req: Request, res: Response): Promise<void> => {
    let settings = await Settings.findOne();

    if (!settings) {
        settings = await Settings.create({});
    }

    const publicGeneralSettings = {
        siteName: settings.general.siteName,
        siteDescription: settings.general.siteDescription,
        logo: settings.general.logo,
        favicon: settings.general.favicon,
        theme: settings.general.theme,
        language: settings.general.language,
        currency: settings.general.currency,
        timezone: settings.general.timezone,
        // Don't expose sensitive data like API keys, admin settings, etc.
    };

    res.json({
        success: true,
        data: { settings: publicGeneralSettings }
    });
};

// Get public contact settings (no sensitive data)
export const getPublicContactSettings = async (req: Request, res: Response): Promise<void> => {
    let settings = await Settings.findOne();

    if (!settings) {
        settings = await Settings.create({});
    }

    const publicContactSettings = {
        companyName: settings.general.siteName,
        address: settings.general.address,
        phone: settings.general.phone,
        email: settings.general.supportEmail,
        website: settings.general.siteUrl,
        socialMedia: {
            facebook: settings.general.facebook,
            youtube: settings.general.youtube,
            zalo: settings.general.zalo,
        },
        // Don't expose sensitive data like API keys, admin emails, etc.
    };

    res.json({
        success: true,
        data: { settings: publicContactSettings }
    });
};
