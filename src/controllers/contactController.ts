import { Request, Response } from 'express';
import Contact from '../models/Contact';
import { createError } from '../middleware/errorHandler';

// Submit contact form
export const submitContact = async (req: Request, res: Response): Promise<void> => {
  const { name, email, phone, subject, content } = req.body;

  const contact = await Contact.create({
    name,
    email,
    phone,
    subject,
    content,
    source: 'website'
  });

  res.status(201).json({
    success: true,
    message: 'Contact form submitted successfully',
    data: { contact }
  });
};

// Submit agent contact form
export const submitAgentContact = async (req: Request, res: Response): Promise<void> => {
  const { name, email, phone, subject, content } = req.body;

  const contact = await Contact.create({
    name,
    email,
    phone,
    subject: `[Đại lý] ${subject}`,
    content,
    source: 'website',
    priority: 'high'
  });

  res.status(201).json({
    success: true,
    message: 'Agent contact form submitted successfully',
    data: { contact }
  });
};
