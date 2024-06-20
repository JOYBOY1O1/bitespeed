import { Request, Response } from 'express';
import { ContactService } from '../services/contactService';

const contactService = new ContactService();

export const identifyContact = async (req: Request, res: Response) => {
  console.log("request initaed")
  const { email, phoneNumber } = req.body;
  console.log(req.body)
  const result = await contactService.identifyContact(email, phoneNumber);
  res.status(200).json({ contact: result });
};
