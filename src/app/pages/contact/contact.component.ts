import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ContactService } from '../../services/contact.service';
import { Contact } from '../../models/bien.model';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  contact: Contact = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    message: ''
  };

  loading = false;
  success = false;
  error = '';

  constructor(private contactService: ContactService) {}

  onSubmit(): void {
    // Validation simple
    if (!this.contact.nom || !this.contact.prenom || !this.contact.email || !this.contact.telephone) {
      this.error = 'Veuillez remplir tous les champs obligatoires';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = false;

    this.contactService.envoyer(this.contact).subscribe({
      next: () => {
        this.success = true;
        this.loading = false;
        // Réinitialiser le formulaire
        this.contact = {
          nom: '',
          prenom: '',
          email: '',
          telephone: '',
          message: ''
        };
        // Scroll to top pour voir le message
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (err) => {
        console.error('Erreur envoi contact:', err);
        this.error = 'Erreur lors de l\'envoi du message. Veuillez réessayer.';
        this.loading = false;
      }
    });
  }

  resetForm(): void {
    this.contact = {
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      message: ''
    };
    this.error = '';
    this.success = false;
  }
}
