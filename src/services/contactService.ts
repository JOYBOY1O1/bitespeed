import { AppDataSource } from '../database/data-source';
import { Contact } from '../models/Contact';
import { Repository } from 'typeorm';

export class ContactService {
  private contactRepository: Repository<Contact>;

  constructor() {
    this.contactRepository = AppDataSource.getRepository(Contact);
  }

  async identifyContact(email?: string, phoneNumber?: string) {
    let primaryContact: Contact
    let secondaryContacts: Contact[] = [];

    // Fetch existing contacts by email or phoneNumber
    const existingContacts = await this.contactRepository.find({
      where: [
        { email },
        { phoneNumber }
      ]
    });

    if (existingContacts.length > 0) {
      primaryContact = existingContacts.find(contact => contact.linkPrecedence === 'primary') || existingContacts[0];
      secondaryContacts = existingContacts.filter(contact => contact.id !== primaryContact.id);

      // Update primary contact if needed
      for (const contact of existingContacts) {
        if (contact.id !== primaryContact.id && !contact.linkedId) {
          contact.linkedId = primaryContact.id;
          contact.linkPrecedence = 'secondary';
          await this.contactRepository.save(contact);
        }
      }
    } else {
      // Create a new primary contact
      primaryContact = new Contact();
      primaryContact.email = email ?? undefined;
      primaryContact.phoneNumber = phoneNumber ?? undefined;
      primaryContact.linkPrecedence = 'primary';
      primaryContact = await this.contactRepository.save(primaryContact);
    }

    // Ensuring primaryContact is not null
    if (!primaryContact) {
      throw new Error("Primary contact is null. This should not happen.");
    }

    // Since the above check ensures primaryContact is not null, TypeScript should understand this now
    return {
      primaryContactId: primaryContact.id,
      emails: [primaryContact.email, ...secondaryContacts.map(contact => contact.email).filter(email => email !== undefined)],
      phoneNumbers: [primaryContact.phoneNumber, ...secondaryContacts.map(contact => contact.phoneNumber).filter(phone => phone !== undefined)],
      secondaryContactIds: secondaryContacts.map(contact => contact.id),
    };
  }
}
