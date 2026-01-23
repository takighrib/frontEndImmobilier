import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ContactService, ContactWithId } from '../../services/contact.service';


@Component({
  selector: 'app-admin-contacts',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-contacts.component.html',
  styleUrl: './admin-contacts.component.css'
})
export class AdminContactsComponent implements OnInit {
  contacts: ContactWithId[] = [];
  contactsFiltered: ContactWithId[] = [];
  loading = true;
  error = '';

  // Filtres
  searchTerm = '';
  filterTraite = '';

  // Modal
  selectedContact: ContactWithId | null = null;
  showModal = false;

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(): void {
    this.loading = true;
    this.error = '';

    this.contactService.getAllContacts().subscribe({
      next: (data) => {
        this.contacts = data;
        this.contactsFiltered = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement contacts:', err);
        this.error = 'Erreur lors du chargement des demandes';
        this.loading = false;
      }
    });
  }

  filterContacts(): void {
    this.contactsFiltered = this.contacts.filter(contact => {
      const matchSearch = !this.searchTerm || 
        contact.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        contact.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        contact.telephone.includes(this.searchTerm);
      
      const matchTraite = !this.filterTraite || 
        (this.filterTraite === 'traite' && this.isTraite(contact)) ||
        (this.filterTraite === 'non-traite' && !this.isTraite(contact));

      return matchSearch && matchTraite;
    });
  }

  openModal(contact: ContactWithId): void {
    this.selectedContact = contact;
    this.showModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedContact = null;
    document.body.style.overflow = '';
  }

  toggleTraite(contact: ContactWithId): void {
    // Toggle entre NOUVEAU et TRAITE
    const newStatut = this.isTraite(contact) ? 'NOUVEAU' : 'TRAITE';
    const updatedContact = { ...contact, statut: newStatut };
    
    this.contactService.updateContact(contact.id, updatedContact).subscribe({
      next: () => {
        contact.statut = newStatut;
        console.log('Statut mis à jour');
      },
      error: (err) => {
        console.error('Erreur mise à jour:', err);
        alert('Erreur lors de la mise à jour');
      }
    });
  }

  deleteContact(contact: ContactWithId): void {
    if (!confirm(`Supprimer la demande de ${contact.prenom} ${contact.nom} ?`)) {
      return;
    }

    this.contactService.deleteContact(contact.id).subscribe({
      next: () => {
        this.loadContacts();
      },
      error: (err) => {
        console.error('Erreur suppression:', err);
        alert('Erreur lors de la suppression');
      }
    });
  }

  // ✅ Méthode corrigée pour formater la date
  formatDate(dateString: string | null | undefined): string {
    if (!dateString) {
      return 'Date non disponible';
    }
    
    try {
      const date = new Date(dateString);
      
      // Vérifier si la date est valide
      if (isNaN(date.getTime())) {
        return 'Date invalide';
      }
      
      return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      console.error('Erreur formatage date:', error);
      return 'Date invalide';
    }
  }

  // ✅ Méthode helper pour vérifier si traité
  isTraite(contact: ContactWithId): boolean {
    return contact.statut === 'TRAITE';
  }

  // ✅ Getter pour bienId
  getBienId(contact: ContactWithId): number | null {
    return contact.bien?.id || null;
  }

  get contactsNonTraites(): number {
    return this.contacts.filter(c => !this.isTraite(c)).length;
  }

  get contactsTraites(): number {
    return this.contacts.filter(c => this.isTraite(c)).length;
  }
}